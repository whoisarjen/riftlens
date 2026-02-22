# Riftlens

**Deep vision into the Rift** — Open source League of Legends analytics platform.

Search players, explore champion tier lists, and dive deep into match analysis with gold graphs, damage breakdowns, ward heatmaps, and timeline events.

## Features

- **Player Lookup** — Search by Riot ID, view ranked stats, match history, and champion mastery
- **Champion Analytics** — Win rates, pick/ban rates, builds, runes, skill orders, and matchups
- **Deep Match Analysis** — Gold/XP difference charts, damage breakdowns, ward placement maps, event timelines
- **Fast & Cached** — Neon Postgres caching layer minimizes API calls and speeds up repeat lookups

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Database | [Neon Postgres](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/) |
| Fonts | [Geist](https://vercel.com/font) (Sans + Mono) |
| Icons | [Lucide](https://lucide.dev/) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Riot Games API key](https://developer.riotgames.com/)
- A [Neon](https://neon.tech/) database (free tier works)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/riftlens.git
   cd riftlens
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in your `RIOT_API_KEY` and `DATABASE_URL`.

4. **Push database schema**

   ```bash
   npx drizzle-kit push
   ```

5. **Sync champion data**

   Start the dev server and trigger Data Dragon sync:

   ```bash
   npm run dev
   ```

   Then in another terminal:

   ```bash
   curl -X POST http://localhost:3000/api/champions/sync
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) and start searching!

## Project Structure

```
app/
  (main)/
    page.tsx                    # Landing page
    champions/                  # Champion tier list & detail pages
    summoner/[region]/[name]/   # Player profile pages
    match/[matchId]/            # Match analysis pages
  api/
    summoner/                   # Player lookup & match history APIs
    champions/                  # Tier list & champion detail APIs
    match/                      # Match detail & timeline APIs
components/
  layout/                       # Header, footer, search bar
  summoner/                     # Player profile components
  champions/                    # Champion analytics components
  match/                        # Match analysis components
  charts/                       # Recharts wrapper components
  ui/                           # shadcn/ui base components
lib/
  riot/                         # Riot API client (account, summoner, match, ddragon)
  db/                           # Drizzle schema, connection, queries
  types/                        # TypeScript interfaces
  utils.ts                      # Helpers & formatters
  constants.ts                  # Regions, queues, tiers
```

## Deployment

Deploy to [Vercel](https://vercel.com/) with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/riftlens&env=RIOT_API_KEY,DATABASE_URL,NEXT_PUBLIC_DDRAGON_VERSION)

Or deploy anywhere that supports Next.js — set the environment variables and run:

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Legal

Riftlens is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

## License

[MIT](LICENSE)
