import { Loader2 } from "lucide-react";

export default function Loading({ label = "Loading…" }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <Loader2 className="loading__spinner" size={26} />
      <span>{label}</span>
    </div>
  );
}
