import { access, readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { isStrictIsoDate, resolveBookCoverPath } from './data-validation-lib.mjs';

const root = process.cwd();
const publicDir = join(root, 'public');
const apiDir = join(publicDir, 'api-static');

function fail(message) {
  throw new Error(message);
}

async function readJson(relativePath) {
  const absolutePath = join(publicDir, relativePath);
  try {
    return JSON.parse(await readFile(absolutePath, 'utf8'));
  } catch (error) {
    fail(`${relativePath} is missing or invalid JSON: ${error.message}`);
  }
}

export function validateBook(book, source) {
  if (!book || typeof book !== 'object') fail(`${source} contains a non-object book record`);
  if (typeof book.title !== 'string' || book.title.trim() === '') fail(`${source} contains a book without a title`);
  if (typeof book.imgPath !== 'string' || !book.imgPath.startsWith('/assets/books/')) {
    fail(`${source} contains an invalid image path for ${book.title}`);
  }
  try {
    resolveBookCoverPath(publicDir, book.imgPath);
  } catch {
    fail(`${source} contains an image path outside public/assets/books for ${book.title}`);
  }
  if (!isStrictIsoDate(book.finishedDate)) {
    fail(`${source} contains an invalid or impossible finishedDate for ${book.title}`);
  }
}

async function run() {
  const config = await readJson('api-static/config.json');
  if (!Number.isInteger(config.bookData) || config.bookData < 1) {
    fail('api-static/config.json must contain a positive integer bookData');
  }

  const actualPageFiles = (await readdir(join(apiDir, 'book')))
    .filter((name) => /^\d+\.json$/.test(name))
    .sort((left, right) => Number(left.slice(0, -5)) - Number(right.slice(0, -5)));
  const expectedPageFiles = Array.from({ length: config.bookData }, (_, index) => `${index + 1}.json`);
  if (JSON.stringify(actualPageFiles) !== JSON.stringify(expectedPageFiles)) {
    fail(`book page files do not match config: expected ${expectedPageFiles.join(', ')}, found ${actualPageFiles.join(', ')}`);
  }

  const allBooks = [];
  for (const pageFile of expectedPageFiles) {
    const relativePath = `api-static/book/${pageFile}`;
    const books = await readJson(relativePath);
    if (!Array.isArray(books) || books.length === 0 || books.length > 15) {
      fail(`${relativePath} must contain between 1 and 15 records`);
    }
    books.forEach((book) => validateBook(book, relativePath));
    allBooks.push(...books);
  }

  for (const book of allBooks) {
    await access(resolveBookCoverPath(publicDir, book.imgPath)).catch(() => {
      fail(`missing cover image for ${book.title}: ${book.imgPath}`);
    });
  }

  const sampleBooks = await readJson('api-static/sample/book.json');
  if (!Array.isArray(sampleBooks) || sampleBooks.length !== Math.min(10, allBooks.length)) {
    fail('api-static/sample/book.json must contain the latest 10 books');
  }
  sampleBooks.forEach((book) => validateBook(book, 'api-static/sample/book.json'));

  const expectedSample = [...allBooks]
    .sort((left, right) => Date.parse(`${right.finishedDate}T00:00:00Z`) - Date.parse(`${left.finishedDate}T00:00:00Z`))
    .slice(0, 10);
  if (JSON.stringify(sampleBooks) !== JSON.stringify(expectedSample)) {
    fail('api-static/sample/book.json does not match the latest 10 paginated book records');
  }

  const posts = await readJson('api-static/sample/post.json');
  if (!Array.isArray(posts) || posts.length === 0) fail('api-static/sample/post.json must contain writing links');
  for (const post of posts) {
    if (typeof post.title !== 'string' || post.title.trim() === '') fail('writing link title is required');
    try {
      const url = new URL(post.link);
      if (url.protocol !== 'https:') fail(`writing link must use HTTPS: ${post.link}`);
    } catch {
      fail(`writing link is invalid: ${post.link}`);
    }
  }

  console.log(`Validated ${allBooks.length} books across ${config.bookData} pages, ${sampleBooks.length} sample books, and ${posts.length} writing links.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await run();
}
