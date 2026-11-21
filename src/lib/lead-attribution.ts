const KEY = "kluchberi:lead-attribution";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term"] as const;
export function captureAttribution() {
  const query = new URLSearchParams(window.location.search);
  const attribution: Record<string, string> = {};
  for (const key of UTM) attribution[key] = (query.get(key) ?? "").slice(0, 200);
  try {
    attribution["referrer"] = document.referrer ? new URL(document.referrer).origin : "";
    if (UTM.some(k => query.has(k)) || !sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify(attribution));
  } catch { /* Forms still work when storage is unavailable. */ }
}
export function leadAttribution() {
  captureAttribution();
  let stored: Record<string, string> = {};
  try { stored = JSON.parse(sessionStorage.getItem(KEY) ?? "{}"); } catch { /* Empty attribution. */ }
  return {
    source_page: window.location.pathname.slice(0, 500),
    ...Object.fromEntries([...UTM, "referrer"].map(k => [k, typeof stored[k] === "string" ? stored[k] : ""])),
  };
}