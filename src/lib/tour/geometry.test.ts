import { describe, expect, it } from "vitest";
import { clampPoint, coverPoint, resolveScene } from "./geometry";
import { demoTour } from "./demoTour";
import { getTour } from "./adapter";

describe("tour geometry", () => {
  it("places a centre point at the box centre under cover crop", () => {
    expect(coverPoint(50, 50, 1600, 1000, 390, 600)).toMatchObject({ x: 195, y: 300, visible: true });
  });
  it("hides points cropped away on a narrow phone", () => {
    expect(coverPoint(2, 50, 1600, 1000, 390, 600).visible).toBe(false);
  });
  it("keeps points out of the bottom controls zone", () => {
    expect(clampPoint(100, 590, 390, 600).y).toBe(450);
  });
  it("falls back to the initial room for unknown ?room", () => {
    expect(resolveScene(["living", "kitchen"], "garage", "living")).toBe("living");
    expect(resolveScene(["living", "kitchen"], "kitchen", "living")).toBe("kitchen");
  });
});
describe("demo tour", () => {
  it("every room transition targets an existing scene", () => {
    const ids = new Set(demoTour.scenes.map(s => s.id));
    for (const h of demoTour.hotspots) if (h.type === "scene") expect(ids.has(h.target_scene_id!)).toBe(true);
  });
  it("is never attached to a real property", () => {
    expect(getTour({ propertyId: "abc" })).toBeNull();
  });
});
