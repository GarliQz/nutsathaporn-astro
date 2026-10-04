export function parseBookPageCount(config: unknown): number {
  const pageCount =
    typeof config === 'object' && config !== null && 'bookData' in config
      ? (config as { bookData?: unknown }).bookData
      : undefined;

  if (!Number.isInteger(pageCount) || (pageCount as number) < 1) {
    throw new Error('Book config bookData must be a positive integer');
  }

  return pageCount as number;
}
