# indonesia-in-numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/destama-ux/indonesia-in-numbers/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/destama-ux/indonesia-in-numbers/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Indonesia in Numbers** — a national statistics site for Indonesia, built
for the make.fun bounty "Make the best national statistics site". It runs in
a web browser from static files with no network request, on a desktop and on
a phone.

## What it is

Five linked sections, every one reachable from the header nav:

- **Overview** — headline figures for 2024 (population, GDP, GDP per capita,
  growth) and ten-year charts for population, GDP and internet use.
- **Economy** — GDP (total or per capita, switchable), annual growth, the
  2024 sector mix, exports and imports, foreign investment and inflation.
- **People** — age structure, life expectancy, fertility, labour force,
  unemployment, child mortality and adult literacy.
- **Society & environment** — internet use, urbanisation and forest cover.
- **Sources & methods** — every indicator with its World Bank code and latest
  value, a sortable table, and a one-click CSV download of the whole dataset.

Every control works: year-range buttons redraw the charts, the GDP buttons
switch measure, the table headings sort, and the CSV button downloads the
data the site ships.

## The data

Every figure is a World Bank World Development Indicators (WDI) value for
Indonesia, 2015–2024, retrieved from the World Bank API on 26 November 2026
and copied into `app/data.js` unchanged. Nothing is estimated. Two WDI
series returned no values for Indonesia in 2015–2024 (CO₂ emissions per
capita; central government debt) and are not shown rather than guessed. The
working-age population share is derived from the two published age shares.
This is an independent showcase, not an official publication.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Node 22.18 or later. No build step, no dependencies, no network requests:
every file the site loads is under `app/`.

## Layout

- `main.ts` — the entrypoint the grader runs; copies `app/` and
  `screenshots/` to `/output` and writes `/output/dossier.json`.
- `app/` — the site: `index.html`, `style.css`, `main.js` (hash router and
  controls), `views.js` (the five pages), `charts.js` (deterministic SVG
  charts), `data.js` (the World Bank figures).
- `screenshots/` — four real renders of the site's own code.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.
- `shots.json` — which views the screenshots were taken of.
- `serve.ts` — a tiny static server for local testing.

## License

MIT — see `LICENSE`.
