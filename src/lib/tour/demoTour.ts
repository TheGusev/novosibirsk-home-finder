import type { TourBundle, TourHotspot, TourScene } from "./types";
import living from "@/assets/tour/living.webp";
import livingT from "@/assets/tour/living-thumb.webp";
import kitchen from "@/assets/tour/kitchen.webp";
import kitchenT from "@/assets/tour/kitchen-thumb.webp";
import bedroom from "@/assets/tour/bedroom.webp";
import bedroomT from "@/assets/tour/bedroom-thumb.webp";
import hallway from "@/assets/tour/hallway.webp";
import hallwayT from "@/assets/tour/hallway-thumb.webp";
import windowV from "@/assets/tour/window.webp";
import windowT from "@/assets/tour/window-thumb.webp";

const T = "demo";
const base = { tour_id: T, width: 1600, height: 1008, panorama_projection: null, initial_yaw: 0, initial_pitch: 0, initial_fov: 90 } as const;
const scenes: TourScene[] = [
  { ...base, id: "living", title: "Гостиная", image_url: living, thumbnail_url: livingT, alt: "Демонстрационная гостиная: светлый диван, дубовый пол, окно", order: 1, in_switcher: true },
  { ...base, id: "kitchen", title: "Кухня", image_url: kitchen, thumbnail_url: kitchenT, alt: "Демонстрационная кухня с дубовыми фасадами и островом", order: 2, in_switcher: true },
  { ...base, id: "bedroom", title: "Спальня", image_url: bedroom, thumbnail_url: bedroomT, alt: "Демонстрационная спальня с льняным бельём и окном", order: 3, in_switcher: true },
  { ...base, id: "hallway", title: "Прихожая", image_url: hallway, thumbnail_url: hallwayT, alt: "Демонстрационная прихожая со шкафом и круглым зеркалом", order: 4, in_switcher: true },
  { ...base, id: "window", title: "Вид из окна", image_url: windowV, thumbnail_url: windowT, alt: "Демонстрационный вид из окна на зелёный район и реку", order: 5, in_switcher: false },
];
const FINISH = "В демонстрационной квартире: светлый дубовый пол, кремовые стены, деревянные фасады. Отделка реальных квартир указана в карточке объекта.";
const LAYOUT = "Схема демонстрационной квартиры: гостиная, кухня, спальня и прихожая. Размеры не указаны — это пример интерфейса.";
let n = 0;
const h = (scene_id: string, label: string, x: number, y: number, target: string | null, content: string | null = null): TourHotspot =>
  ({ id: `h${++n}`, scene_id, type: target ? "scene" : "info", target_scene_id: target, label, yaw: null, pitch: null, x_percent: x, y_percent: y, content });
const hotspots: TourHotspot[] = [
  h("living", "В кухню", 13, 45, "kitchen"),
  h("living", "В прихожую", 46, 52, "hallway"),
  h("living", "Вид из окна", 90, 30, "window"),
  h("living", "Об отделке", 58, 70, null, FINISH),
  h("kitchen", "В гостиную", 89, 48, "living"),
  h("kitchen", "Вид из окна", 51, 28, "window"),
  h("kitchen", "Об отделке", 40, 72, null, FINISH),
  h("bedroom", "В прихожую", 86, 44, "hallway"),
  h("bedroom", "Вид из окна", 14, 32, "window"),
  h("hallway", "В гостиную", 12, 42, "living"),
  h("hallway", "В спальню", 86, 46, "bedroom"),
  h("hallway", "Планировка", 50, 70, null, LAYOUT),
  h("window", "В гостиную", 50, 88, "living"),
];
export const demoTour: TourBundle = {
  tour: { id: T, property_id: null, title: "Демонстрационная квартира", is_demo: true, mode: "photo", initial_scene_id: "living", poster_url: living, published: true },
  scenes, hotspots,
};
