import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const navLinks = [
    { name: "Popular", href: "/" },
    { name: "Latest", href: "/" },
  ];

  return (
    <div className="w-full bg-[#FCC262]">
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
        <nav className="flex items-center gap-6 font-medium text-primary-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:underline underline-offset-4"
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
