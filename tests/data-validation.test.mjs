import assert from 'node:assert/strict';
import test from 'node:test';
import { join, resolve } from 'node:path';

import { isStrictIsoDate, resolveBookCoverPath } from '../scripts/data-validation-lib.mjs';

test('isStrictIsoDate accepts real dates and rejects normalized impossible dates', () => {
  assert.equal(isStrictIsoDate('2024-02-29'), true);
  assert.equal(isStrictIsoDate('2023-02-29'), false);
  assert.equal(isStrictIsoDate('2024-04-31'), false);
  assert.equal(isStrictIsoDate('2024-13-01'), false);
  assert.equal(isStrictIsoDate('not-a-date'), false);
});

test('resolveBookCoverPath keeps covers inside the owned books directory', () => {
  const publicDir = resolve('/tmp/site/public');

  assert.equal(
    resolveBookCoverPath(publicDir, '/assets/books/example.webp'),
    join(publicDir, 'assets', 'books', 'example.webp'),
  );
  assert.throws(
    () => resolveBookCoverPath(publicDir, '/assets/books/../../outside-file'),
    /escapes public\/assets\/books/,
  );
});
