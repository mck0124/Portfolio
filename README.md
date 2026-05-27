# Minchan Kim Portfolio

A screen-based portfolio for AI systems, backend architecture, mobile products, and interactive experiments.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
- Vercel-ready static routes

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

Route pages reuse this content so project details, profile sections, awards, and case studies stay consistent without exposing a private PDF resume.

## Key Routes

```txt
/
/projects
/projects/zoop
/projects/phi
/projects/haunted-memories
/about
/archive
/lab
/contact
```

## Public Artifacts

```txt
public/projects/zoop/
```

The ZOOP presentation PDF is intentionally kept out of Git because the local
export is larger than GitHub's single-file limit.
