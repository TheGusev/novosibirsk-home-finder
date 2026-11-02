/** Ключ с головкой-ягодой */
export function KeyIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`key-icon ${className}`} fill="none" aria-hidden="true">
      <path d="M10 4.5c1-1.2 2.6-1.2 3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.7 4.6 11.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.5 6.5c-4 0-6.5 2.8-6.5 6.2 0 3.6 3 6.3 6.5 6.3s6.5-2.7 6.5-6.3c0-3.4-2.5-6.2-6.5-6.2Z" fill="currentColor" />
      <circle cx="9.3" cy="11" r="0.9" className="fill-background" />
      <circle cx="12.6" cy="13.6" r="0.9" className="fill-background" />
      <circle cx="9.8" cy="15.4" r="0.9" className="fill-background" />
      <path d="M17.6 12.7H29M25 12.7v4M28 12.7v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
