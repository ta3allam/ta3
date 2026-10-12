/**
 * ⚡ Ta3 (تعلّم) — Motion Physics & Tactile Gesture Engine
 * Zero-dependency spring physics curves, swipe velocity evaluators,
 * elastic pull-to-refresh resistance math, and media shortcut bindings.
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  cssTransition: string;
}

export const SPRING_PRESETS: Record<'snappy' | 'gentle' | 'bouncy' | 'drawer' | 'elastic', SpringConfig> = {
  snappy: {
    stiffness: 400,
    damping: 28,
    mass: 0.8,
    cssTransition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  gentle: {
    stiffness: 220,
    damping: 24,
    mass: 1,
    cssTransition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  bouncy: {
    stiffness: 350,
    damping: 16,
    mass: 0.9,
    cssTransition: 'all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  drawer: {
    stiffness: 320,
    damping: 30,
    mass: 1,
    cssTransition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  elastic: {
    stiffness: 450,
    damping: 14,
    mass: 0.7,
    cssTransition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

/**
 * Calculates logarithmic/hyperbolic elastic resistance for Pull-to-Refresh and overscroll gestures.
 */
export function calculatePullResistance(
  deltaY: number,
  maxPull: number = 120,
  dampingFactor: number = 0.48
): number {
  if (deltaY <= 0) return 0;
  const damped = deltaY * dampingFactor;
  // Asymptotic cap towards maxPull
  const normalized = maxPull * (1 - Math.exp(-damped / maxPull));
  return Math.min(maxPull, Math.round(normalized * 10) / 10);
}

export interface SwipeGestureInput {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  durationMs: number;
  minDistancePx?: number;
  minVelocityPxPerMs?: number;
}

export interface SwipeGestureResult {
  direction: 'left' | 'right' | 'up' | 'down' | 'none';
  distancePx: number;
  velocityPxPerMs: number;
  shouldDismissRightDrawer: boolean;
  shouldDismissBottomSheet: boolean;
}

/**
 * Evaluates touch swipe velocity and directional thresholds for mobile drawers and sheets.
 */
export function evaluateSwipeGesture({
  startX,
  startY,
  endX,
  endY,
  durationMs,
  minDistancePx = 50,
  minVelocityPxPerMs = 0.35,
}: SwipeGestureInput): SwipeGestureResult {
  const dx = endX - startX;
  const dy = endY - startY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const safeDuration = Math.max(1, durationMs);
  const distancePx = Math.round(Math.hypot(dx, dy));
  const velocityPxPerMs = Number((distancePx / safeDuration).toFixed(3));

  let direction: SwipeGestureResult['direction'] = 'none';

  if (absX > absY) {
    if (absX >= minDistancePx || velocityPxPerMs >= minVelocityPxPerMs) {
      direction = dx > 0 ? 'right' : 'left';
    }
  } else {
    if (absY >= minDistancePx || velocityPxPerMs >= minVelocityPxPerMs) {
      direction = dy > 0 ? 'down' : 'up';
    }
  }

  return {
    direction,
    distancePx,
    velocityPxPerMs,
    // In RTL, right-anchored drawers close when swiped right (dx > 0)
    shouldDismissRightDrawer: direction === 'right' && (absX >= minDistancePx || velocityPxPerMs >= minVelocityPxPerMs),
    shouldDismissBottomSheet: direction === 'down' && (absY >= minDistancePx || velocityPxPerMs >= minVelocityPxPerMs),
  };
}

export type PlayerCommand =
  | 'toggle_play'
  | 'seek_forward'
  | 'seek_backward'
  | 'toggle_mute'
  | 'toggle_audio_mode'
  | 'speed_up'
  | 'none';

/**
 * Maps keyboard events to accessible classroom lesson player commands.
 * Ignores shortcuts when the user is typing inside an input or textarea.
 */
export function parsePlayerShortcut(
  key: string,
  isInputFocused: boolean = false
): PlayerCommand {
  if (isInputFocused) return 'none';

  switch (key) {
    case ' ':
    case 'k':
    case 'K':
      return 'toggle_play';
    case 'ArrowRight':
    case 'l':
    case 'L':
      return 'seek_forward';
    case 'ArrowLeft':
    case 'j':
    case 'J':
      return 'seek_backward';
    case 'm':
    case 'M':
      return 'toggle_mute';
    case 'a':
    case 'A':
      return 'toggle_audio_mode';
    case 's':
    case 'S':
      return 'speed_up';
    default:
      return 'none';
  }
}

/**
 * Generates deterministic normalized bar heights (15% - 95%) for the 64kbps audio-only waveform visualizer.
 */
export function generateAudioWaveformBars(
  count: number = 28,
  isPlaying: boolean = false,
  tick: number = 0
): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    if (!isPlaying) {
      // Calm resting wave profile
      const base = 20 + Math.round(Math.sin(i * 0.45) * 10 + 10);
      bars.push(Math.max(15, Math.min(45, base)));
    } else {
      // Dynamic active voice synthesis wave profile
      const phase1 = Math.sin((i + tick) * 0.7) * 32;
      const phase2 = Math.cos((i * 1.3 - tick) * 0.5) * 20;
      const height = Math.round(52 + phase1 + phase2);
      bars.push(Math.max(18, Math.min(96, height)));
    }
  }
  return bars;
}
