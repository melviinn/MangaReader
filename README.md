<div align="center">
  <h1>📚 Manga Reader</h1>
  <p>A modern, responsive manga reader built with Next.js 15</p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-key-features-explained">Features</a>

  </p>
</div>

---

## ✨ Features

- 🔍 **Search & Browse** - Search through thousands of manga titles with real-time filtering
- 🌍 **Multi-language Support** - Read manga in English, French, Spanish, Japanese, and German
- 📖 **Chapter Navigation** - Seamless navigation between chapters with previous/next buttons
- 💾 **Persistent Preferences** - Language preferences saved locally for each manga
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- ⚡ **Fast Performance** - Optimized with React Query for efficient data fetching and caching
- 📱 **Mobile Friendly** - Fully responsive design that works on all devices

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [HugeIcons](https://hugeicons.com/)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query)
- **API:** [MangaDex API](https://api.mangadex.org/docs/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone https://github.com/melviinn/manga-reader.git
cd manga-reader
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory

```env
BASE_API_URL=https://api.mangadex.org
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
manga-reader/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── manga/             # Manga pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── lib/                   # Utility functions and types
└── public/               # Static assets
```

## 🎯 Key Features Explained

### Smart Caching

React Query handles all data fetching with intelligent caching strategies, reducing unnecessary API calls and improving performance.

### Language Persistence

Your language preference is saved per manga using localStorage, so you can read different manga in different languages without switching back and forth.

### Responsive Design

Built mobile-first with Tailwind CSS, the app adapts seamlessly to any screen size.

### Chapter Navigation

Sticky navigation bars with backdrop blur effects make it easy to move between chapters without losing your place.

## 🤝 Contributing

This is a solo project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments


## 📌 MangaDex API Compliance

This project follows MangaDex acceptable usage requirements:

- MangaDex is credited in app metadata and visible UI.
- Scanlation groups are credited on chapter reading pages when available.
- The app is strictly non-commercial (no ads, no paid services).
- If a scanlation group requests content removal, related content must be removed.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/melviinn">@melviinn</a></p>
</div>
