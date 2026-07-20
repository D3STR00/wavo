import { useEffect, useState } from "react";
import { intentBy, initialsFor, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";

export type IncomingWave = {
  waveId: string;
  fromUserId: string;
  fromName: string;
  intent: IntentKind;
};

export function WavoAlert({
  wave,
  onWaveBack,
  onPass,
}: {
  wave: IncomingWave | null;
  onWaveBack: (w: IncomingWave) => void;
  onPass: (w: IncomingWave) => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(20);

  useEffect(() => {
    if (!wave) return;
    setSecondsLeft(20);
    const iv = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(iv);
          onPass(wave);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wave?.waveId]);

  if (!wave) return null;
  const intent = intentBy(wave.intent);

  return (
    <div className="fixed inset-x-3 top-3 z-50 mx-auto max-w-md animate-in slide-in-from-top-4 fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-purple/90 to-brand-teal/90 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur">
        <span
          className={cn(
            "pointer-events-none absolute -top-10 -right-6 h-32 w-32 rounded-full blur-3xl opacity-50",
            intent.glow,
          )}
        />
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-white/30",
              intent.glow,
            )}
          >
            {initialsFor(wave.fromName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
              Wavo · incoming
            </p>
            <p className="truncate font-semibold text-white">
              {wave.fromName} wants to join your vibe · {intent.emoji} {intent.label}
            </p>
          </div>
          <span className="text-xs font-medium text-white/70 tabular-nums">
            {secondsLeft}s
          </span>
        </div>
        <div className="relative mt-3 flex gap-2">
          <button
            onClick={() => onPass(wave)}
            className="flex-1 rounded-full bg-white/10 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/20 hover:bg-white/15"
          >
            Ignore
          </button>
          <button
            onClick={() => onWaveBack(wave)}
            className="flex-[2] rounded-full bg-white py-2 text-sm font-bold text-brand-purple hover:bg-white/95"
          >
            👋 Wave back
          </button>
        </div>
      </div>
    </div>
  );
}
