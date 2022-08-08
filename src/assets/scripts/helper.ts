import 'unfetch/polyfill';
import { BASE_URL } from './constants';

type Success<T = void> = T extends void
  ? { kind: 'success' }
  : { kind: 'success' } & T;

type Error<T = void> = T extends void
  ? { kind: 'error'; message: string }
  : { kind: 'error' } & T;

type PageResult = Success<{ result: string }> | Error;

/**
 * Gets a page over HTTP GET and returns it as text
 * @param url URL to get the content
 * @returns page in text format
 */
export async function getPage(url: URL): Promise<PageResult> {
  if (url.origin !== BASE_URL)
    return {
      kind: 'error',
      message: 'URL not allowed.',
    };

  const headers = new Headers();
  const request = new Request(url.pathname, {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default',
  });

  try {
    const response = await fetch(request);

    if (response.ok) {
      const result = await response.text();

      return {
        kind: 'success',
        result,
      };
    }

    return {
      kind: 'error',
      message: 'Response was NOT OK.',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        kind: 'error',
        message: error.message,
      };
    }

    return {
      kind: 'error',
      message: 'There is an unknown error in function getPage()',
    };
  }
}

type UpdateNodesResult = Success | Error<{ messages: string[] }>;
/**
 * Updates selected nodes from a given HTML string
 * @param htmlString HTML string to parse
 * @param selectors Selectors to update
 */
export function updateNodes(
  htmlString: string,
  selectors: string[]
): UpdateNodesResult {
  const errors: string[] = [];

  try {
    const dom = new DOMParser();
    const nextDocument = dom.parseFromString(htmlString, 'text/html');

    for (const selector of selectors) {
      const nextNode = nextDocument.querySelector(selector);
      const node = document.querySelector(selector);

      if (
        nextNode !== null &&
        nextNode.innerHTML !== '' &&
        node !== null &&
        node.innerHTML !== ''
      ) {
        node.replaceWith(nextNode);
      } else {
        errors.push(`${selector} is empty`);
      }
    }
  } catch (error) {
    if ('message' in error) {
      errors.push(error.message);
    }
  }

  if (errors.length > 0) {
    return {
      kind: 'error',
      messages: errors,
    };
  }

  return {
    kind: 'success',
  };
}
