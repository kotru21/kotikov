"use client";

import { type UseBandCarouselReturn, useBandCarousel } from "@/shared/ui/BandCarousel";

interface UseTimelineCarouselOptions {
  itemCount: number;
}

export function useTimelineCarousel({
  itemCount,
}: UseTimelineCarouselOptions): UseBandCarouselReturn {
  return useBandCarousel({ count: itemCount });
}
