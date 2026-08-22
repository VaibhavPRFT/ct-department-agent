export default function StatusPill({ status }) {
  return (
    <span className="pill-solid">
      {String(status || "").toUpperCase()}
    </span>
  );
}
