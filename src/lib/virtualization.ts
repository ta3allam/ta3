/**
 * Ta3 (تعلّم) - High-Concurrency List Virtualization Helper
 * Computes visible item slice bounds for large discussion feeds, course lists, and student tables.
 */

export interface VirtualizationOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export interface VirtualWindow {
  startIndex: number;
  endIndex: number;
  topPadding: number;
  bottomPadding: number;
  totalHeight: number;
}

export function computeVirtualWindow(options: VirtualizationOptions): VirtualWindow {
  const { totalItems, itemHeight, containerHeight, scrollTop, overscan = 3 } = options;

  const totalHeight = totalItems * itemHeight;

  if (totalItems === 0) {
    return { startIndex: 0, endIndex: 0, topPadding: 0, bottomPadding: 0, totalHeight: 0 };
  }

  // Calculate visible range
  const rawStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const rawEndIndex = rawStartIndex + visibleCount;

  // Apply overscan buffer
  const startIndex = Math.max(0, rawStartIndex - overscan);
  const endIndex = Math.min(totalItems, rawEndIndex + overscan);

  // Compute padding offsets
  const topPadding = startIndex * itemHeight;
  const bottomPadding = Math.max(0, (totalItems - endIndex) * itemHeight);

  return {
    startIndex,
    endIndex,
    topPadding,
    bottomPadding,
    totalHeight
  };
}
