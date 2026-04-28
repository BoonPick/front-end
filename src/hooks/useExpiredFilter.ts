import { useEffect, useState } from "react";

const STORAGE_KEY = "boonpick_show_expired";

function readStored(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function useExpiredFilter() {
  const [showExpired, setShowExpiredState] = useState<boolean>(readStored);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setShowExpiredState(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setShowExpired = (v: boolean) => {
    if (v) localStorage.setItem(STORAGE_KEY, "1");
    else localStorage.removeItem(STORAGE_KEY);
    setShowExpiredState(v);
  };

  return { showExpired, setShowExpired };
}
