// Replace null with your actual Yandex Metrika counter ID. No placeholder request is sent.
export const METRIKA_COUNTER_ID: number | null = null; // [заполнить]
type Goal = "view_property" | "click_phone" | "open_form" | "submit_lead" | "use_filter" | "add_favorite" | "calc_mortgage";
declare global {
  interface Window { ym?: ((id: number, method: string, ...args: unknown[]) => void) & { a?: unknown[][]; l?: number }; }
}
export function initializeMetrika() {
  if (!METRIKA_COUNTER_ID || window.ym) return;
  const ym: NonNullable<Window["ym"]> = (...args) => { ym.a?.push(args); };
  ym.a = []; ym.l = Date.now(); window.ym = ym;
  const script = document.createElement("script");
  script.async = true; script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(script);
  ym(METRIKA_COUNTER_ID, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
}
export function metrikaGoal(goal: Goal, properties: Record<string, unknown> = {}) {
  if (METRIKA_COUNTER_ID) window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal, properties);
}