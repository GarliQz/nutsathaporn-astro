# Nutsathaporn Astro

Astro migration prototype for the GarliQz personal website. This repository reproduces the current home and reading-history experience while keeping the production Angular repository unchanged.

## Scope

- Personal profile and cover header
- Existing external Medium writing links
- Latest-book carousel
- Complete reading history with progressive static-JSON loading
- Existing book covers and static data
- Static production output suitable for GitHub Pages

Blog authoring with Markdown/MDX is intentionally deferred to the next phase.

## Development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:4321/>.

## Quality Gates

```bash
npm run validate:data
npm run check
npm test
npm run build
npm run preview
```

## Git Hooks

`npm install` runs Husky's `prepare` script and configures the repository-local hooks:

- `pre-commit` runs `npm test`.
- `pre-push` runs `npm run check` followed by `npm run build`.

These hooks are local safeguards and can be bypassed with `--no-verify`; they do not provide server-side PR verification.

## Routes

- `/` — profile, writing links, and latest books
- `/books/` — complete reading history

## Data Provenance

The visitor-facing files under `public/api-static/` and `public/assets/` were copied from [`GarliQz/nutsathaporn-code`](https://github.com/GarliQz/nutsathaporn-code) for this isolated migration prototype. The original Angular repository remains unchanged and is still the current operational source of truth.

Until a shared publishing workflow is introduced, changes to book data in the Angular project do not automatically update this repository.

## Project Documentation

- [Feature specification](specs/001-astro-site-migration/spec.md)
- [Implementation plan](specs/001-astro-site-migration/plan.md)
- [Task list](specs/001-astro-site-migration/tasks.md)
