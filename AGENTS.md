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
- All site forms submit through `submitLead` (`src/lib/leads.ts`) into the insert-only `leads` table with a `kind` — one place to validate and later hook notifications.
- Rental catalog on /arenda renders only when `site_settings.rental_catalog_enabled` is true AND active rentals exist — no empty catalog shown.
- `complexes.commission_note` is admin-filled only; never write "без комиссии" in code for resale or rentals.
