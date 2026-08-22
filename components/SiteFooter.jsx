import site from "@/data/site.json";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page py-8 text-sm text-ink-faint">
        <p>{site.footer.copyright}</p>
        <p className="mt-1">{site.footer.note}</p>
      </div>
    </footer>
  );
}
