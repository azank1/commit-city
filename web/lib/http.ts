// Small helpers shared by the API functions.

export class HttpError extends Error {
  constructor(readonly status: number, message: string, readonly extra: Record<string, unknown> = {}) { super(message); }
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export function handle(fn: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    try {
      return await fn(req);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message, ...e.extra }, e.status);
      console.error(e);
      return json({ error: 'internal error' }, 500);
    }
  };
}

type Handler = (req: Request) => Promise<Response>;

/**
 * Several small endpoints in one function (the Hobby plan allows 12 per deployment): vercel.json rewrites
 * each public path to the function with ?op=<name>.
 */
export function dispatch(routes: Record<string, { GET?: Handler; POST?: Handler }>, method: 'GET' | 'POST'): Handler {
  return async req => {
    const op = new URL(req.url).searchParams.get('op') ?? '';
    if (!Object.hasOwn(routes, op)) return json({ error: 'not found' }, 404);
    const h = routes[op][method];
    return h ? h(req) : json({ error: 'method not allowed' }, 405);
  };
}

export async function body<T>(req: Request, max = 512_000): Promise<T> {
  const text = await req.text();
  if (text.length > max) throw new HttpError(413, 'request too large');
  try { return JSON.parse(text) as T; } catch { throw new HttpError(400, 'invalid JSON'); }
}

export function clientIp(req: Request): string {
  return req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export const SITE = process.env.SITE_URL || 'https://commit.city';
