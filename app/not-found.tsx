"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 w-full items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.15em] text-primary/90">
          ERROR 404
        </p>
        <h1 className="text-balance text-5xl font-extrabold leading-none text-primary sm:text-7xl">
          Page Not Found
        </h1>
        <h2 className="mt-3 text-balance text-xl font-semibold text-foreground sm:text-2xl">
          The page you are looking for does not exist
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          The link may be incorrect, or the page may have been moved. You can
          return to the homepage to continue reading.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "px-5 text-sm")}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
