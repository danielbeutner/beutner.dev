import 'unfetch/polyfill';

const BASE_URL = self.location.origin;

async function getPage(url: string) {
  const headers = new Headers();
  const request = new Request(url, {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default',
  });

  try {
    const response = await fetch(request);

    if (response.ok) {
      return response.text();
    }
  } catch (error) {
    throw error;
  }
}

function updateDocument(htmlString: string) {
  const dom = new DOMParser();
  const nextPage = dom
    .parseFromString(htmlString, 'text/html')
    .querySelector('[role="document"]');
  const currentPage = document.querySelector('[role="document"]');

  if (!nextPage || !currentPage) return;

  document.body.replaceChild(nextPage, currentPage);
}

function updateHead(htmlString: string) {
  const dom = new DOMParser();
  const nextHead = dom.parseFromString(htmlString, 'text/html').head;
  const currentHead = document.head;

  if (!nextHead || !currentHead) return;

  currentHead.replaceWith(nextHead);
}

async function renderPage(targetUrl: URL) {
  const response = await getPage(targetUrl.pathname);

  if (!response) return;

  // Render the document and the head section
  updateDocument(response);
  updateHead(response);

  // Scroll up on page update
  self.scrollTo(0, 0);
}

async function handleClick(event: Event) {
  let targetUrl: URL;
  let anchorHref: string;
  const element = event.target;

  // If it is not an anchor we do nothing at all
  if (!(element instanceof HTMLAnchorElement)) return;
  if (!element.closest('a')) return;

  try {
    anchorHref = element.href;
    targetUrl = new URL(anchorHref);
  } catch (error) {
    return false;
  }

  if (!targetUrl || targetUrl.hash !== '') {
    return false;
  }

  if (targetUrl.origin === BASE_URL) {
    event.preventDefault();

    try {
      self.history.pushState({}, '', targetUrl);

      await renderPage(targetUrl);
    } catch (error) {
      if ('message' in error) throw new Error(`Reason: ${error.message}`);
    }
  }

  return true;
}

function isLocation(input): input is Location {
  return 'location' in input;
}

async function handlePopState(event: PopStateEvent) {
  if (event?.target === null || !(event.target instanceof Window)) return;

  const targetUrl = new URL(event.target.location.href);

  try {
    await renderPage(targetUrl);
  } catch (error) {
    if ('message' in error) throw new Error(`Reason: ${error.message}`);
  }
}

self.addEventListener('click', handleClick, true);
self.addEventListener('popstate', handlePopState);
