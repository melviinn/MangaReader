import { SORT_OPTIONS, type SortValue } from "@/lib/types/mangaSort";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type FiltersDropdownProps = {
  value: SortValue;
  onValueChange: (value: SortValue) => void;
  triggerClassName?: string;
};

const FiltersDropdown = ({
  value,
  onValueChange,
  triggerClassName,
}: FiltersDropdownProps) => {
  const triggerClasses = ["w-full justify-between gap-8", triggerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Select
      items={SORT_OPTIONS}
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as SortValue)}
    >
      <SelectTrigger className={triggerClasses}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {SORT_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { FiltersDropdown };
