# FileForge site

The standalone website for **FileForge**: the Paper to Digital scanning
service (the main offer) and the FileForge Finder desktop app (free and Finder+
editions, secondary). It was split out of the Momentum CE website (`MomentumWebsite`) and
keeps the same stack, so anyone who has worked on that repo will find this one
familiar.

Next.js 16 (App Router) · React 19 · Tailwind 4 · deployed on Netlify.

## Routes

| Route | What it is |
|---|---|
| `/` | Rewritten to `/fileforge-service` (see `next.config.ts`), so the bare domain shows the service page |
| `/fileforge-service` | Paper to Digital scanning service (canonical home); ends with a callout to Finder and the `#contact` form |
| `/finder` | FileForge Finder landing page |
| `/fileforge-plus` | FileForge Finder+ (paid edition) |
| `/finder/download-confirm` | Starts the installer download and shows install steps |
| `/finder/early-access` · `/signin` · `/subscribe` · `/account` | Outseta-powered account funnel (noindex) |
| `/finder/auth/callback` | Desktop-app sign-in relay: trades the Outseta code for a token server-side, deep-links to `fileforge://` |
| `/finder/feedback` | Feedback form (Netlify Forms, `fileforge-feedback`) |
| `/finder/terms` · `/finder/privacy` | Legal documents rendered from `content/legal/*.md` |
| `/ff-stats` | Internal download-stats dashboard (noindex, needs `DOWNLOAD_STATS_KEY`) |
| `/api/download-ff` | Mints signed CloudFront installer URLs (free / password / Outseta token) |
| `/api/download-ff/stats` | Download counter behind `DOWNLOAD_STATS_KEY` |
| `/api/update-feed` | Signed auto-update feed URL for installed copies of Finder |

The Finder tree moved from `/fileforge/*` to `/finder/*` **with no redirects
from the old paths** — they 404 here. Nothing on this domain links to them any
more, but the desktop app, Outseta and the legal documents were all written
against the old paths (see "Moving off momentumce.com" below), so those
references have to be repointed rather than relied on. The service and Finder+
pages keep their original `/fileforge-service` and `/fileforge-plus` paths.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open <http://localhost:3000>. `.env.example` documents every variable the code
reads. Netlify Blobs (rate limiting, download counter) is not available in
`next dev`; both fail open locally by design.

```bash
npm run lint        # eslint
npm run test:unit   # rate-limit counter tests (node:test)
npm run test:e2e    # Playwright: page smoke tests + contact form, dev server on :3100
npm run test:smoke  # post-deploy contact-form check (needs Netlify token, see script)
```

## Where things live

- `app/` — routes. `layout.tsx` sets `metadataBase` from `lib/site.ts`, so every
  page's `canonical` and `openGraph.url` are relative.
- `components/fileforge/` — Paper to Digital service page sections, including
  `FinderCallout.tsx`, the hand-off to the app.
- `components/fileforge-finder/` — Finder landing page, download button, auth
  headers, plan cards, feedback form, brand marks.
- `components/fileforge-plus/` — Finder+ page sections.
- `components/Navigation.tsx`, `Footer.tsx` — site chrome, trimmed to FileForge.
- `lib/site.ts` — `SITE_URL`, `CONTACT_HREF`, `MOMENTUM_URL`. Change the domain
  or the contact destination here, nowhere else.
- `lib/cloudfront.ts`, `download-guards.ts`, `download-tracking.ts`,
  `rate-limit.ts`, `presign.ts` — installer delivery, origin checks, rate
  limits, download counter. Identical to the Momentum repo apart from the
  origin allowlist now following `SITE_URL`.
- `content/legal/` — Terms of Use and Privacy Policy markdown.
- `app/globals.css` — the Momentum stylesheet with only the sections these
  pages use (nav, footer, buttons, pricing card, form controls, article,
  `.ff-page` tokens, plan cards, responsive), plus a small block at the end for
  the FileForge wordmark logo.
