export type MangaType = {
  id: string;
  title: string;
  coverUrl: string | null;
  description?: string | null;
  status?: string | null;
  year?: number | null;
  contentRating?: string | null;
  publicationDemographic?: string | null;
};

export type MangaResponseType = {
  total: number | undefined;
  limit: number | undefined;
  offset: number | undefined;
  mangas: MangaType[] | undefined;
};

export type MangaChapterType = {
  id: string;
  title: string | null;
  chapter: string | null;
  volume: string | null;
  pages?: number | null;
  publishedAt?: string | null;
  scanlationGroups?: { id: string; name: string }[];
};

export type ChapterImagesType = {
  baseUrl: string;
  hash: string;
  data: string[];
  dataSaver: string[];
};

export type MangaDetailsType = {
  id: string;
  description: string | null;
  status: string | null;
  title: string;
  year: number | null;
  contentRating: string | null;
  ratingAverage?: number | null;
  ratingBayesian?: number | null;
  follows?: number | null;
  tags: { id: string; name: string }[];
  authors: { id: string; name: string; role: string }[];
  coverArt: {
    id: string;
    attributes: {
      fileName: string;
    };
  } | null;
};
