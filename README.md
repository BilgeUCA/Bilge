<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/logo/master/bilge-horizontal-reversed.svg">
    <img src="brand/logo/master/bilge-horizontal.svg" alt="BILGE" width="320">
  </picture>
</p>

# Bilge

A web application for exploring universities, scholarships, and ORT preparation resources for Kyrgyz citizens.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development

The app gets its catalog, accounts and saved data from the
[Bilge API](../bilge-api). Start the API first (`docker compose up -d` in
`bilge-api`), then:

```bash
npm run dev
```

The dev and preview servers forward `/v1` requests to `http://localhost:5080`.
Set `BILGE_API_URL` to proxy to another API.

### Build
```bash
npm run build
```

The built app calls the API at `/v1` on its own origin, so serve it behind a
reverse proxy that forwards `/v1` to the API. Alternatively, build with
`VITE_API_URL=https://api.example.com/v1` and add that origin to the API's
`Cors__AllowedOrigins`.

### Data and accounts

- API calls live in [`src/api/`](src/api/). `useApi` fetches data, and
  `client.js` adds the access token and language, refreshing the token when it expires.
- Signed-in users' saved items, checklists, practice results and language and theme are
  stored in their account.
- Guests keep these in `localStorage`. On sign-in they are imported into the
  account (`POST /me/import`) and cleared from the browser.

## Features

- University directory and search
- Scholarship information
- ORT exam preparation materials
- Multi-language support
- Responsive design

## Tech Stack

- React
- Vite
- JavaScript

## Brand

The logo, **Book Peaks**, is an open book whose pages rise into the Ala-Too mountains, with the sun coming up between them.

- Logo files, icons and colour variants: [`brand/logo/`](brand/logo/)
- How to use the logo: [`brand/logo/GUIDELINES.md`](brand/logo/GUIDELINES.md)
- Colours: Bilge Blue `#2563EB` · Kun Amber `#F59E0B` · Ink `#111827`
- In the app, use the [`BrandLogo`](src/components/ui/BrandLogo.jsx) component; it switches to the reversed logo in dark mode.