- `components/Contact.tsx` — the contact form (Netlify Forms, `contact`).
- `public/__forms.html` — static stubs so Netlify detects both forms at build time.
- `scripts/post-deploy-smoke.mjs` — submits and then deletes a test entry against
  the deployed contact form; run by `.github/workflows/post-deploy-smoke.yml`.

## Decisions made during the split

- **Service first.** `/` rewrites to `/fileforge-service`; the nav, footer,
  sitemap priorities and site description all lead with Paper to Digital.
  Finder is secondary: linked from the nav, the footer, and the
  `FinderCallout` band near the end of the service page. The download CTA
  replaces the discovery-call CTA in the nav only on the Finder pages. Swap the
  rewrite in `next.config.ts` if this ever flips back.
- **Contact form on the home page.** `components/Contact.tsx` renders at the
  bottom of the service page under `#contact`; every orange "Learn more"
  discovery-call CTA points at `CONTACT_HREF` = `/#contact`. Submissions go
  to Netlify Forms as `contact` (topics: Paper to Digital, Finder, Finder+,
  general, other). The Momentum CE consulting topics stay on momentumce.com.
- **Favicon.** `app/icon.svg` is the FileForge Finder detective-duck mark, the
  same artwork as `FinderDuckLogo` in `components/fileforge-finder/FinderMark.tsx`
  (kept in sync by hand — the standalone file uses fixed gradient ids instead of
  the component's `idPrefix`). There are no PNG icons or a web manifest yet; add
  `app/apple-icon.png` and `app/manifest.ts` when final FileForge icon artwork
  exists.
- **Light mode only.** There is no dark theme and no theme toggle: `.ff-page`
  carries one set of light tokens in `app/globals.css`, and Tailwind `dark:`
  variants are not used (they would fire off `prefers-color-scheme` and
  reintroduce a half-dark page).
- **Legal text is verbatim.** `content/legal/*.md` still say
  "momentumce.com/fileforge/terms", "privacy@momentumce.com", etc. Those are
  legal documents; update them deliberately (and bump their version/effective
  date) rather than search-and-replace.
- **Left on momentumce.com:** the accounting-app routes (`/api/download`,
  `/api/acct-update-feed`, the gated download pages), the blog, every
  consulting page and its own contact form.

## Moving off momentumce.com

Things outside this repo point at `momentumce.com/fileforge/...` and must be
updated (or kept working there) when this site goes live on its own domain:

1. **FileForge Finder desktop app** — `authClient.js` redirect URI (now
   `/finder/auth/callback`), the download/feed API base (`/api/download-ff`,
   `/api/update-feed`), the Settings ▸ Feedback link (now `/finder/feedback`),
   and any "open website" links. Installed copies keep using whatever URL was
   baked in at build time, so **keep the Momentum routes serving until an
   updated app has shipped**, or add redirects there. Note the two Finder paths
   changed in this repo and there is no `/fileforge/*` fallback here, so an app
   build pointed at this domain must use the `/finder/*` URLs.
2. **Outseta** (`momentum-ce.outseta.com`) — add the new domain to the allowed
   embed/redirect origins and register the new redirect URI. Set
   `OUTSETA_REDIRECT_URI` on Netlify to match.
3. **Netlify** — new site, `publish = ".next"`, env vars from `.env.example`.
   Enable Blobs. The `contact` and `fileforge-feedback` forms register from
   `public/__forms.html` on first deploy; add `NETLIFY_AUTH_TOKEN` and
   `NETLIFY_SITE_ID` as GitHub secrets for the post-deploy smoke test.
4. **CloudFront** — no change needed; signing is by key pair, not by domain. If
   the Momentum site keeps its Finder download buttons, either leave its copy of
   `/api/download-ff` in place or set `DOWNLOAD_ALLOWED_HOSTS` here to include
   `momentumce.com`.
5. **Redirects on momentumce.com** — once everything above is done, 301
   `/fileforge-service` and `/fileforge-plus` to the same paths here, `/fileforge`
   and `/fileforge/*` to `/finder` and `/finder/*`, and remove the FileForge
   components from that repo.
