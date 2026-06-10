import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { InputHTMLAttributes } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

import * as React from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  variant?: "default" | "navbar";
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder, variant, ...props }, ref) => {
    return (
      <InputGroup variant={variant}>
        <InputGroupInput
          ref={ref}
          placeholder={placeholder}
          className="placeholder:text-sm"
          {...props}
        />
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} />
        </InputGroupAddon>
      </InputGroup>
    );
  },
);
SearchInput.displayName = "SearchInput";
