import { describe, expect, it } from "vitest";

import { PUZZLE_BOARD_REST_TRACKS, type PuzzleBoardArea, puzzleBoardTracks } from "@/widgets/puzzle/lib/puzzleBoardTracks";

function trackPercents(template: string): number[] {
  return [...template.matchAll(/(\d+(?:\.\d+)?)%/g)].map((match) => Number(match[1]));
}

function expectTracksFit(template: string, center = 20): void {
  const percents = trackPercents(template);
  expect(percents).toHaveLength(3);
  expect(percents[1]).toBe(center);
  expect(percents.reduce((sum, part) => sum + part, 0)).toBe(100);
}

describe("puzzleBoardTracks", () => {
  it("keeps a 20% center track and 100% triples at rest and on outer-cell hover", () => {
    expectTracksFit(PUZZLE_BOARD_REST_TRACKS.columns);
    expectTracksFit(PUZZLE_BOARD_REST_TRACKS.rows);
    expect(puzzleBoardTracks(null)).toEqual(PUZZLE_BOARD_REST_TRACKS);

    const hovers: Record<Exclude<PuzzleBoardArea, "k">, { columns: number[]; rows: number[] }> = {
      about: { columns: [50, 20, 30], rows: [50, 20, 30] },
      contacts: { columns: [24, 20, 56], rows: [52, 20, 28] },
      projects: { columns: [55, 20, 25], rows: [40, 20, 40] },
      experience: { columns: [36, 20, 44], rows: [24, 20, 56] },
    };

    for (const area of Object.keys(hovers) as Array<Exclude<PuzzleBoardArea, "k">>) {
      const tracks = puzzleBoardTracks(area);
      expect(trackPercents(tracks.columns)).toEqual(hovers[area].columns);
      expect(trackPercents(tracks.rows)).toEqual(hovers[area].rows);
      expectTracksFit(tracks.columns);
      expectTracksFit(tracks.rows);
    }
  });

  it("grows the center tracks equally when hovering k so triples still sum to 100%", () => {
    const tracks = puzzleBoardTracks("k");
    const columns = trackPercents(tracks.columns);
    const rows = trackPercents(tracks.rows);

    expect(columns).toEqual([32, 36, 32]);
    expect(rows).toEqual([32, 36, 32]);
    expect(columns[1]).toBeGreaterThan(20);
    expect(rows[1]).toBeGreaterThan(20);
    expect(columns[0]).toBe(columns[2]);
    expect(rows[0]).toBe(rows[2]);
    expect(columns.reduce((sum, part) => sum + part, 0)).toBe(100);
    expect(rows.reduce((sum, part) => sum + part, 0)).toBe(100);
  });
});
