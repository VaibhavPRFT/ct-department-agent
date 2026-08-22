<#
.SYNOPSIS
    Minimal static file server. The mirror must be served over http:// —
    opening the files directly with file:// breaks Next.js chunk loading.

.EXAMPLE
    .\Serve-Site.ps1 -Path .\site-mirror -Port 8080
#>

[CmdletBinding()]
param(
    [string]$Path = ".\site-mirror",
    [int]   $Port = 8080
)

$ErrorActionPreference = 'Stop'
$Path = (Resolve-Path $Path).Path

$mime = @{
    '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'
    '.css'='text/css; charset=utf-8';   '.js'='application/javascript; charset=utf-8'
    '.mjs'='application/javascript; charset=utf-8'
    '.json'='application/json';         '.xml'='application/xml'
    '.svg'='image/svg+xml';             '.png'='image/png'
    '.jpg'='image/jpeg';                '.jpeg'='image/jpeg'
    '.gif'='image/gif';                 '.webp'='image/webp'
    '.avif'='image/avif';               '.ico'='image/x-icon'
    '.woff'='font/woff';                '.woff2'='font/woff2'
    '.ttf'='font/ttf';                  '.otf'='font/otf'
    '.mp4'='video/mp4';                 '.webm'='video/webm'
    '.txt'='text/plain; charset=utf-8'
}

$listener = [Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")

try { $listener.Start() }
catch {
    Write-Host "Could not bind to port $Port. Try another port, e.g. -Port 8081" -ForegroundColor Red
    exit 1
}

Write-Host "`nServing $Path" -ForegroundColor Cyan
Write-Host "  http://localhost:$Port" -ForegroundColor Green
Write-Host "  Ctrl+C to stop`n" -ForegroundColor DarkGray

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $rel  = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
        $file = if ($rel) { Join-Path $Path ($rel -replace '/', '\') } else { $Path }

        # directory or extensionless route -> index.html
        if (Test-Path $file -PathType Container) { $file = Join-Path $file 'index.html' }
        elseif (-not (Test-Path $file) -and -not [IO.Path]::GetExtension($file)) {
            $file = "$file\index.html"
        }

        if (Test-Path $file -PathType Leaf) {
            $bytes = [IO.File]::ReadAllBytes($file)
            $ext   = [IO.Path]::GetExtension($file).ToLower()
            $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
            $res.StatusCode  = 200
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host ("  200  {0}" -f $req.Url.AbsolutePath) -ForegroundColor DarkGray
        } else {
            $msg = [Text.Encoding]::UTF8.GetBytes("404 - not in mirror: $($req.Url.AbsolutePath)")
            $res.StatusCode = 404
            $res.ContentType = 'text/plain; charset=utf-8'
            $res.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host ("  404  {0}" -f $req.Url.AbsolutePath) -ForegroundColor Yellow
        }
        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
