import { Input } from "@/components/ui/input";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const SearchInput = ({ placeholder, ...props }: SearchInputProps) => {
  return (
    <div className="relative flex items-center w-full">
      <HugeiconsIcon
        icon={Search01Icon}
        className="absolute left-3 text-muted-foreground pointer-events-none"
        size={16}
      />
      <Input placeholder={placeholder} className="pl-9 md:pl-10" {...props} />
    </div>
  );
};
