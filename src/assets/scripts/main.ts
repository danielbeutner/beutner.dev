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

async function renderPage(targetUrl: URL) {
  const response = await getPage(targetUrl.pathname);

  const dom = new DOMParser();

  const nextPage = dom
    .parseFromString(response, 'text/html')
    .querySelector('[role="document"]');
  const currentPage = document.querySelector('[role="document"]');

  document.body.replaceChild(nextPage, currentPage);
}

async function handleClick(event: Event) {
  let targetUrl: URL;
  let anchorHref: string;
  const element = event.target;

  if (element instanceof HTMLElement) {
    try {
      anchorHref = element.closest('a').href;
      targetUrl = new URL(anchorHref);
    } catch (error) {
      return false;
    }
  }

  if (!targetUrl || targetUrl.hash !== '') {
    return false;
  }

  if (targetUrl.origin === BASE_URL) {
    event.preventDefault();

    try {
      self.history.pushState({}, undefined, targetUrl);

      await renderPage(targetUrl);
    } catch (error) {
      if ('message' in error) throw new Error(`Reason: ${error.message}`);
    }
  }

  return true;
}

async function handlePopState(event) {
  const targetUrl = new URL(event.target.location.href);

  try {
    await renderPage(targetUrl);
  } catch (error) {
    if ('message' in error) throw new Error(`Reason: ${error.message}`);
  }
}

self.addEventListener('click', handleClick, true);
self.addEventListener('popstate', handlePopState);
