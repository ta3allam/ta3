import React, { useState, useRef, TouchEvent } from "react";
import { RefreshCw, ArrowDown } from "lucide-react";

interface PullToRefreshContainerProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  pullThreshold?: number;
  disabled?: boolean;
}

export function PullToRefreshContainer({
  onRefresh,
  children,
  pullThreshold = 65,
  disabled = false,
}: PullToRefreshContainerProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing) return;
    // Only allow pull to refresh when scrolled at the very top
    if (window.scrollY === 0 || (containerRef.current && containerRef.current.scrollTop === 0)) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing || touchStartY.current === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    if (distance > 0) {
      // Apply elastic resistance formula
      const damping = 0.45;
      const resistedDistance = Math.min(distance * damping, 100);
      setPullDistance(resistedDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || touchStartY.current === 0) return;

    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true);
      setPullDistance(pullThreshold);
      try {
        await Promise.resolve(onRefresh());
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    touchStartY.current = 0;
  };

  const isTriggerReady = pullDistance >= pullThreshold;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full"
    >
      {/* Pull Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center w-full overflow-hidden transition-all duration-150"
          style={{ height: `${pullDistance}px` }}
          aria-live="polite"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDEBE0] border border-[#428177]/30 shadow-xs text-xs font-bold text-[#002623]">
            {isRefreshing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[#428177] animate-spin" />
                <span>جاري تحديث المحتوى...</span>
              </>
            ) : isTriggerReady ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[#428177]" />
                <span>اترك للتحديث الآن</span>
              </>
            ) : (
              <>
                <ArrowDown
                  className="w-3.5 h-3.5 text-[#428177] transition-transform duration-150"
                  style={{ transform: `rotate(${Math.min((pullDistance / pullThreshold) * 180, 180)}deg)` }}
                />
                <span>اسحب للأسفل للتحديث</span>
              </>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
