import { describe, it, expect } from 'vitest';
import {
  SPRING_PRESETS,
  calculatePullResistance,
  evaluateSwipeGesture,
  parsePlayerShortcut,
  generateAudioWaveformBars,
} from '@/lib/motion';

describe('⚡ Day 2: Tactile Interactions, Motion Physics & Low-Bandwidth Player Suite', () => {
  describe('Spring Physics Presets Contract', () => {
    it('should define all 5 spring physics presets with valid stiffness and damping', () => {
      expect(SPRING_PRESETS.snappy.stiffness).toBe(400);
      expect(SPRING_PRESETS.gentle.damping).toBe(24);
      expect(SPRING_PRESETS.bouncy.cssTransition).toContain('cubic-bezier');
      expect(SPRING_PRESETS.drawer.cssTransition).toContain('transform');
      expect(SPRING_PRESETS.elastic.stiffness).toBe(450);
    });
  });

  describe('Elastic Pull-to-Refresh Resistance Curve', () => {
    it('should return 0 for zero or negative pull distances', () => {
      expect(calculatePullResistance(0)).toBe(0);
      expect(calculatePullResistance(-45)).toBe(0);
    });

    it('should apply asymptotic damping and never exceed maxPull', () => {
      const smallPull = calculatePullResistance(50, 110, 0.5);
      const largePull = calculatePullResistance(300, 110, 0.5);
      const extremePull = calculatePullResistance(2000, 110, 0.5);

      expect(smallPull).toBeGreaterThan(0);
      expect(largePull).toBeGreaterThan(smallPull);
      expect(extremePull).toBeLessThanOrEqual(110);
    });
  });

  describe('Velocity-Driven Touch Swipe Gesture Thresholds', () => {
    it('should dismiss right-anchored RTL drawer when swiping right past distance threshold', () => {
      const gesture = evaluateSwipeGesture({
        startX: 100,
        startY: 200,
        endX: 190,
        endY: 205,
        durationMs: 220,
      });

      expect(gesture.direction).toBe('right');
      expect(gesture.shouldDismissRightDrawer).toBe(true);
      expect(gesture.shouldDismissBottomSheet).toBe(false);
    });

    it('should dismiss bottom sheet when swiping down with high velocity', () => {
      const gesture = evaluateSwipeGesture({
        startX: 150,
        startY: 100,
        endX: 152,
        endY: 140,
        durationMs: 80, // 40px / 80ms = 0.5 px/ms > 0.35 threshold
      });

      expect(gesture.direction).toBe('down');
      expect(gesture.velocityPxPerMs).toBeGreaterThanOrEqual(0.35);
      expect(gesture.shouldDismissBottomSheet).toBe(true);
    });

    it('should ignore accidental micro-touches below distance and velocity thresholds', () => {
      const gesture = evaluateSwipeGesture({
        startX: 100,
        startY: 100,
        endX: 112,
        endY: 104,
        durationMs: 400,
      });

      expect(gesture.direction).toBe('none');
      expect(gesture.shouldDismissRightDrawer).toBe(false);
      expect(gesture.shouldDismissBottomSheet).toBe(false);
    });
  });

  describe('Classroom Player Keyboard Shortcut Bindings', () => {
    it('should map playback, seek, mute, and 64kbps audio mode keys accurately', () => {
      expect(parsePlayerShortcut(' ')).toBe('toggle_play');
      expect(parsePlayerShortcut('k')).toBe('toggle_play');
      expect(parsePlayerShortcut('ArrowRight')).toBe('seek_forward');
      expect(parsePlayerShortcut('ArrowLeft')).toBe('seek_backward');
      expect(parsePlayerShortcut('m')).toBe('toggle_mute');
      expect(parsePlayerShortcut('A')).toBe('toggle_audio_mode');
      expect(parsePlayerShortcut('s')).toBe('speed_up');
    });

    it('should suppress shortcuts when user is typing inside an input or textarea', () => {
      expect(parsePlayerShortcut(' ', true)).toBe('none');
      expect(parsePlayerShortcut('m', true)).toBe('none');
      expect(parsePlayerShortcut('ArrowRight', true)).toBe('none');
    });
  });

  describe('64kbps Audio-Mode Reactive Waveform Visualizer', () => {
    it('should generate 28 normalized waveform bars within [15, 96] bounds', () => {
      const restingBars = generateAudioWaveformBars(28, false, 0);
      const activeBarsTick1 = generateAudioWaveformBars(28, true, 1);
      const activeBarsTick2 = generateAudioWaveformBars(28, true, 2);

      expect(restingBars).toHaveLength(28);
      expect(activeBarsTick1).toHaveLength(28);
      expect(restingBars.every((b) => b >= 15 && b <= 45)).toBe(true);
      expect(activeBarsTick1.every((b) => b >= 18 && b <= 96)).toBe(true);
      expect(activeBarsTick1).not.toEqual(activeBarsTick2);
    });
  });
});
