import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { InputHTMLAttributes } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const SearchInput = ({ placeholder, ...props }: SearchInputProps) => {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Search mangas..." {...props} />
      <InputGroupAddon>
        <HugeiconsIcon icon={Search01Icon} />
      </InputGroupAddon>
    </InputGroup>
  );
};
