import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 min-h-12 px-5",
  {
    variants: {
      variant: {
        default: "bg-[var(--action)] text-[var(--on-dark)] hover:brightness-110",
        secondary: "border border-[var(--rule)] bg-transparent hover:bg-[rgba(10,147,150,0.14)]",
        outline: "border border-[var(--rule)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]",
        ghost: "hover:bg-[var(--muted)]",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
