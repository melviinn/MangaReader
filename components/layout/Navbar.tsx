"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-[#FCC262] flex items-center px-2 py-3">
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="hover:bg-transparent!"
      >
        <Image
          src="/MangaReaderLogo.png"
          alt="MangaReader Logo"
          width={150}
          height={150}
        />
      </Button>
    </div>
  );
};

export { Navbar };
