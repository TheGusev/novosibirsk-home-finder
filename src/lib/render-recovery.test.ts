import { describe, expect, it } from "vitest";
import {
  RENDER_RECOVERY,
  RECOVERY_HEALTHY_MS,
  RECOVERY_MAX_RELOADS,
  RECOVERY_MIN_INTERVAL_MS,
  RECOVERY_STORAGE_KEY,
} from "./render-recovery";

describe("recovery after a blank preview screen", () => {
  it("reloads only for stale-module and hydration failures, and only when the screen is blank", () => {
    expect(RENDER_RECOVERY).toContain("Hydration failed");
    expect(RENDER_RECOVERY).toContain("is not an object");
    expect(RENDER_RECOVERY).toContain("Cannot read properties of undefined");
    expect(RENDER_RECOVERY).toContain("innerText.trim().length<40");
  });

  it("caps reloads at 3, waits 3s between them and clears the counter after 10s healthy", () => {
    expect(RECOVERY_MAX_RELOADS).toBe(3);
    expect(RECOVERY_MIN_INTERVAL_MS).toBe(3000);
    expect(RECOVERY_HEALTHY_MS).toBe(10000);
    expect(RENDER_RECOVERY).toContain(`MAX=${RECOVERY_MAX_RELOADS}`);
    expect(RENDER_RECOVERY).toContain(`MIN=${RECOVERY_MIN_INTERVAL_MS}`);
    expect(RENDER_RECOVERY).toContain(`HEALTHY=${RECOVERY_HEALTHY_MS}`);
    expect(RENDER_RECOVERY).toContain(RECOVERY_STORAGE_KEY);
  });

  it("never emits a closing script tag that would break the head", () => {
    expect(RENDER_RECOVERY).not.toContain("</scr" + "ipt>");
  });
});
