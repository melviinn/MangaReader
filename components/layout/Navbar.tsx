import Image from "next/image";
import Link from "next/link";
import { NavbarSearch } from "./NavbarSearch";

const Navbar = () => {
  return (
    <div className="w-full bg-primary">
      <div className="h-14 pr-7 md:pr-6 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/MangaReaderLogo.png"
            alt="MangaReader Logo"
            width={128}
            height={48}
            className="h-16 sm:h-14 w-auto object-contain"
          />
        </Link>
        {/* <div className="flex h-full items-center">
          <NavbarSearch />
        </div> */}
      </div>
    </div>
  );
};

export { Navbar };
