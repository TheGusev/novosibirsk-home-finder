import hero from "@/assets/hero.jpg";
import interior from "@/assets/interior.jpg";
import building from "@/assets/building.jpg";

export type Listing = {
  id: string;
  title: string;
  district: string;
  area: number;
  floor: string;
  price: string;
  image: string;
  type: "Вторичка" | "Новостройка";
};

// Демо-объекты: заменить реальными после подключения базы.
export const LISTINGS: Listing[] = [
  { id: "1", title: "2-комнатная квартира", district: "Центральный район", area: 58, floor: "12/17", price: "[заполнить] ₽", image: hero, type: "Вторичка" },
  { id: "2", title: "1-комнатная квартира", district: "Октябрьский район", area: 39, floor: "5/10", price: "[заполнить] ₽", image: interior, type: "Вторичка" },
  { id: "3", title: "3-комнатная квартира", district: "Советский район", area: 76, floor: "4/9", price: "[заполнить] ₽", image: building, type: "Новостройка" },
  { id: "4", title: "Студия", district: "Ленинский район", area: 26, floor: "8/24", price: "[заполнить] ₽", image: interior, type: "Новостройка" },
  { id: "5", title: "2-комнатная квартира", district: "Заельцовский район", area: 54, floor: "3/5", price: "[заполнить] ₽", image: hero, type: "Вторичка" },
  { id: "6", title: "4-комнатная квартира", district: "Калининский район", area: 98, floor: "14/19", price: "[заполнить] ₽", image: building, type: "Новостройка" },
];
