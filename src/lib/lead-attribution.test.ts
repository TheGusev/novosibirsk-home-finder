import { beforeEach, describe, expect, it } from "vitest";
import { captureAttribution, leadAttribution } from "./lead-attribution";
describe("lead attribution", () => {
  beforeEach(() => { sessionStorage.clear(); window.history.replaceState({}, "", "/"); });
  it("keeps all four UTM values after navigating to a different page", () => {
    window.history.replaceState({}, "", "/?utm_source=yandex&utm_medium=cpc&utm_campaign=apartments&utm_term=two_rooms");
    captureAttribution(); window.history.replaceState({}, "", "/kvartira/demo-1");
    expect(leadAttribution()).toMatchObject({ utm_source: "yandex", utm_medium: "cpc", utm_campaign: "apartments", utm_term: "two_rooms" });
  });
  it("records the page where the form is submitted, not the landing page", () => {
    captureAttribution(); window.history.replaceState({}, "", "/kontakty");
    expect(leadAttribution().source_page).toBe("/kontakty");
  });
});