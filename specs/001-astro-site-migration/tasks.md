# Tasks: Astro Site Migration Prototype

## Phase 1 - Setup

- [x] T001 Create the Astro project configuration and package scripts in `package.json`, `astro.config.mjs`, and `tsconfig.json`.
- [x] T002 [P] Add repository hygiene and project documentation in `.gitignore` and `README.md`.
- [x] T003 [P] Copy required static JSON and image assets from `nutsathaporn-code/public/` into `public/`.

## Phase 2 - Foundations

- [x] T004 Create shared types and deterministic book utilities in `src/lib/books.ts`.
- [x] T005 [P] Create the shared page shell in `src/layouts/BaseLayout.astro`.
- [x] T006 [P] Port and consolidate responsive visual styles in `src/styles/global.css`.

## Phase 3 - US1 Home Page

- [x] T007 [US1] Implement the profile header in `src/components/ProfileHeader.astro`.
- [x] T008 [P] [US1] Implement external writing links in `src/components/WritingList.astro`.
- [x] T009 [P] [US1] Implement the recent-book carousel in `src/components/BookCarousel.astro`.
- [x] T010 [US1] Compose the home route in `src/pages/index.astro`.

## Phase 4 - US2 Complete Books Page

- [x] T011 [US2] Implement the complete books route shell in `src/pages/books.astro`.
- [x] T012 [US2] Implement progressive paginated loading and retry behavior in `src/scripts/books-loader.ts`.

## Phase 5 - Verification and Delivery

- [x] T013 Add behavior tests in `tests/books.test.ts` and data validation in `scripts/validate-data.mjs`.
- [x] T014 Run data reconciliation, Astro check, automated tests, production build, and HTTP smoke tests.
- [x] T015 Review the final diff, commit the single-purpose migration, push the feature branch, and open a PR without merging.

## Dependencies

- T001 blocks all implementation tasks.
- T003 and T004 block book rendering and validation.
- T005 and T006 block final page composition.
- T007-T010 complete US1.
- T011-T012 complete US2.
- T013 blocks final verification.
- T014 blocks delivery in T015.

## Implementation Strategy

Deliver a static home page first, then the independently testable complete-books route, then prove the generated site through data reconciliation, tests, build, and live preview requests.
