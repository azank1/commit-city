// Avatars embedded as data: URIs: cards are shown through GitHub's image proxy and link previews are
// rasterised server-side, so neither can load an image by URL.
export async function avatarUri(url: string | undefined, size: number): Promise<string | null> {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('githubusercontent.com')) u.searchParams.set('s', String(size));
    const r = await fetch(u, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const type = (r.headers.get('content-type') || '').split(';')[0];
    if (!/^image\/(png|jpeg|gif|webp)$/.test(type)) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length > 200_000 ? null : `data:${type};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}
