# Feature Specification: Astro Site Migration Prototype

## Summary

Create a new Astro project that reproduces the existing GarliQz personal website without changing the current Angular repository. The prototype must preserve the current visual identity, Medium links, book data, book covers, home page, and complete books page. Blog authoring is intentionally deferred.

## Users / Actors

- Visitor: views Sathaporn's profile, external writing links, recent books, and complete reading history.
- Site owner: evaluates Astro as a replacement for the current Angular frontend.

## User Stories & Acceptance Criteria

### US1 - View the personal home page (P1)

**Value**: A visitor sees the same primary content and identity as the current site.

**Independent Test**: Build and open `/`, then confirm the profile header, Medium links, and latest books render from copied source data.

**Acceptance Scenarios**:

1. Given the site is built, when a visitor opens `/`, then the profile header, writing links, and latest books are visible.
2. Given a book has a cover and finished date, when it renders, then its cover, title, and formatted date are visible.
3. Given the viewport is narrow, when the visitor opens the page, then content remains usable without horizontal page overflow.

### US2 - Browse the complete reading history (P1)

**Value**: A visitor can browse all books migrated from the Angular site.

**Independent Test**: Open `/books`, load all available static JSON pages, and reconcile the rendered total with the copied data.

**Acceptance Scenarios**:

1. Given book data pages exist, when a visitor opens `/books`, then books are shown newest first.
2. Given more data pages remain, when the visitor approaches the page end, then the next page loads without a full navigation.
3. Given all pages are loaded, when the visitor reaches the end, then the first-journey message appears.
4. Given an image is loading or unavailable, when the page renders, then layout remains stable and usable.

## Functional Requirements

- FR-001: The project MUST use Astro as its application framework.
- FR-002: The project MUST preserve `/` and `/books` routes.
- FR-003: The home page MUST display the current profile identity and external Medium links.
- FR-004: The home page MUST display the latest books from the copied sample JSON.
- FR-005: The books page MUST consume copied paginated static JSON and load all pages newest first.
- FR-006: The project MUST copy required public data and image assets from `GarliQz/nutsathaporn-code` without modifying that repository.
- FR-007: The production build MUST generate a static site suitable for GitHub Pages deployment.
- FR-008: The project MUST document local development, build, and migration provenance.

## Data / Key Entities

- Writing link: title and external URL.
- Book: title, completion date, and public cover path.
- Book data configuration: latest numbered JSON page.

## Edge Cases & Failure Modes

- Missing or invalid book JSON must fail the build for build-time data.
- A failed client-side book page request must show a retryable error state.
- Missing cover images must not collapse the book grid.
- External writing links must open safely with `noopener noreferrer`.

## Success Criteria

- SC-001: `npm run build` completes successfully.
- SC-002: `/` and `/books` are generated as static HTML routes.
- SC-003: Automated checks reconcile every copied book record with the source dataset.
- SC-004: A local production preview returns successful responses for both routes and static JSON.
- SC-005: No change is made to `GarliQz/nutsathaporn-code`.

## Assumptions

- The prototype is hosted at a domain root; repository-subpath deployment is not required yet.
- The current Medium entries remain external links.
- Astro migration covers the visitor-facing website only in this iteration.

## Out of Scope

- Markdown/MDX blog authoring and content collections.
- Migrating Medium article contents.
- Production deployment to `GarliQz/garliqz.github.io`.
- Migrating `bookctl`, PR automation, or deployment scripts.
- Modifying or merging the existing Angular project.
