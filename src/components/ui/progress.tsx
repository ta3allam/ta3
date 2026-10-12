import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "gamified" | "luxury"
  showShimmer?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "default", showShimmer = true, ...props }, ref) => {
  const indicatorVariantClass =
    variant === "gamified"
      ? "bg-gradient-to-r from-[#054239] via-[#428177] to-[#988561]"
      : variant === "luxury"
      ? "bg-gradient-to-r from-[#988561] to-[#B9A779]"
      : "bg-primary"

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3.5 w-full overflow-hidden rounded-full bg-secondary/80 shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out relative overflow-hidden",
          indicatorVariantClass
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        {showShimmer && (value || 0) > 0 && (
          <span
            aria-hidden="true"
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent bg-[length:200%_100%] animate-shimmer"
          />
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
