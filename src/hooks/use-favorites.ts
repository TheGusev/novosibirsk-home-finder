import { useCallback, useEffect, useState } from "react";
import { metrikaGoal } from "@/lib/metrika";

// Временное хранилище; после регистрации перенесём в базу.
const KEY = "kluchberi:favorites";
const EVT = "kluchberi:favorites-change";

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
    if (!cur.includes(id)) {
      window.__lovableEvents?.track?.("project.add_favorite", {});
      metrikaGoal("add_favorite");
    }
  }, []);
  return { ids, has: (id: string) => ids.includes(id), toggle };
}
