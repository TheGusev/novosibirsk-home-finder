const ROOMS = [
  { id: "living", label: "Гостиная", x: 10, y: 10, w: 170, h: 130 },
  { id: "kitchen", label: "Кухня", x: 190, y: 10, w: 100, h: 130 },
  { id: "hallway", label: "Прихожая", x: 10, y: 150, w: 150, h: 70 },
  { id: "bedroom", label: "Спальня", x: 170, y: 150, w: 120, h: 110 },
];
export function TourPlan({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const cur = ROOMS.find(r => r.id === active) ?? (active === "window" ? ROOMS[0] : undefined);
  return (
    <svg viewBox="0 0 300 270" role="group" aria-label="План демонстрационной квартиры" className="mt-5 w-full">
      {ROOMS.map(r => {
        const on = cur?.id === r.id;
        return (
          <g key={r.id} role="button" tabIndex={0} aria-label={`Перейти: ${r.label}`} aria-pressed={on} className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--ring)]"
            onClick={() => onPick(r.id)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(r.id); } }}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={10} strokeWidth={3}
              style={{ fill: on ? "var(--brand-soft)" : "var(--card)", stroke: on ? "var(--brand)" : "var(--primary)" }} />
            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + (on ? 22 : 5)} textAnchor="middle" fontSize={13} fontWeight={700} style={{ fill: "var(--primary)" }}>{r.label}</text>
          </g>
        );
      })}
      {cur && <circle cx={cur.x + cur.w / 2} cy={cur.y + cur.h / 2 - 6} r={8} style={{ fill: "var(--brand)", stroke: "var(--card)" }} strokeWidth={3}><title>Вы здесь</title></circle>}
    </svg>
  );
}
