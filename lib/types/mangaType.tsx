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
