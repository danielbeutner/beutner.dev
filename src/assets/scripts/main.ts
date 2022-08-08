import { BASE_URL } from './constants';
import { getPage, updateNodes } from './helper';

async function renderPage(targetUrl: URL) {
  const page = await getPage(targetUrl);

  if (page.kind === 'error') {
    console.error(page.message);

    return;
  }

  // Update the head, nav and main section
  const nodes = updateNodes(page.result, ['head', 'nav', 'main']);

  if (nodes.kind === 'error') {
    console.error(nodes.messages);

    return;
  }

  // Scroll up on page update
  self.scrollTo(0, 0);
}

async function handleClick(event: Event) {
  const element = event.target;

  if (!(element instanceof HTMLAnchorElement) || !element.closest('a')) return;

  const targetUrl = new URL(element.href);

  if (targetUrl.hash !== '' || targetUrl.origin !== BASE_URL) return;

  event.preventDefault();
  self.history.pushState({}, '', targetUrl);
  await renderPage(targetUrl);
}

async function handlePopState(event: PopStateEvent) {
  if (event?.target === null || !(event.target instanceof Window)) return;

  const targetUrl = new URL(event.target.location.href);

  await renderPage(targetUrl);
}

self.addEventListener('click', handleClick, true);
self.addEventListener('popstate', handlePopState);
