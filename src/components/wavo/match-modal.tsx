import { Link } from "react-router-dom";
import { intentBy, initialsFor, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";

export type MatchInfo = {
  matchId: string;
  name: string;
  intent: IntentKind;
};

export function MatchModal({
  match,
  onClose,
}: {
  match: MatchInfo | null;
  onClose: () => void;
}) {
  if (!match) return null;
  const i = intentBy(match.intent);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple to-brand-teal p-6 text-center shadow-2xl ring-1 ring-white/20 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={cn(
            "pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full blur-3xl opacity-50",
            i.glow,
          )}
        />
        <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/80">
          Wavo
        </p>
        <h2 className="relative mt-2 font-display text-4xl font-black text-white">
          It's a match
        </h2>
        <div
          className={cn(
            "relative mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white ring-4 ring-white/30",
            i.glow,
          )}
        >
          {initialsFor(match.name)}
        </div>
        <p className="relative mt-3 text-lg font-semibold text-white">
          You & {match.name}
        </p>
        <p className="relative text-sm text-white/80">
          {i.emoji} {i.label}
        </p>

        <div className="relative mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-white/10 py-3 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/20"
          >
            Later
          </button>
          <Link
            to="/chat/$matchId"
            params={{ matchId: match.matchId }}
            onClick={onClose}
            className="flex-[2] rounded-full bg-white py-3 text-sm font-bold text-brand-purple hover:bg-white/95"
          >
            Say hi
          </Link>
        </div>
      </div>
    </div>
  );
}
