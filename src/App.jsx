import { useState, useEffect } from "react";
import { useWavoState } from "./state/useWavoState";
import { supabase } from "./lib/supabase";

import FeedScreen from "./screens/FeedScreen";
import NearbyScreen from "./screens/NearbyScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";

import IntentFlow from "./overlays/IntentFlow";
import AlertPopup from "./overlays/AlertPopup";
import MatchPopup from "./overlays/MatchPopup";

export default function App() {
  const [screen, setScreen] = useState(null); // null = loading

  const {
    userState,
    showIntentFlow, setShowIntentFlow,
    showAlert, showMatch, setShowMatch,
    activeWave, activeMatch,
    wavedIds, sendWave,
    goLive, goOffline,
    acceptWave, ignoreWave,
    formatTime,
  } = useWavoState();

  // Check for existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setScreen("feed");
      } else {
        setScreen("signup");
      }
    });
  }, []);

  const nav = {
    onGoFeed: () => setScreen("feed"),
    onGoNearby: () => setScreen("nearby"),
    onGoChat: () => setScreen("chat"),
    onGoProfile: () => setScreen("profile"),
    onOpenIntentFlow: () => setShowIntentFlow(true),
  };

  const sharedProps = {
    userState,
    wavedIds,
    sendWave,
    formatTime,
    goOffline,
    ...nav,
  };

  // Loading state while checking session
  if (screen === null) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#070B14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(0,200,255,0.2)",
          borderTop: "3px solid #00c8ff",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0C0C14; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes mpulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(167,139,250,0.5); }
          50% { opacity:0.7; box-shadow:0 0 0 5px rgba(167,139,250,0); }
        }
        @keyframes youPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(167,139,250,0.4); }
          50% { box-shadow:0 0 0 12px rgba(167,139,250,0); }
        }
      `}</style>

      {/* AUTH SCREENS */}
      {screen === "signup" && (
        <SignupScreen
          onGoLogin={() => setScreen("login")}
          onSignupSuccess={(user) => { console.log("signed up:", user); setScreen("feed"); }}
        />
      )}
      {screen === "login" && (
        <LoginScreen
          onGoSignup={() => setScreen("signup")}
          onLoginSuccess={(user) => { console.log("logged in:", user); setScreen("feed"); }}
        />
      )}

      {/* MAIN SCREENS */}
      {screen === "feed" && <FeedScreen {...sharedProps} />}
      {screen === "nearby" && <NearbyScreen {...sharedProps} />}
      {screen === "chat" && <ChatScreen onGoFeed={nav.onGoFeed} onGoNearby={nav.onGoNearby} onGoProfile={nav.onGoProfile} />}
      {screen === "profile" && <ProfileScreen onGoFeed={nav.onGoFeed} onGoNearby={nav.onGoNearby} onGoChat={nav.onGoChat} />}

      {/* OVERLAYS — layer on top of any screen */}
      {showIntentFlow && (
        <IntentFlow
          onClose={() => setShowIntentFlow(false)}
          onGoLive={goLive}
        />
      )}

      {showAlert && activeWave && (
        <AlertPopup
          wave={activeWave}
          onAccept={acceptWave}
          onIgnore={ignoreWave}
        />
      )}

      {showMatch && activeMatch && (
        <MatchPopup
          match={activeMatch}
          onViewChat={() => { setShowMatch(false); setScreen("chat"); }}
          onStayNearby={() => { setShowMatch(false); setScreen("nearby"); }}
        />
      )}
    </>
  );
}
