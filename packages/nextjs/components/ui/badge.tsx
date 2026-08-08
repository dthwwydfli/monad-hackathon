import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
  {
    variants: {
      // Anything on a saturated or light fill takes --on-dark; only the two
      // transparent variants can safely use --ink, which is now light.
      variant: {
        open: "border-[var(--action)] bg-[rgba(10,147,150,0.18)] text-[var(--action-tint)]",
        claimed: "border-transparent bg-[var(--ink)] text-[var(--on-dark)]",
        submitted: "border-transparent bg-[var(--review)] text-[var(--on-dark)]",
        released: "border-transparent bg-[var(--confirmed)] text-[var(--on-dark)]",
        neutral: "border-[var(--rule)] bg-transparent text-[var(--ink)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
