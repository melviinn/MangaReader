"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-accent px-2 py-1.5">
      <Button
        variant="ghost"
        className="text-medium tracking-tight text-lg"
        onClick={() => router.push("/")}
      >
        MangaReader
      </Button>
    </div>
  );
};

export { Navbar };
