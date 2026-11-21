import { ArrowRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import tourPoster from "@/assets/tour/living.webp";
import { Section, SectionTitle } from "./ui";

/** Отдельный видимый блок рум-тура на главной: крупное фото, кнопка «Смотреть», ссылка на /tur. */
export function TourSection() {
  return (
    <Section>
      <SectionTitle
        action={
          <Link to="/tur" className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand hover:underline">
            Открыть рум-тур <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        Рум-тур
      </SectionTitle>
      <Link
        to="/tur"
        aria-label="Открыть рум-тур по демонстрационной квартире: 5 комнат и план"
        className="group relative block overflow-hidden rounded-lg border bg-card"
      >
        <img
          src={tourPoster}
          alt="Гостиная демонстрационной квартиры в рум-туре"
          width={1600}
          height={1008}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02] md:aspect-[21/9]"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" aria-hidden />
        <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm transition group-hover:scale-105 md:h-16 md:w-16">
          <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />
        </span>
        <span className="absolute left-3 top-3 rounded bg-card/95 px-1.5 py-0.5 text-[11px] font-semibold text-primary">Демонстрационная квартира</span>
        <span className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground md:p-6">
          <span className="block text-lg font-bold md:text-xl">Посмотреть квартиру изнутри</span>
          <span className="mt-1 block text-sm opacity-90 md:text-base">Пример рум-тура: 5 комнат, переходы по стрелкам и план квартиры</span>
        </span>
      </Link>
    </Section>
  );
}
