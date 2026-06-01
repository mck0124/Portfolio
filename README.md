# Minchan Kim Portfolio

A concise one-page portfolio for AI systems, backend architecture, mobile products, and interactive product work.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react
- Vercel-ready static page

## Local Development

```bash
npm install
npm run dev
```

The current local preview is usually available at:

```txt
http://localhost:3001
```

Use port `3001` if another project is already using `3000`.

```bash
npm run dev -- -p 3001
```

## Build Checks

```bash
npm run lint
npm run build
```

## Content Model

Portfolio content is centralized in:

```txt
src/content/portfolio.ts
```

The homepage reuses this content for work, profile, skills, awards, and contact sections without exposing a private PDF resume.

## Key Route

```txt
/
```

## Public Artifacts

```txt
public/projects/zoop/
```

The ZOOP presentation PDF is intentionally kept out of Git because the local
export is larger than GitHub's single-file limit.
