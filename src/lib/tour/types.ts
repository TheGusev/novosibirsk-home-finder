export type TourMode = "photo" | "panorama";
export interface Tour {
  id: string;
  property_id: string | null;
  title: string;
  is_demo: boolean;
  mode: TourMode;
  initial_scene_id: string;
  poster_url: string;
  published: boolean;
}
export interface TourScene {
  id: string;
  tour_id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  /** Natural image size — needed to place photo hotspots under object-fit: cover. */
  width: number;
  height: number;
  alt: string;
  panorama_projection: "equirectangular" | null;
  initial_yaw: number;
  initial_pitch: number;
  initial_fov: number;
  order: number;
  /** Rooms shown in the bottom switcher; others (e.g. window view) open only via hotspots. */
  in_switcher: boolean;
}
export interface TourHotspot {
  id: string;
  scene_id: string;
  type: "scene" | "info";
  target_scene_id: string | null;
  label: string;
  yaw: number | null;
  pitch: number | null;
  x_percent: number | null;
  y_percent: number | null;
  content: string | null;
}
export interface TourBundle { tour: Tour; scenes: TourScene[]; hotspots: TourHotspot[] }
