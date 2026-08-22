<#
.SYNOPSIS
    Mirrors a Next.js / Vercel site for offline browsing.

.EXAMPLE
    .\Mirror-Site.ps1
    .\Mirror-Site.ps1 -Url "https://example.com" -OutDir "C:\mirrors\example" -MaxPages 1000
#>

[CmdletBinding()]
param(
    [string]$Url      = "https://commercetools-insights.vercel.app",
    [string]$OutDir   = ".\site-mirror",
    [int]   $MaxPages = 500,
    [int]   $DelayMs  = 150
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root    = [Uri]$Url
$host_   = $root.Host
$UA      = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

$seen    = [System.Collections.Generic.HashSet[string]]::new()
$queue   = [System.Collections.Generic.Queue[string]]::new()
$failed  = [System.Collections.Generic.List[string]]::new()
$pages   = 0
$assets  = 0

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$OutDir = (Resolve-Path $OutDir).Path

# ---------------------------------------------------------------- helpers ---

function Resolve-Link {
    param([string]$Link, [Uri]$Base)
    if ([string]::IsNullOrWhiteSpace($Link)) { return $null }
    $Link = $Link.Trim()
    if ($Link -match '^(#|mailto:|tel:|javascript:|data:|blob:)') { return $null }
    try   { $u = [Uri]::new($Base, $Link) } catch { return $null }
    if ($u.Scheme -notin 'http','https') { return $null }
    if ($u.Host -ne $host_)              { return $null }   # stay on-site
    return ($u.GetLeftPart([UriPartial]::Path))             # drop #fragment and ?query
}

function Get-LocalPath {
    param([string]$AbsUrl)
    $p = ([Uri]$AbsUrl).AbsolutePath
    if ($p.EndsWith('/')) { $p += 'index.html' }
    elseif (-not [IO.Path]::GetExtension($p)) { $p += '/index.html' }
    $p = $p.TrimStart('/') -replace '/', '\'
    # strip characters Windows won't allow in filenames
    $p = ($p -split '\\' | ForEach-Object { $_ -replace '[<>:"|?*]', '_' }) -join '\'
    return (Join-Path $OutDir $p)
}

function Get-Links {
    param([string]$Text, [Uri]$Base, [switch]$IsHtml)

    $found = [System.Collections.Generic.List[string]]::new()

    # href="..." / src="..." / poster="..."
    foreach ($m in [regex]::Matches($Text, '(?i)\s(?:href|src|data-src|poster)\s*=\s*["'']([^"''>]+)["'']')) {
        $found.Add($m.Groups[1].Value)
    }
    # srcset="a.png 1x, b.png 2x"
    foreach ($m in [regex]::Matches($Text, '(?i)\ssrcset\s*=\s*["'']([^"'']+)["'']')) {
        foreach ($cand in $m.Groups[1].Value -split ',') {
            $found.Add(($cand.Trim() -split '\s+')[0])
        }
    }
    # CSS url(...)
    foreach ($m in [regex]::Matches($Text, '(?i)url\(\s*["'']?([^"''\)]+)["'']?\s*\)')) {
        $found.Add($m.Groups[1].Value)
    }
    # Next.js chunk paths embedded in inline JSON / build manifests
    foreach ($m in [regex]::Matches($Text, '["''](/?_next/static/[^"''\\\s]+)["'']')) {
        $found.Add($m.Groups[1].Value)
    }

    $out = [System.Collections.Generic.List[string]]::new()
    foreach ($f in $found) {
        $r = Resolve-Link -Link $f -Base $Base
        if ($r) { $out.Add($r) }
    }
    return $out
}

function Save-Bytes {
    param([byte[]]$Bytes, [string]$Path)
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [IO.File]::WriteAllBytes($Path, $Bytes)
}

# ------------------------------------------------------------------ crawl ---

$queue.Enqueue($root.GetLeftPart([UriPartial]::Path).TrimEnd('/') + '/')
[void]$seen.Add($queue.Peek())

# seed from sitemap.xml if the site publishes one
try {
    $sm = Invoke-WebRequest -Uri "$($root.GetLeftPart([UriPartial]::Authority))/sitemap.xml" `
                            -UseBasicParsing -UserAgent $UA -TimeoutSec 20
    $locs = [regex]::Matches($sm.Content, '(?<=<loc>)[^<]+')
    Write-Host "sitemap.xml: $($locs.Count) URLs" -ForegroundColor DarkGray
    foreach ($l in $locs) {
        $u = Resolve-Link -Link $l.Value -Base $root
        if ($u -and $seen.Add($u)) { $queue.Enqueue($u) }
    }
} catch {
    Write-Host "sitemap.xml: not available" -ForegroundColor DarkGray
}

Write-Host "`nMirroring $host_ -> $OutDir`n" -ForegroundColor Cyan

while ($queue.Count -gt 0 -and $pages -lt $MaxPages) {
    $u    = $queue.Dequeue()
    $dest = Get-LocalPath $u

    try {
        $resp = Invoke-WebRequest -Uri $u -UseBasicParsing -UserAgent $UA -TimeoutSec 30
    } catch {
        $failed.Add("$u  ::  $($_.Exception.Message)")
        Write-Host "  FAIL  $u" -ForegroundColor Red
        continue
    }

    $ctype = ($resp.Headers['Content-Type'] | Select-Object -First 1)
    $bytes = $resp.RawContentStream.ToArray()

    $isHtml = $ctype -match 'text/html'
    $isText = $isHtml -or ($ctype -match 'text/css|javascript|json|xml|svg')

    # an extensionless URL that returned HTML must land in a folder as index.html
    if ($isHtml -and -not $dest.EndsWith('.html')) { $dest = Join-Path $dest 'index.html' }

    Save-Bytes -Bytes $bytes -Path $dest

    if ($isHtml) {
        $pages++
        Write-Host ("  [{0,3}] {1}" -f $pages, $u) -ForegroundColor Green
    } else {
        $assets++
        Write-Host ("        {0}" -f $u) -ForegroundColor DarkGray
    }

    # follow links out of HTML, CSS and JS (chunk manifests live in JS)
    if ($isText) {
        $text = [Text.Encoding]::UTF8.GetString($bytes)
        foreach ($link in Get-Links -Text $text -Base ([Uri]$u)) {
            if ($seen.Add($link)) { $queue.Enqueue($link) }
        }
    }

    Start-Sleep -Milliseconds $DelayMs
}

# ---------------------------------------------------- absolute-URL rewrite ---

Write-Host "`nRewriting absolute links to root-relative..." -ForegroundColor Cyan
$rewritten = 0
Get-ChildItem $OutDir -Recurse -File -Include *.html,*.css,*.js,*.json,*.svg | ForEach-Object {
    $c = [IO.File]::ReadAllText($_.FullName)
    $n = $c -replace [regex]::Escape("https://$host_"), '' -replace [regex]::Escape("http://$host_"), ''
    if ($n -ne $c) { [IO.File]::WriteAllText($_.FullName, $n); $rewritten++ }
}

# ----------------------------------------------------------------- report ---

Write-Host "`n─────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "  pages     : $pages"
Write-Host "  assets    : $assets"
Write-Host "  rewritten : $rewritten files"
Write-Host "  failed    : $($failed.Count)"
Write-Host "  output    : $OutDir"
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Cyan

if ($failed.Count) {
    $failed | Set-Content (Join-Path $OutDir '_failed.txt')
    Write-Host "Failures logged to _failed.txt" -ForegroundColor Yellow
}

Write-Host "Now run:  .\Serve-Site.ps1 -Path `"$OutDir`"" -ForegroundColor White
