import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackComponent?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Isolated Component-Level Error Boundary (Arabic-First RTL)
 *
 * Prevents cascading crashes across the LMS viewport when a single card,
 * video player, or chart encounters a runtime anomaly. Provides isolated
 * retry capabilities without requiring a full page refresh.
 */
export class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ComponentErrorBoundary] Error caught in <${this.props.componentName || 'Component'}>:`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  override componentDidUpdate(prevProps: ComponentErrorBoundaryProps): void {
    if (this.state.hasError && this.props.resetKeys) {
      const hasChanged = this.props.resetKeys.some(
        (key, idx) => key !== (prevProps.resetKeys ? prevProps.resetKeys[idx] : undefined)
      );
      if (hasChanged) {
        this.resetError();
      }
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent(this.state.error, this.resetError);
      }

      const isDev = import.meta.env.DEV;
      const title = this.props.fallbackTitle || 'تعذر تحميل هذا المحتوى';
      const description =
        this.props.fallbackDescription ||
        'حدث خطأ تقني غير متوقع في هذا الجزء من الصفحة. بإمكانك إعادة المحاولة دون فقدان جلستك الحالية.';

      return (
        <Card
          dir="rtl"
          variant="glass"
          className="border-destructive/30 bg-destructive/5 text-card-foreground my-3 p-2 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {isDev && this.state.error.message && (
            <CardContent className="pt-0 pb-3">
              <div className="rounded-md bg-muted/60 p-2 text-xs font-mono text-destructive-foreground/90 overflow-x-auto text-left dir-ltr">
                {this.state.error.message}
              </div>
            </CardContent>
          )}

          <CardFooter className="pt-1 flex items-center justify-between gap-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={this.resetError}
              className="gap-2 text-xs active:scale-[0.98] transition-transform"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة المحاولة
            </Button>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <HelpCircle className="h-3 w-3" />
              <span>{this.props.componentName || 'عنصر واجهة'}</span>
            </div>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component to wrap any component in a ComponentErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  ComponentToWrap: React.ComponentType<P>,
  boundaryProps?: Omit<ComponentErrorBoundaryProps, 'children'>
): React.FC<P> {
  const Wrapped: React.FC<P> = (props: P) => (
    <ComponentErrorBoundary {...boundaryProps} componentName={boundaryProps?.componentName || ComponentToWrap.displayName || ComponentToWrap.name}>
      <ComponentToWrap {...props} />
    </ComponentErrorBoundary>
  );
  Wrapped.displayName = `WithErrorBoundary(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
  return Wrapped;
}
