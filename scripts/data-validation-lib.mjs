import { resolve, sep } from 'node:path';

export function isStrictIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function resolveBookCoverPath(publicDir, imagePath) {
  const booksDir = resolve(publicDir, 'assets', 'books');
  const candidate = resolve(publicDir, imagePath.replace(/^\//, ''));

  if (!candidate.startsWith(`${booksDir}${sep}`)) {
    throw new Error(`book cover path escapes public/assets/books: ${imagePath}`);
  }

  return candidate;
}
