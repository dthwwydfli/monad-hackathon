import { cn } from "~~/lib/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-lg bg-[rgba(23,32,51,0.08)]", className)} {...props} />;
}

export { Skeleton };
