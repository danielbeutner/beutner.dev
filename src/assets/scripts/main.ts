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

function updateNodes(htmlString: string, selectors: string[]) {
  const dom = new DOMParser();

  selectors.forEach((selector) => {
    const nextNode = dom
      .parseFromString(htmlString, 'text/html')
      .querySelector(selector);
    const node = document.querySelector(selector);

    if (!nextNode || !node) return;

    node.replaceWith(nextNode);
  });
}

async function renderPage(targetUrl: URL) {
  const page = await getPage(targetUrl.pathname);

  if (!page) return;

  // Update the head, nav and main section
  updateNodes(page, ['head', 'nav', 'main']);

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
