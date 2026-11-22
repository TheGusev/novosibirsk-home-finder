import { describe, expect, it, vi } from "vitest";
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

  function runRecovery(blank = true) {
    const listeners = new Map<string, (event: { message?: string; reason?: Error }) => void>();
    const storage = new Map<string, string>();
    const timers: { callback: () => void; delay: number }[] = [];
    const reload = vi.fn();
    new Function('window', 'document', 'sessionStorage', 'location', 'setTimeout', RENDER_RECOVERY)(
      { addEventListener: (name: string, callback: (event: { message?: string; reason?: Error }) => void) => listeners.set(name, callback) },
      { body: { innerText: blank ? '' : 'A fully rendered page with more than forty characters of content.' } },
      { getItem: (key: string) => storage.get(key), setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) },
      { reload },
      (callback: () => void, delay: number) => timers.push({ callback, delay }),
    );
    return { listeners, reload, flush: () => timers.filter(timer => timer.delay === 300).forEach(timer => timer.callback()) };
  }

  it('recovers a blank screen from the reported missing lucide factory', () => {
    const recovery = runRecovery();
    recovery.listeners.get('error')?.({ message: 'No factory registered for module node_modules/lucide-react/dist/esm/lucide-react.js' });
    recovery.flush();
    expect(recovery.reload).toHaveBeenCalledTimes(1);
  });

  it('recovers missing module factories reported as rejected imports', () => {
    const recovery = runRecovery();
    recovery.listeners.get('unhandledrejection')?.({ reason: new Error('No factory registered for module node_modules/lucide-react/dist/esm/lucide-react.js') });
    recovery.flush();
    expect(recovery.reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload a nonblank page for a module factory failure', () => {
    const recovery = runRecovery(false);
    recovery.listeners.get('error')?.({ message: 'No factory registered for module lucide-react' });
    recovery.flush();
    expect(recovery.reload).not.toHaveBeenCalled();
  });
});
