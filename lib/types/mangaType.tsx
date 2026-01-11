export type MangaType = {
  id: string;
  title: string;
  coverUrl: string | null;
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
  // pages: number;
};

export type ChapterImagesType = {
	baseUrl: string;
	hash: string;
	data: string[];
	dataSaver: string[];
  };
