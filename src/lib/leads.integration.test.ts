import { describe, expect, it } from "vitest";

// Opt-in live checks. Test rows must be removed by their returned IDs after a run.
const url = import.meta.env['VITE_SUPABASE_URL'];
const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
const enabled = process.env['RUN_LEAD_INTEGRATION'] === "1" && Boolean(url && key);
const phone = `+7999${String(Date.now()).slice(-7)}`;
const payload = { name: "QA leads integration", type: "callback", phone, consent: true, source_page: "/kontakty", website: "" };
async function submit(input: Record<string, unknown>) {
  if (!url || !key) throw new Error("Missing public test configuration");
  const response = await fetch(`${url}/rest/v1/rpc/create_lead`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ payload: input }) });
  return { ok: response.ok, body: await response.text() };
}
describe.skipIf(!enabled)("live lead access and spam rules", () => {
  it("saves exactly three, then blocks the fourth for fifteen minutes", async () => {
    for (let i = 0; i < 3; i++) expect((await submit(payload)).ok).toBe(true);
    const fourth = await submit(payload);
    expect(fourth.ok).toBe(false); expect(fourth.body).toContain("RATE_LIMIT");
  }, 30_000);
  it("rejects an unchecked consent even through direct RPC", async () => {
    const result = await submit({ ...payload, phone: "+79990009002", consent: false });
    expect(result.ok).toBe(false); expect(result.body).toContain("CONSENT_REQUIRED");
  });
  it("blocks the honeypot even through direct RPC", async () => {
    const result = await submit({ ...payload, website: "spam" });
    expect(result.ok).toBe(false); expect(result.body).toContain("SPAM_BLOCKED");
  });
  it("rejects a non-Russian phone even through direct RPC", async () => {
    const result = await submit({ ...payload, phone: "+12025550123" });
    expect(result.ok).toBe(false); expect(result.body).toContain("INVALID_PHONE");
  });
  it("does not expose leads to anonymous visitors", async () => {
    if (!url || !key) throw new Error("Missing public test configuration");
    const result = await fetch(`${url}/rest/v1/leads?select=id`, { headers: { apikey: key } });
    expect(result.status).toBe(401);
  });
});