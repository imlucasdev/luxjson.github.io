export function safeImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const candidate = value.trim();

  if (candidate.startsWith('//') || [...candidate].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  })) return null;
  if (candidate.startsWith('/')) return candidate;

  try {
    const url = new URL(candidate, 'https://luxjson.is-a.dev');
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    if (url.protocol === 'http:' && url.origin !== 'http://localhost') return null;
    return url.href;
  } catch {
    return null;
  }
}
