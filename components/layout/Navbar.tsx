"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-[#FCC262]">
      <div className="px-4 h-14 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="hover:bg-transparent!"
        >
          <Image
            src="/MangaReaderLogo.png"
            alt="MangaReader Logo"
            width={120}
            height={40}
            priority
          />
        </Button>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold hover:underline underline-offset-4 text-primary-foreground"
          >
            Home
          </Link>
          <Button
            variant="link"
            className="text-sm p-0 font-semibold text-primary-foreground"
          >
            Popular
          </Button>
          <Button
            variant="link"
            className="text-sm p-0 font-semibold text-primary-foreground"
          >
            Latest
          </Button>
        </nav>
      </div>
    </div>
  );
};

export { Navbar };
