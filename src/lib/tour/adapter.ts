import { demoTour } from "./demoTour";
import type { TourBundle } from "./types";
/**
 * Single entry point for tours. Today only the local demo exists; when tour tables
 * appear in the database, load by id/property here — components stay unchanged.
 * Real properties never receive the demo tour.
 */
export function getTour(opts: { propertyId?: string } = {}): TourBundle | null {
  if (opts.propertyId) return null;
  return demoTour;
}
