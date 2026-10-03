interface BookRecord {
  imgPath: string;
  title: string;
  finishedDate: string;
}

interface BookConfig {
  bookData: number;
}

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Books page is missing required element: ${selector}`);
  return element;
}

const grid = requiredElement<HTMLElement>('#book-grid');
const loadingState = requiredElement<HTMLElement>('#loading-state');
const errorState = requiredElement<HTMLElement>('#load-error');
const retryButton = requiredElement<HTMLButtonElement>('#retry-load');
const sentinel = requiredElement<HTMLElement>('#load-more-sentinel');
const endMessage = requiredElement<HTMLElement>('#first-journey');

let nextPage = 0;
let loadingPage = false;
let loadingConfig = false;
let finished = false;

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function createBookTile(book: BookRecord): HTMLElement {
  const article = document.createElement('article');
  article.className = 'book-tile';
  article.tabIndex = 0;

  const image = document.createElement('img');
  image.className = 'book-tile-image';
  image.src = book.imgPath;
  image.alt = `Cover of ${book.title}`;
  image.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'book-overlay';

  const title = document.createElement('span');
  title.className = 'book-tile-title';
  title.textContent = book.title;

  const date = document.createElement('time');
  date.className = 'book-tile-date';
  date.dateTime = book.finishedDate;
  date.textContent = formatDate(book.finishedDate);

  overlay.append(title, date);
  article.append(image, overlay);
  return article;
}

function setBusy(value: boolean): void {
  loadingState.hidden = !value;
  grid.setAttribute('aria-busy', String(value));
}

function setLoading(value: boolean): void {
  loadingPage = value;
  setBusy(value);
}

function queueNextPageIfViewportNeedsMore(): void {
  if (finished || nextPage < 1) return;

  window.requestAnimationFrame(() => {
    if (sentinel.getBoundingClientRect().top <= window.innerHeight + 360) {
      void loadNextPage();
    }
  });
}

function setFinished(): void {
  finished = true;
  sentinel.hidden = true;
  endMessage.hidden = false;
}

async function loadNextPage(): Promise<void> {
  if (loadingPage || finished || nextPage < 1) return;

  setLoading(true);
  errorState.hidden = true;
  const requestedPage = nextPage;
  let pageLoaded = false;

  try {
    const response = await fetch(`/api-static/book/${requestedPage}.json`);
    if (!response.ok) throw new Error(`Book page ${requestedPage} returned ${response.status}`);

    const books = (await response.json()) as BookRecord[];
    books
      .sort((left, right) => Date.parse(right.finishedDate) - Date.parse(left.finishedDate))
      .forEach((book) => grid.append(createBookTile(book)));

    nextPage = requestedPage - 1;
    pageLoaded = true;
    if (nextPage < 1) setFinished();
  } catch (error) {
    console.error(error);
    errorState.hidden = false;
  } finally {
    setLoading(false);
    if (pageLoaded) queueNextPageIfViewportNeedsMore();
  }
}

retryButton.addEventListener('click', () => {
  if (nextPage > 0) {
    void loadNextPage();
  } else {
    void initialize();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) void loadNextPage();
  },
  { rootMargin: '360px 0px' },
);
observer.observe(sentinel);

async function initialize(): Promise<void> {
  if (loadingConfig) return;

  loadingConfig = true;
  setBusy(true);
  errorState.hidden = true;
  let configLoaded = false;

  try {
    const response = await fetch('/api-static/config.json');
    if (!response.ok) throw new Error(`Book config returned ${response.status}`);

    const config = (await response.json()) as BookConfig;
    nextPage = config.bookData;

    if (!Number.isInteger(nextPage) || nextPage < 1) {
      setFinished();
      return;
    }

    configLoaded = true;
  } catch (error) {
    console.error(error);
    errorState.hidden = false;
  } finally {
    loadingConfig = false;
    setBusy(false);
  }

  if (configLoaded) await loadNextPage();
}

void initialize();
