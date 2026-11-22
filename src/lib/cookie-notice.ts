export const COOKIE_NOTICE_KEY = 'va54:cookie-notice:v1';

export function isCookieNoticeDismissed(storage: Pick<Storage, 'getItem'>): boolean {
  try {
    return storage.getItem(COOKIE_NOTICE_KEY) === 'dismissed';
  } catch {
    return false;
  }
}

export function dismissCookieNotice(storage: Pick<Storage, 'setItem'>): void {
  try {
    storage.setItem(COOKIE_NOTICE_KEY, 'dismissed');
  } catch {
    // The notice can still close for this visit when browser storage is blocked.
  }
}