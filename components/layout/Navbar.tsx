import { CalendarAdd01Icon, StarSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const navLinks = [
    {
      name: "Popular",
      icon: <HugeiconsIcon icon={StarSquareIcon} size="22" />,
      href: "/",
    },
    {
      name: "Latest",
      icon: <HugeiconsIcon icon={CalendarAdd01Icon} size="22" />,
      href: "/",
    },
  ];

  return (
    <div className="w-full bg-primary">
      <div className="pr-8 h-14 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/MangaReaderLogo.png"
            alt="MangaReader Logo"
            width={100}
            height={40}
            className="w-full object-cover"
          />
        </Link>
        <nav className="flex items-center text-base gap-8 font-medium text-primary-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:underline underline-offset-4 flex items-center gap-1"
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
