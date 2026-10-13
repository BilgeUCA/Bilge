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
```bash
npm run dev
```

### Build
```bash
npm run build
```

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
