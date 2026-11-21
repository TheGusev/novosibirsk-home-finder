<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules
- Catalog: title, "Найдено N", filter chips, list and map all derive from `applyFilters(rows, filters)` in `src/lib/catalog.ts` — keeps them from ever disagreeing.
- Search params are flat strings (custom parse/stringify in `src/router.tsx`) so filter URLs stay shareable like `?rooms=2&price_to=6000000`.
- Favorites live in localStorage via `useFavorites`; move to the database once user accounts exist.
- All site forms use submitLead and the validated saveLead server function; the create_lead RPC atomically enforces consent, canonical phone, initial state, honeypot and a phone-based submission limit. Preserve legacy kind alongside canonical type for compatibility.
- Lead SELECT is staff-only through protected user_roles; public creation uses a narrow RPC rather than direct INSERT to prevent bypassing the submission limit.
- Lovable event calls stay at successful interaction handlers; metrika.ts only initializes Yandex and mirrors goals without personal data. An unset counter disables Yandex requests.
- Rental catalog on /arenda renders only when `site_settings.rental_catalog_enabled` is true AND active rentals exist — no empty catalog shown.
- `complexes.commission_note` is admin-filled only; never write "без комиссии" in code for resale or rentals.

- Public page data is fetched with session-free public server functions and paginated reads; route loaders prime Query to expose content in SSR independently of browser sessions.
- SEO collections share catalog filtering; settings control their active-object threshold, and more than two logical filters use noindex with the nearest collection canonical.
- Sitemap static entries derive from required route staticData.sitemap decisions; dynamic entries use public, paginated active content and omit non-authoritative lastmod.
- Canonical/OG URLs use the deployed public origin until a verified domain move; organization identity may retain the business URL separately.

- Confirmed contact values live in the shared contact module; phone-based messenger links must not invent usernames or MAX profile URLs.
- Room tours go through `getTour()` in `src/lib/tour/adapter.ts` with typed Tour/TourScene/TourHotspot; the demo tour is never attached to a real property, so swapping in DB tours needs no component changes.
- Brand name, domain and requisites live only in `src/config/site.ts`; Organization JSON-LD and title suffix render only once a real name and domain are set, so placeholders never reach SEO.
- Accent colour is the single `--brand` token in `src/styles.css`; components use `brand`/semantic classes only, so a rebrand is a token change.
- Preview self-heal: an inline script from `src/lib/render-recovery.ts` is injected in the root head and reloads once when a stale-module or hydration failure leaves the screen blank; keep the blank-screen check and the reload cap so a real bug cannot loop.
