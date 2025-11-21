import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Layout({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-full bg-primary p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
