# CivicPulse Frontend

React 19 + Vite + Tailwind CSS. See the root `README.md` for the full project
overview, API documentation, and deployment guide.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173, /api and /ws proxied to localhost:8080
```

The backend must be running locally (see the root README). In dev mode no
`.env` file is needed: the Vite proxy handles API calls.

## Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serves the production build locally
```

For a deployed build, set `VITE_API_URL` and `VITE_WS_URL` to the backend URL
(see `.env.example`). Both are baked in at build time.

## Lint

```bash
npm run lint
```
