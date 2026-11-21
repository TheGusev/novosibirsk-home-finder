import { CONTACT_NAME, PHONE, PHONE_HREF, WHATSAPP_HREF, TELEGRAM_HREF } from '@/lib/contact';

const brandName = "Ваш Адрес 54";
const brandDescriptor = "Агентство недвижимости";

/** Единая конфигурация бренда. Неподтверждённые данные — null и нигде не публикуются. */
export const SITE = {
  brandName,
  brandDescriptor,
  serviceArea: "Новосибирск и Новосибирская область",
  /** Публичный домен бренда не утверждён; canonical/sitemap пока используют SITE_ORIGIN из seo.ts. */
  siteUrl: null as string | null,
  /** Юридическое наименование заполняется только подтверждёнными данными. */
  legalName: null as string | null,
  contacts: { name: CONTACT_NAME, phone: PHONE, phoneHref: PHONE_HREF, whatsapp: WHATSAPP_HREF, telegram: TELEGRAM_HREF, email: null as string | null },
  // Aliases kept for existing consumers.
  name: brandName,
  tagline: brandDescriptor,
  domain: null as string | null,
  email: null as string | null,
  city: "Новосибирск",
} as const;
