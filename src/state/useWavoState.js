import { useState, useEffect, useRef } from "react";

const WINDOW_SECONDS = 300; // 5 minutes
const STORAGE_KEY = "wavo_live_state";

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const secondsLeft = Math.floor((saved.liveUntil - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { ...saved, timeLeft: secondsLeft };
  } catch {
    return null;
  }
}

function persistState(state) {
  try {
    if (state.status === "live") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        status: state.status,
        intent: state.intent,
        message: state.message,
        emoji: state.emoji,
        liveUntil: state.liveUntil,
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

const DEFAULT_STATE = {
  status: "idle",
  intent: null,
  message: "",
  emoji: null,
  liveUntil: null,
  timeLeft: 0,
  waveSentTo: null,
  waveReceivedFrom: null,
  matchedWith: null,
};

export function useWavoState() {
  const persisted = loadPersistedState();

  const [userState, setUserState] = useState(
    persisted
      ? { ...DEFAULT_STATE, ...persisted }
      : DEFAULT_STATE
  );

  const [showIntentFlow, setShowIntentFlow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [activeWave, setActiveWave] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  const [wavedIds, setWavedIds] = useState([]);

  const timerRef = useRef(null);

  // PERSIST whenever state changes
  useEffect(() => {
    persistState(userState);
  }, [userState]);

  // COUNTDOWN TIMER
  useEffect(() => {
    if (userState.status === "live") {
      timerRef.current = setInterval(() => {
        setUserState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current);
            localStorage.removeItem(STORAGE_KEY);
            return { ...DEFAULT_STATE };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [userState.status]);

  // GO LIVE
  const goLive = ({ intent, message, emoji }) => {
    const liveUntil = Date.now() + WINDOW_SECONDS * 1000;
    const newState = {
      ...DEFAULT_STATE,
      status: "live",
      intent,
      message,
      emoji,
      liveUntil,
      timeLeft: WINDOW_SECONDS,
    };
    setUserState(newState);
    persistState(newState);
  };

  // GO OFFLINE
  const goOffline = () => {
    clearInterval(timerRef.current);
    localStorage.removeItem(STORAGE_KEY);
    setUserState({ ...DEFAULT_STATE });
  };

  // SEND WAVE
  const sendWave = (userId) => {
    setUserState(prev => ({ ...prev, waveSentTo: userId }));
    setWavedIds(prev => [...prev, userId]);
  };

  // ACCEPT WAVE → MATCH
  const acceptWave = () => {
    setShowAlert(false);
    setActiveMatch({
      initials: activeWave.initials,
      name: activeWave.name,
      intent: userState.intent,
    });
    setUserState(prev => ({ ...prev, matchedWith: activeWave.id }));
    setTimeout(() => setShowMatch(true), 300);
  };

  // IGNORE WAVE
  const ignoreWave = () => {
    setShowAlert(false);
    setActiveWave(null);
    setUserState(prev => ({ ...prev, waveReceivedFrom: null }));
  };

  // FORMAT TIME
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return {
    userState,
    showIntentFlow, setShowIntentFlow,
    showAlert, showMatch, setShowMatch,
    activeWave, activeMatch,
    wavedIds, sendWave,
    goLive, goOffline,
    acceptWave, ignoreWave,
    formatTime,
  };
}