import { cn } from "~~/lib/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-lg bg-[rgba(148,210,189,0.12)]", className)} {...props} />;
}

export { Skeleton };
