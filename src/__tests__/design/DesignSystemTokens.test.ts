import { describe, it, expect } from 'vitest';
import { cardVariants } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { badgeVariants } from '@/components/ui/badge';

describe('🏛️ Day 1: Semantic Design Tokens & Component Variants Test Suite', () => {
  describe('Card Variants Contract', () => {
    it('should generate default card classes', () => {
      const classes = cardVariants({ variant: 'default' });
      expect(classes).toContain('rounded-xl');
      expect(classes).toContain('bg-card');
      expect(classes).toContain('shadow-sm');
    });

    it('should generate glassmorphic card classes with backdrop blur', () => {
      const classes = cardVariants({ variant: 'glass' });
      expect(classes).toContain('bg-surface-glass');
      expect(classes).toContain('border-surface-glass-border');
      expect(classes).toContain('backdrop-blur-md');
    });

    it('should generate interactive card classes with hover translation and cursor', () => {
      const classes = cardVariants({ variant: 'interactive' });
      expect(classes).toContain('hover:-translate-y-0.5');
      expect(classes).toContain('cursor-pointer');
      expect(classes).toContain('active:translate-y-0');
    });

    it('should generate luxury card classes with golden accent border', () => {
      const classes = cardVariants({ variant: 'luxury' });
      expect(classes).toContain('border-[#988561]/30');
      expect(classes).toContain('hover:border-[#988561]/60');
    });

    it('should generate elevated card classes with deeper shadow', () => {
      const classes = cardVariants({ variant: 'elevated' });
      expect(classes).toContain('shadow-md');
      expect(classes).toContain('hover:shadow-lg');
    });
  });

  describe('Button Variants & Tactile Press Physics', () => {
    it('should enforce active press scale dampening in base classes', () => {
      const classes = buttonVariants({ variant: 'default' });
      expect(classes).toContain('active:scale-[0.98]');
      expect(classes).toContain('rounded-xl');
    });

    it('should support luxury variant styling', () => {
      const classes = buttonVariants({ variant: 'luxury' });
      expect(classes).toContain('bg-[#988561]');
      expect(classes).toContain('hover:bg-[#867546]');
    });

    it('should support glass variant styling', () => {
      const classes = buttonVariants({ variant: 'glass' });
      expect(classes).toContain('bg-surface-glass');
      expect(classes).toContain('backdrop-blur-md');
    });

    it('should generate proper size dimensions', () => {
      const xsClasses = buttonVariants({ size: 'xs' });
      expect(xsClasses).toContain('h-8');
      expect(xsClasses).toContain('text-xs');

      const xlClasses = buttonVariants({ size: 'xl' });
      expect(xlClasses).toContain('h-12');
      expect(xlClasses).toContain('text-base');
    });
  });

  describe('Badge Variants Contract', () => {
    it('should generate glass variant with surface token', () => {
      const classes = badgeVariants({ variant: 'glass' });
      expect(classes).toContain('bg-surface-glass');
      expect(classes).toContain('border-surface-glass-border');
    });

    it('should generate luxury variant with gold styling', () => {
      const classes = badgeVariants({ variant: 'luxury' });
      expect(classes).toContain('bg-[#988561]/15');
      expect(classes).toContain('border-[#988561]/40');
    });

    it('should generate emerald and teal accent variants', () => {
      const emeraldClasses = badgeVariants({ variant: 'emerald' });
      expect(emeraldClasses).toContain('bg-emerald-500/15');

      const tealClasses = badgeVariants({ variant: 'teal' });
      expect(tealClasses).toContain('bg-[#428177]/15');
    });
  });
});
