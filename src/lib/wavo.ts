// Wavo domain constants + helpers. Keep tiny — the whole product is one loop.

export type IntentKind =
  | "coffee"
  | "walk"
  | "talk"
  | "gym"
  | "food"
  | "study"
  | "party"
  | "chill";

export const INTENTS: {
  kind: IntentKind;
  label: string;
  emoji: string;
  /** semantic token classes (map to per-intent color world in styles.css) */
  bg: string;
  glow: string;
  ring: string;
  buttonFrom: string;
  buttonTo: string;
}[] = [
  {
    kind: "coffee",
    label: "Coffee",
    emoji: "☕",
    bg: "bg-coffee",
    glow: "bg-coffee-glow",
    ring: "ring-coffee-glow",
    buttonFrom: "from-coffee-glow",
    buttonTo: "to-coffee",
  },
  {
    kind: "walk",
    label: "Walk",
    emoji: "🚶",
    bg: "bg-walk",
    glow: "bg-walk-glow",
    ring: "ring-walk-glow",
    buttonFrom: "from-walk-glow",
    buttonTo: "to-walk",
  },
  {
    kind: "talk",
    label: "Talk",
    emoji: "💬",
    bg: "bg-talk",
    glow: "bg-talk-glow",
    ring: "ring-talk-glow",
    buttonFrom: "from-talk-glow",
    buttonTo: "to-talk",
  },
  {
    kind: "gym",
    label: "Gym",
    emoji: "🏋️",
    bg: "bg-gym",
    glow: "bg-gym-glow",
    ring: "ring-gym-glow",
    buttonFrom: "from-gym-glow",
    buttonTo: "to-gym",
  },
  {
    kind: "food",
    label: "Food",
    emoji: "🍜",
    bg: "bg-food",
    glow: "bg-food-glow",
    ring: "ring-food-glow",
    buttonFrom: "from-food-glow",
    buttonTo: "to-food",
  },
  {
    kind: "study",
    label: "Study",
    emoji: "📚",
    bg: "bg-study",
    glow: "bg-study-glow",
    ring: "ring-study-glow",
    buttonFrom: "from-study-glow",
    buttonTo: "to-study",
  },
  {
    kind: "party",
    label: "Party",
    emoji: "🎉",
    bg: "bg-party",
    glow: "bg-party-glow",
    ring: "ring-party-glow",
    buttonFrom: "from-party-glow",
    buttonTo: "to-party",
  },
  {
    kind: "chill",
    label: "Chill",
    emoji: "🌙",
    bg: "bg-chill",
    glow: "bg-chill-glow",
    ring: "ring-chill-glow",
    buttonFrom: "from-chill-glow",
    buttonTo: "to-chill",
  },
];

export const intentBy = (k: IntentKind) => INTENTS.find((i) => i.kind === k)!;

export function initialsFor(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

/** Deterministic pseudo-distance from a user id so the UI feels alive
 *  until real geolocation lands. */
export function fakeDistance(id: string): string {
  const n = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const min = (n % 12) + 2;
  return `${min} min walk`;
}
