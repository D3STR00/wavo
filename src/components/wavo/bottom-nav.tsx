import { Images, Radar, MessageCircle, User as UserIcon } from "lucide-react";

import "./bottom-nav.css";

const TABS = [
  { key: "wall", label: "Wall", icon: Images },
  { key: "nearby", label: "Nearby", icon: Radar },
  { key: "chat", label: "Chat", icon: MessageCircle },
  { key: "profile", label: "Profile", icon: UserIcon },
];

export default function BottomNav({
  active,
  onWall,
  onNearby,
  onChat,
  onProfile,
}: {
  active: string;
  onWall: () => void;
  onNearby: () => void;
  onChat: () => void;
  onProfile: () => void;
}) {

  const actions = {
    wall: onWall,
    nearby: onNearby,
    chat: onChat,
    profile: onProfile,
  };

  return (
    <nav className="wavo-nav" aria-label="Wavo">
      <div className="wavo-nav-tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            aria-current={active === key ? "page" : undefined}
            onClick={actions[key as keyof typeof actions]}
          >
            <span><Icon size={20} aria-hidden="true" /></span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}