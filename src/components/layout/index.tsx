import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";

export default function Layout({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 justify-center items-center min-h-full bg-primary p-4",
        className
      )}
    >
      {children}
      <div className="flex text-primary-foreground text-sm gap-4">
        <Link
          to="https://germanwatch.org/impressum"
          target="_blank"
          rel="noopener noreferrer"
        >
          Impressum
        </Link>
        |
        <Link
          to="https://germanwatch.org/datenschutz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datenschutz
        </Link>
      </div>
    </div>
  );
}
