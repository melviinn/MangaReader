"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Navbar = () => {
  const navLinks = [
    { name: "Popular", href: "/" },
    { name: "Latest", href: "/" },
  ];

  const router = useRouter();
  return (
    <div className="w-full bg-[#FCC262]">
      <div className="pr-4 h-14 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="hover:bg-transparent! p-0!"
        >
          <Image
            src="/MangaReaderLogo.png"
            alt="MangaReader Logo"
            width={100}
            height={40}
            className="w-full object-cover"
            priority
          />
        </Button>
        <nav className="flex items-center gap-6 text-base font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:underline underline-offset-4 text-primary-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export { Navbar };
