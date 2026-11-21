import { Link } from '@tanstack/react-router';
import { COLLECTIONS } from '@/lib/seo-collections';
export function CollectionLinks({ current }: { current?: string }) {
  return <nav aria-label="Подборки квартир" className="mt-8 border-t pt-6"><h2 className="text-xl font-bold text-primary">Подборки квартир</h2><ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">{COLLECTIONS.filter(c => c.slug !== current).map(c => <li key={c.slug}><Link to="/kupit-kvartiru/$collection" params={{ collection: c.slug }} className="text-sm text-berry underline decoration-border underline-offset-4">{c.title}</Link></li>)}</ul></nav>;
}
