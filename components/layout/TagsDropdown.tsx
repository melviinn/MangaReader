"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type TagFilterMode = "include" | "exclude";

type TagOption = {
  id: string;
  name: string;
};

type MangaTagsResponseType = {
  tags: TagOption[];
};

type TagsDropdownChange = {
  tagIds: string[];
  tagFilterMode: TagFilterMode;
};

type TagsDropdownProps = {
  language: string;
  selectedTagIds: string[];
  tagFilterMode: TagFilterMode;
  triggerClassName?: string;
  onChange: (nextValue: TagsDropdownChange) => void;
};

async function fetchMangaTags(
  language: string,
): Promise<MangaTagsResponseType> {
  const params = new URLSearchParams({ language });
  const res = await fetch(`/api/manga/tags?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Impossible de charger les tags.");
  }

  return res.json();
}

const TagsDropdown = ({
  language,
  selectedTagIds,
  tagFilterMode,
  triggerClassName,
  onChange,
}: TagsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerClasses = [
    "w-full justify-between self-start gap-8",
    triggerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const { data: tagsData, isLoading: isLoadingTags } = useQuery<
    MangaTagsResponseType,
    Error
  >({
    queryKey: ["manga-tags", language],
    queryFn: () => fetchMangaTags(language),
    staleTime: 1000 * 60 * 60,
  });

  const handleTagFilterModeChange = (mode: string | null) => {
    const nextMode: TagFilterMode = mode === "exclude" ? "exclude" : "include";
    onChange({ tagIds: selectedTagIds, tagFilterMode: nextMode });
  };

  const handleToggleTag = (tagId: string) => {
    const nextTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    onChange({ tagIds: nextTags, tagFilterMode });
  };

  const handleClearTagFilters = () => {
    onChange({ tagIds: [], tagFilterMode: "include" });
  };

  return (
    <div className="inline-flex w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className={triggerClasses}
              disabled={isLoadingTags}
            >
              {selectedTagIds.length > 0
                ? `Tags (${selectedTagIds.length})`
                : "No tag filter"}
              <HugeiconsIcon icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon} />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-[min(92vw,44rem)]">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2">Mode</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={tagFilterMode}
              onValueChange={handleTagFilterModeChange}
            >
              <DropdownMenuRadioItem
                value="include"
                className="mx-1 rounded-md"
              >
                Include selected tags
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="exclude"
                className="mx-1 rounded-md"
              >
                Exclude selected tags
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2">
              Tags ({selectedTagIds.length} selected)
            </DropdownMenuLabel>

            <div className="grid max-h-80 grid-cols-2 gap-1 overflow-y-auto p-1 md:grid-cols-3">
              {(tagsData?.tags ?? []).map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTagIds.includes(tag.id)}
                  onCheckedChange={() => handleToggleTag(tag.id)}
                  className="rounded-md pr-6"
                >
                  <span className="truncate" title={tag.name}>
                    {tag.name}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClearTagFilters}>
            Clear tag filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { TagsDropdown };
export type { TagFilterMode, TagsDropdownChange };
