# Seismic — Earthquake Tracker

A live global earthquake monitor: a React dashboard on real-time USGS data, backed by a Ruby on Rails API that ingests the USGS catalog into PostgreSQL and stores comments per event.

**Live demo:** https://seismic-monitor-eight.vercel.app

## Features

- **Live feed** from the USGS Earthquake Hazards Program — past hour / 24 h / 7 days / 30 days, magnitude feeds (All, M1+, M2.5+, M4.5+, Significant), min-magnitude slider, place search, latest/strongest sort
- **Auto-refresh every 60 s** with a LIVE indicator and toasts when new events appear
- **Dark interactive world map** (Leaflet + CARTO) — markers scaled and colored by magnitude, animated shockwaves on M4.5+ events, locate-on-map from the list
- **Stats**: event count, strongest event, average depth, felt reports, tsunami flags and a magnitude histogram
- **Event page**: glowing magnitude, PAGER alert and tsunami chips, depth gauge (surface → upper mantle), regional mini map, nearby activity within 250 km over 30 days, and field notes (comments)

## Structure

- `/frogmi-app` — React frontend (Create React App, React Router, Leaflet). Reads USGS GeoJSON directly, so it deploys as a static site.
- `/seismic_app` — Rails 7 API (PostgreSQL): `Earthquake` and `Comment` models, versioned `api/v1` controllers, `usgs:fetch_data` rake task that upserts the last month of events by USGS id.

### API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/earthquakes?page=&per_page=&min_magnitude=` | Paginated events, newest first |
| GET | `/api/v1/earthquakes/:id` | One event (numeric id or USGS id) with comments |
| GET | `/api/v1/earthquakes/:id/comments` | Comments for an event |
| POST | `/api/v1/earthquakes/:id/comments` | `{ "comment": { "body": "..." } }` |

## Run locally

```bash
# API
cd seismic_app
bundle install
rails db:setup
rails usgs:fetch_data          # ingest the last 30 days from USGS
CORS_ORIGINS=localhost:3000 rails server -p 8000

# Frontend
cd frogmi-app
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

Without `REACT_APP_API_URL` the frontend runs standalone and keeps comments in the browser (this is how the public demo runs).
