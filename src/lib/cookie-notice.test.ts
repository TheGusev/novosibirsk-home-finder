import { describe, expect, it, vi } from 'vitest';
import { COOKIE_NOTICE_KEY, dismissCookieNotice, isCookieNoticeDismissed } from './cookie-notice';

describe('cookie notice dismissal', () => {
  it('shows on a first visit', () => {
    expect(isCookieNoticeDismissed({ getItem: () => null })).toBe(false);
  });
  it('remembers dismissal on subsequent visits', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    };
    dismissCookieNotice(storage);
    expect(values.get(COOKIE_NOTICE_KEY)).toBe('dismissed');
    expect(isCookieNoticeDismissed(storage)).toBe(true);
  });
  it('still works when storage is blocked', () => {
    const getItem = vi.fn(() => { throw new Error('Blocked'); });
    const setItem = vi.fn(() => { throw new Error('Blocked'); });
    expect(isCookieNoticeDismissed({ getItem })).toBe(false);
    expect(() => dismissCookieNotice({ setItem })).not.toThrow();
  });
});