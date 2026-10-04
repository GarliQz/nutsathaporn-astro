import assert from 'node:assert/strict';
import test from 'node:test';

import { parseBookPageCount } from '../src/lib/book-config.ts';
import { bookPageSequence, formatBookDate, sortBooksNewestFirst, type Book } from '../src/lib/books.ts';

const books: Book[] = [
  { title: 'Older', finishedDate: '2024-01-02', imgPath: '/assets/books/older.webp' },
  { title: 'Newest', finishedDate: '2026-07-04', imgPath: '/assets/books/newest.webp' },
  { title: 'Middle', finishedDate: '2025-05-19', imgPath: '/assets/books/middle.webp' },
];

test('sortBooksNewestFirst returns descending completion dates without mutating input', () => {
  const original = [...books];
  const sorted = sortBooksNewestFirst(books);

  assert.deepEqual(sorted.map((book) => book.title), ['Newest', 'Middle', 'Older']);
  assert.deepEqual(books, original);
});

test('bookPageSequence loads numbered pages from newest to oldest', () => {
  assert.deepEqual(bookPageSequence(4), [4, 3, 2, 1]);
  assert.deepEqual(bookPageSequence(0), []);
  assert.deepEqual(bookPageSequence(2.5), []);
});

test('parseBookPageCount rejects malformed or empty config instead of ending the collection', () => {
  assert.equal(parseBookPageCount({ bookData: 7 }), 7);
  assert.throws(() => parseBookPageCount({ bookData: 0 }), /positive integer/);
  assert.throws(() => parseBookPageCount({ bookData: 2.5 }), /positive integer/);
  assert.throws(() => parseBookPageCount({ bookData: '7' }), /positive integer/);
  assert.throws(() => parseBookPageCount({}), /positive integer/);
  assert.throws(() => parseBookPageCount(null), /positive integer/);
});

test('formatBookDate is stable across host time zones', () => {
  assert.equal(formatBookDate('2026-07-04'), '04 Jul 2026');
  assert.equal(formatBookDate('not-a-date'), 'not-a-date');
});
