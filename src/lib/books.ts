import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface Book {
  imgPath: string;
  title: string;
  finishedDate: string;
}

export interface WritingLink {
  title: string;
  link: string;
  publishDate?: string;
}

export interface BookConfig {
  bookData: number;
}

export function sortBooksNewestFirst(books: readonly Book[]): Book[] {
  return [...books].sort(
    (left, right) => Date.parse(right.finishedDate) - Date.parse(left.finishedDate),
  );
}

export function bookPageSequence(latestPage: number): number[] {
  if (!Number.isInteger(latestPage) || latestPage < 1) return [];
  return Array.from({ length: latestPage }, (_, index) => latestPage - index);
}

export function formatBookDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

async function readPublicJson<T>(relativePath: string): Promise<T> {
  const filePath = join(process.cwd(), 'public', relativePath);
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

export function loadSampleBooks(): Promise<Book[]> {
  return readPublicJson<Book[]>('api-static/sample/book.json');
}

export function loadWritingLinks(): Promise<WritingLink[]> {
  return readPublicJson<WritingLink[]>('api-static/sample/post.json');
}
