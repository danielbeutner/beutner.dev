import { SITE } from '../config';

export async function GET() {
  const content = `# www.robotstxt.org

User-agent: *
Disallow:

Sitemap: ${SITE.url}/sitemap-index.xml
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
