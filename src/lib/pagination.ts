/** Rejects the whole collection if any later page fails. Callers supply stable unique ordering. */
export async function allPages<T>(readPage: (offset: number, size: number) => Promise<T[]>, size = 1000): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; ) {
    const page = await readPage(offset, size);
    rows.push(...page);
    if (page.length === 0) return rows;
    offset += page.length;
  }
}
