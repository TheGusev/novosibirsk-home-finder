import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dismissCookieNotice, isCookieNoticeDismissed } from '@/lib/cookie-notice';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setVisible(!isCookieNoticeDismissed(window.localStorage));
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => setVisible(false), 180);
    return () => window.clearTimeout(timer);
  }, [closing]);

  if (!visible) return null;

  return (
    <aside
      aria-label="Уведомление о cookies"
      className={`cookie-notice fixed inset-x-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-40 flex max-w-md items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-lift sm:left-6 sm:right-auto lg:bottom-6 ${closing ? 'cookie-notice-closing' : ''}`}
    >
      <Cookie className="hidden h-5 w-5 shrink-0 text-brand min-[360px]:block" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground">
        Используем cookies для работы сайта.{' '}
        <Link to="/politika" className="text-foreground underline underline-offset-4 hover:text-brand">Подробнее</Link>
      </p>
      <Button
        type="button"
        className="h-10 shrink-0 bg-brand text-brand-foreground shadow-none hover:bg-brand/90"
        disabled={closing}
        onClick={() => {
          dismissCookieNotice(window.localStorage);
          setClosing(true);
        }}
      >
        Понятно
      </Button>
    </aside>
  );
}