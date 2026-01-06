type Manga = {
  id: string;
  title: string;
  description: string;
  status: string;
  year: number | null;
  coverUrl: string | null;
};

async function getMangas() {
  const res = await fetch("http://localhost:3000/api/manga", {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch manga data");
  }

  return res.json();
}

export default async function HomePage() {
  const data = await getMangas();

  return (
    <main className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {data.mangas.map((manga: Manga) => (
        <a
          href={`/manga/${manga.id}`}
          key={manga.id}
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {manga.coverUrl ? (
            <img
              src={manga.coverUrl}
              alt={manga.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500">No Cover</span>
            </div>
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{manga.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {manga.description.length > 100
                ? manga.description.slice(0, 100) + "..."
                : manga.description}
            </p>
          </div>
        </a>
      ))}
    </main>
  );
}
