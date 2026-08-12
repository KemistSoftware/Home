# kemist.in

Pre-launch site for Kemist — offline-first billing and inventory software
for retail pharmacies.

Next.js 15 (App Router) · TypeScript · React 19 · no UI framework.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Vercel detects Next.js with no configuration. Then add `kemist.in` under
**Project → Settings → Domains** and point the registrar at Vercel.

Alternatively push to GitHub and import the repo at vercel.com/new — that
gives you preview deploys per branch.

## Collecting sign-ups

`/api/subscribe` refuses to accept an address it cannot store. With nothing
configured it returns `501 not-configured` and the form falls back to a
pre-filled mail draft, so a lead is never silently dropped.

To store them, set **one** of the following in Project → Settings →
Environment Variables (see `.env.example`):

| Variable | Effect |
|---|---|
| `SUBSCRIBE_WEBHOOK_URL` | POSTs `{email, source, ts}` to your endpoint |
| `RESEND_API_KEY` + `NOTIFY_EMAIL` | emails each sign-up to you |

Redeploy after adding them.

## Layout

```
app/
  layout.tsx      metadata, self-hosted Inter, JSON-LD
  page.tsx        server component — all indexable copy
  globals.css     design tokens and layout
  sitemap.ts      -> /sitemap.xml
  robots.ts       -> /robots.txt
  manifest.ts     -> /manifest.webmanifest
  api/subscribe/  sign-up handler
components/
  Hero.tsx        counter panel, batch picker, sign-up form
  Tiles.tsx       the four demo tiles
lib/
  stock.ts        typed catalogue + search + expiry maths
  seo.ts          metadata and structured data
```

## Notes

- The homepage is statically prerendered. Every claim, heading and the
  descriptive paragraph are in the served HTML — nothing meaningful waits
  on JavaScript.
- Inter is self-hosted from `public/fonts`, so there is no Google Fonts
  request on load.
- `lib/stock.ts` is demo data in the shape the real catalogue will use;
  swapping it out needs no UI changes.
- Adding content pages (drug register explainers, GST guides) is the thing
  that will actually move search rankings. Drop them in as `app/<slug>/page.tsx`
  and add the routes to `sitemap.ts`.
