# GitHub Finder

A small React app that looks up GitHub users by username, shows profile details, and offers debounced search suggestions plus a recent-search history stored in the browser.

## Why this project is useful

It demonstrates practical patterns for a real API-driven UI: typed fetch helpers, TanStack Query for caching and loading states, debounced autocomplete, `localStorage` persistence, and query prefetching on hover. The codebase stays small and readable, which makes it a good reference for portfolio work or learning client-side data fetching in React.

## Implemented features

- **GitHub user lookup** — submit a username to load profile data (avatar, name, bio, profile link) via the GitHub REST API (`src/api/github.ts`, `src/components/UserCard.tsx`).
- **Debounced autocomplete** — while typing, suggestions appear after 300ms using `use-debounce` and a secondary TanStack Query (`src/components/UserSearch.tsx`, `src/components/SuggestionDropdown.tsx`).
- **Recent searches** — last five usernames saved in `localStorage` and shown as quick picks (`src/components/RecentSearch.tsx`).
- **Query prefetching** — hovering a recent search prefetches that user’s profile (`src/components/RecentSearch.tsx`).
- **Loading and error states** — spinner text and error messages driven by TanStack Query (`src/components/UserSearch.tsx`).
- **React Query Devtools** — available in development (`src/main.tsx`).

Not implemented in this repo: client-side routing, i18n, global state libraries (e.g. Zustand), or a dark/light theme toggle.

## Tech stack

| Area         | Choice                                     |
| ------------ | ------------------------------------------ |
| UI           | React 19, TypeScript                       |
| Build        | Vite 8                                     |
| Server state | TanStack Query (`@tanstack/react-query`)   |
| Utilities    | `use-debounce`, `react-icons`              |
| Styling      | Plain CSS (`src/index.css`)                |
| API          | GitHub REST API (`https://api.github.com`) |

## Getting started

### Prerequisites

- Node.js 18+ (recommended for Vite 8)
- npm (or another package manager compatible with `package-lock.json`)

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root (see `.env` for the expected shape):

```bash
VITE_GITHUB_API_URL=https://api.github.com
```

`VITE_` variables are exposed to the client by Vite. Use the public GitHub API URL unless you proxy requests through your own backend.

### Start the frontend

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

There is no separate backend in this project; the app talks to GitHub directly from the browser.

## Scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                        |
| `npm run build`   | Type-check with `tsc` and production build to `dist/` |
| `npm run preview` | Serve the production build locally                    |
| `npm run lint`    | Run ESLint on the project                             |

## Project structure

```
github-finder/
├── src/
│   ├── api/
│   │   └── github.ts          # fetchGithubUser, searchGithubUser
│   ├── components/
│   │   ├── UserSearch.tsx     # form, queries, recent list wiring
│   │   ├── UserCard.tsx       # profile card
│   │   ├── SuggestionDropdown.tsx
│   │   └── RecentSearch.tsx
│   ├── App.tsx                # app shell
│   ├── main.tsx               # QueryClientProvider, React Query Devtools
│   ├── types.ts               # GithubUser type
│   └── index.css              # layout and component styles
├── index.html
├── vite.config.ts
├── package.json
└── .env                       # VITE_GITHUB_API_URL (not committed if gitignored)
```

## Usage example

1. Run `npm run dev` and open the app in the browser.
2. Type at least two characters in the search field — up to five matching GitHub logins appear in the dropdown.
3. Click a suggestion or press **Search** to load the user card.
4. Open **Recent Searches** and click a username to search again; hover an item to prefetch its profile data.

Example API usage in code:

```ts
import { fetchGithubUser } from "./api/github";

const user = await fetchGithubUser("octocat");
// user.login, user.avatar_url, user.html_url, ...
```

## Where to get help

- [GitHub REST API — Users](https://docs.github.com/en/rest/users/users) for response fields and rate limits.
- [TanStack Query docs](https://tanstack.com/query/latest) for caching, `enabled`, and prefetch patterns.
- [Vite env variables](https://vite.dev/guide/env-and-mode.html) for `VITE_*` configuration.
- Project notes and React lifecycle references: [README2.md](README2.md) (study notes, not required to run the app).

For bugs or questions about this repository, open an issue on GitHub if the project is published there.

## Maintainers and contribution

This is a personal pet project. Contributions are welcome via pull requests; keep changes focused and match existing TypeScript and component style.

Before submitting a PR:

1. Run `npm run lint` and `npm run build`.
2. Avoid committing `.env` or secrets.
3. Describe what you changed and how to test it.

There is no `CONTRIBUTING.md` or `LICENSE` file in the repo yet; add them if you plan to open-source the project formally.
