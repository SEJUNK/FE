# Receipts of a Life

**Receipts of a Life** is a frontend-only interactive data-storytelling experience that turns fragmented digital records into a chronological narrative.

**Live experience:** https://story-fragments.lovable.app/

## Problem

Large personal datasets are difficult to understand when viewed as isolated rows. This project explores how records from different everyday sources can be normalized into a common fragment model and presented as connected moments, chapters, threads, and patterns.

## Solution

The application combines three organizer-provided archives into a browser-based storytelling experience:

- **Listening history** — 149,860 records spanning 2013–2024
- **Everyday household spending** — 2,461 records spanning 2015–2018
- **Card activity** — 9,417 records spanning 2022–2024

The three sources contain **161,738 raw source records** in total.

Those raw records are transformed into **5,531 curated/discoverable fragments**, which are then used to surface **40 discovered threads** and cross-source patterns.

The application deliberately keeps these concepts separate:

`161,738 source records → 5,531 curated fragments → threads → patterns`

## Key features

### Overture / Home
A narrative introduction to the archive, including:

- source scale and date coverage
- six chronological chapters
- fragment categories
- featured evidence fragments
- discovered moments and patterns

### Explore
A searchable archive with:

- text search
- fragment-type filtering
- chapter filtering
- after-midnight filtering
- progressive rendering
- selected-fragment detail
- related-thread exploration

### Chapters
Six data-driven chapters covering:

1. First Signals — 2013–2014
2. Finding a Sound — 2015–2016
3. The Loud Year — 2017
4. Milk, Trains, Tuesdays — 2018–2019
5. The Inside Years — 2020–2021
6. Moving Again — 2022–2024

### Patterns
Cross-archive observations including listening-hour patterns, repeated artists, spending patterns, attention shifts, recurring places, and dense days.

## Frontend architecture

The project uses:

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS
- Radix UI primitives
- Lucide React
- Recharts where appropriate
- Zod for URL search-state validation

There is **no application backend, database, authentication service, or custom API**. The curated dataset is packaged with the application and processed in the browser.

The TanStack Start server/runtime files are framework infrastructure used by the application build/deployment; no custom business backend or persistent server-side data service is implemented.

## Data processing

The application loads a privacy-safe curated dataset from `src/data/receipts.json`.

Records are represented through a common `Receipt` model containing fields such as:

- type
- timestamp
- title
- subtitle
- detail
- tags
- source
- place
- amount
- derived status

Cross-record relationships are calculated client-side using signals such as:

- same day
- nearby time
- shared place
- shared artist/category
- shared tags
- neighbouring days

Large raw listening history is not rendered as thousands of DOM elements. Visualizations use aggregate statistics and the archive uses progressive rendering for fragment results.

## Accessibility

The interface includes:

- semantic headings and landmarks
- keyboard-accessible controls
- visible focus indicators
- accessible labels for search/filter controls
- textual descriptions for custom visualizations
- reduced-motion support through `prefers-reduced-motion`
- responsive layouts and touch-friendly controls
- no reliance on hover as the only way to access core information

## Performance

The application is designed for a large client-side dataset.

Performance measures include:

- aggregate-driven visualizations
- memoized derived calculations
- progressive fragment rendering
- limited DOM rendering of archive results
- lightweight CSS/SVG visualizations
- avoidance of continuously running decorative effects

## Privacy

The displayed curated dataset intentionally excludes sensitive identifiers from the user-facing experience, including:

- card numbers
- customer IDs
- dates of birth
- street addresses
- precise sensitive coordinates

Card activity is represented through safer fields such as category, amount, city, and related aggregate information.

## Responsive design

The experience is designed for desktop, tablet, and mobile layouts, with special attention to:

- 320px
- 375px
- 390px
- 414px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

The interface uses responsive grids, stacked layouts, progressive content rendering, and overflow-safe visualizations.

## Running locally

Requirements:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Repository structure

- `src/routes/` — application routes and page composition
- `src/components/` — reusable presentation components
- `src/lib/` — data model, aggregation and client-side utilities
- `src/data/receipts.json` — curated, privacy-safe application dataset
- `src/styles.css` — visual system and accessibility motion rules
- `public/` — static public assets

## Privacy and dataset note

The project is intended for the hackathon evaluation environment and uses the organizer-provided source material. The application does not expose the sensitive fields described above in its curated display model.

## Known limitations

- The experience is a storytelling layer over the supplied archives; it cannot infer facts that are not represented by those sources.
- Some fragments are derived/curated rather than direct source rows and are marked accordingly.
- Date gaps reflect the coverage of the supplied archives and should not be interpreted as proof that nothing happened during those periods.

## Hackathon context

This project was created as a frontend-only submission for the WebRush frontend hackathon.

**Author:** Sejal N Khimani

The implementation prioritizes data storytelling, interactive discovery, accessibility, responsive design, and client-side performance while preserving the distinction between raw source records and curated fragments.
