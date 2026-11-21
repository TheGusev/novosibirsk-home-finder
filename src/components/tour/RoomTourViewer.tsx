import { SITE } from "@/config/site";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, DoorOpen, Expand, Info, LayoutGrid, Map as MapIcon, Minimize, Sparkles, X } from "lucide-react";
import type { TourBundle, TourHotspot } from "@/lib/tour/types";
import { clampPoint, coverPoint, resolveScene } from "@/lib/tour/geometry";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { LeadForm } from "@/components/site/LeadForm";
import { TourPlan } from "./TourPlan";

const HINT_KEY = "kb_tour_hint_seen";
type Panel = null | "plan" | "object" | "lead" | { info: TourHotspot };

export function RoomTourViewer({ bundle, room }: { bundle: TourBundle; room: string | undefined }) {
  const { tour, scenes, hotspots } = bundle;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const sceneId = resolveScene(scenes.map(s => s.id), room, tour.initial_scene_id);
  const scene = scenes.find(s => s.id === sceneId)!;
  const shell = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [intro, setIntro] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem(HINT_KEY)) setHint(true); } catch { /* storage unavailable */ } }, []);
  const [hint, setHint] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [fs, setFs] = useState(false);
  const [canFs, setCanFs] = useState(false);

  useLayoutEffect(() => {
    const el = shell.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  useEffect(() => {
    setCanFs(!!document.fullscreenEnabled);
    const on = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on); return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  // Preload connected scenes only after the current one is ready.
  useEffect(() => {
    if (!loaded[sceneId]) return;
    hotspots.filter(h => h.scene_id === sceneId && h.target_scene_id).forEach(h => {
      const t = scenes.find(s => s.id === h.target_scene_id); if (t) { const i = new Image(); i.src = t.image_url; }
    });
  }, [loaded, sceneId, hotspots, scenes]);

  const go = useCallback((id: string) => {
    if (id === sceneId) return;
    void navigate({ to: "/tur", search: { room: id }, replace: false, resetScroll: false });
  }, [navigate, sceneId]);

  const start = () => {
    setIntro(false);
    try { if (!localStorage.getItem(HINT_KEY)) setHint(true); } catch { /* storage unavailable */ }
  };
  const closeHint = () => { setHint(false); try { localStorage.setItem(HINT_KEY, "1"); } catch { /* ignore */ } };
  const toggleFs = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await shell.current?.requestFullscreen(); } catch { /* unsupported */ }
  };

  const spots = hotspots.filter(h => h.scene_id === sceneId && h.x_percent != null && h.y_percent != null);
  const switcher = scenes.filter(s => s.in_switcher).sort((a, b) => a.order - b.order);
  const ready = loaded[sceneId];
  const bad = failed[sceneId];
  const side = isMobile ? "bottom" : "right";

  return (
    <section ref={shell} aria-label={`Демонстрационный тур по квартире — ${SITE.brandName}`} className="tour-shell relative isolate w-full overflow-hidden bg-primary">
      {/* Scenes: all mounted lazily once visited, crossfade between them */}
      {scenes.map(s => (s.id === sceneId || loaded[s.id]) && (
        <img key={s.id} src={s.image_url} alt={s.id === sceneId ? s.alt : ""} aria-hidden={s.id !== sceneId}
          width={s.width} height={s.height} decoding="async" fetchPriority={s.id === tour.initial_scene_id ? "high" : "auto"}
          ref={el => { if (el?.complete && el.naturalWidth > 0 && !loaded[s.id]) queueMicrotask(() => setLoaded(l => ({ ...l, [s.id]: true }))); }}
          onLoad={() => setLoaded(l => ({ ...l, [s.id]: true }))}
          onError={() => setFailed(f => ({ ...f, [s.id]: true }))}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${s.id === sceneId && loaded[s.id] ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`} />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/35 via-transparent to-primary/45" />

      {!ready && !bad && <div role="status" className="glass absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-3 text-sm font-semibold text-primary">Загружаем «{scene.title}»…</div>}
      {bad && (
        <div role="alert" className="absolute inset-x-4 top-1/2 mx-auto max-w-sm -translate-y-1/2 rounded-lg bg-card p-5 text-sm text-primary border">
          <p className="font-bold">Не удалось загрузить сцену</p>
          <p className="mt-1 text-muted-foreground">Проверьте соединение. Каталог и связь работают как обычно.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setFailed(f => ({ ...f, [sceneId]: false }))} className="h-11 rounded-md bg-primary px-4 font-semibold text-primary-foreground">Повторить</button>
            <Link to="/kupit-kvartiru" className="inline-flex h-11 items-center rounded-md border px-4 font-semibold">Каталог</Link>
          </div>
        </div>
      )}

      {/* Top row: demo label + room label + object info */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/" aria-label="Выйти из тура" className="glass inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-primary"><X className="h-4 w-4" /> Выйти</Link>
          <span className="rounded bg-card/95 px-2 py-1 text-xs font-semibold text-primary">Демонстрационная квартира</span>
          {!intro && <span aria-live="polite" className="glass rounded-md px-3 py-1 text-xs font-semibold text-primary">{scene.title}</span>}
        </div>
        <button onClick={() => setPanel("object")} className="glass inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-4 text-sm font-semibold text-primary">
          <Info className="h-4 w-4" /> Об объекте
        </button>
      </div>

      {/* Hotspots */}
      {!intro && ready && box.w > 0 && spots.map(hs => {
        const p = coverPoint(hs.x_percent!, hs.y_percent!, scene.width, scene.height, box.w, box.h);
        if (!p.visible) return null;
        const c = clampPoint(p.x, p.y, box.w, box.h, { top: 72, bottom: isMobile ? 170 : 130, side: 40 });
        const nav = hs.type === "scene";
        return (
          <button key={hs.id} onClick={() => nav ? go(hs.target_scene_id!) : setPanel({ info: hs })}
            style={{ left: c.x, top: c.y }}
            className="group absolute flex min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md p-1.5 focus-visible:outline-none">
            <span className={`grid h-9 w-9 place-items-center rounded-full border-2 border-card shadow-soft transition group-hover:scale-110 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-ring ${nav ? "bg-brand text-brand-foreground" : "bg-card text-primary"}`}>
              {nav ? <DoorOpen className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            </span>
            <span className="glass whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold text-primary shadow-soft">{hs.label}</span>
          </button>
        );
      })}

      {/* Intro card */}
      {intro && (
        <div className="glass absolute inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] rounded-lg p-5 shadow-soft sm:inset-x-auto sm:left-5 sm:max-w-sm md:bottom-28 md:left-8 md:p-7">
          <p className="text-xl font-bold leading-tight text-primary md:text-3xl">Загляните в свой будущий дом</p>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">Исследуйте комнаты и найдите квартиру для своей жизни.</p>
          <div className="mt-4 grid gap-2 sm:flex">
            <button onClick={start} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-soft hover:brightness-110"> Начать прогулку</button>
            <Link to="/kupit-kvartiru" className="border inline-flex h-12 items-center justify-center gap-1 rounded-md border-primary/20 bg-card px-5 text-sm font-semibold text-primary">Открыть каталог <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      )}

      {hint && (
        <div role="status" className="glass absolute inset-x-3 top-16 mx-auto flex max-w-sm items-start gap-3 rounded-lg p-3 text-sm text-primary shadow-soft md:top-20">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="flex-1">Выбирайте точки перехода или комнаты внизу.</p>
          <button onClick={closeHint} aria-label="Закрыть подсказку" className="-m-2 grid h-11 w-11 place-items-center rounded-md"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-5">
        <nav aria-label="Комнаты" className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-lg p-1.5 shadow-soft">
          {switcher.map(s => (
            <button key={s.id} onClick={() => { setIntro(false); go(s.id); }} aria-current={s.id === sceneId ? "true" : undefined}
              className={`flex h-12 shrink-0 items-center gap-2 rounded-md px-2.5 text-xs md:px-3 font-semibold transition md:text-sm ${s.id === sceneId ? "bg-primary text-primary-foreground" : "text-primary hover:bg-primary/10"}`}>
              <img src={s.thumbnail_url} alt="" width={40} height={25} loading="lazy" className="hidden h-7 w-11 rounded-md object-cover md:block" />
              {s.title}
            </button>
          ))}
          <span aria-hidden className="mx-1 h-8 w-px shrink-0 bg-border" />
          <button onClick={() => setPanel("plan")} className="flex h-12 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-primary hover:bg-primary/10 md:text-sm"><MapIcon className="h-4 w-4" />План</button>
          {canFs && !isMobile && (
            <button onClick={toggleFs} className="flex h-12 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-primary hover:bg-primary/10">
              {fs ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}{fs ? "Свернуть" : "На весь экран"}
            </button>
          )}
          <button onClick={() => setPanel("lead")} className="hidden h-12 shrink-0 items-center gap-1.5 rounded-md bg-brand px-4 lg:flex text-xs font-semibold text-brand-foreground md:text-sm">Подобрать</button>
        </nav>
      </div>

      <Sheet open={panel !== null} onOpenChange={o => !o && setPanel(null)}>
        <SheetContent side={side} container={fs ? shell.current : undefined} className={side === "bottom" ? "max-h-[88svh] overflow-y-auto rounded-t-lg pb-[max(1.5rem,env(safe-area-inset-bottom))]" : "w-full overflow-y-auto sm:max-w-md"}>
          {panel === "plan" && <>
            <SheetHeader><SheetTitle>План квартиры</SheetTitle><SheetDescription>Схема демонстрационной квартиры, без размеров. Нажмите на комнату, чтобы перейти.</SheetDescription></SheetHeader>
            <TourPlan active={sceneId} onPick={id => { setIntro(false); go(id); setPanel(null); }} />
          </>}
          {panel === "object" && <>
            <SheetHeader><SheetTitle>{tour.title}</SheetTitle><SheetDescription>Пример интерактивного просмотра</SheetDescription></SheetHeader>
            <p className="mt-4 text-sm text-muted-foreground">Это не реальный объект: у него нет цены, адреса и характеристик. Так будет выглядеть тур по квартирам из каталога, когда для них загрузят съёмку.</p>
            <div className="mt-5 grid gap-2">
              <button onClick={() => setPanel("lead")} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand font-semibold text-brand-foreground"> Подобрать похожую квартиру</button>
              <Link to="/kupit-kvartiru" className="inline-flex h-12 items-center justify-center gap-2 rounded-md border font-semibold text-primary"><LayoutGrid className="h-4 w-4" /> Перейти в каталог</Link>
            </div>
          </>}
          {panel && typeof panel === "object" && "info" in panel && <>
            <SheetHeader><SheetTitle>{panel.info.label}</SheetTitle><SheetDescription>{scene.title} · демонстрационный тур</SheetDescription></SheetHeader>
            <p className="mt-4 text-sm text-primary">{panel.info.content}</p>
          </>}
          {panel === "lead" && <>
            <SheetHeader className="sr-only"><SheetTitle>Подбор квартиры</SheetTitle><SheetDescription>Форма заявки</SheetDescription></SheetHeader>
            <div className="-mx-2 mt-2"><LeadForm title="Подберём похожую квартиру" cta="Отправить заявку" type="selection" details={{ tour_id: tour.id, tour_room: scene.title }} /></div>
          </>}
        </SheetContent>
      </Sheet>
    </section>
  );
}
