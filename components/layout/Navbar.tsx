import { CalendarAdd01Icon, StarSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const navLinks = [
    {
      name: "Popular",
      icon: <HugeiconsIcon icon={StarSquareIcon} size="20" />,
      href: "/",
    },
    {
      name: "Latest",
      icon: <HugeiconsIcon icon={CalendarAdd01Icon} size="20" />,
      href: "/",
    },
  ];

  return (
    <div className="w-full bg-primary">
      <div className="h-14 px-3 sm:px-6 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex h-full items-center">
          <Image
            src="/MangaReaderLogo.png"
            alt="MangaReader Logo"
            width={128}
            height={48}
            className="h-11 sm:h-12 w-auto object-contain"
          />
        </Link>
        <nav className="flex h-full items-center text-sm sm:text-base gap-4 sm:gap-8 font-medium text-primary-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative inline-flex h-full items-center gap-1 after:absolute after:left-0 after:bottom-3 after:h-0.5 after:w-0 after:rounded-full after:bg-primary-foreground after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export { Navbar };
