// This route is server-rendered via Cloudflare Workers.
// Add future dynamic features (analytics, contact form, etc.) here.
export const prerender = false;

export async function GET() {
  return Response.json({ status: 'ok' });
}
