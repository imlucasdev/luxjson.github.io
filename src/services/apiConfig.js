const PRODUCTION_API_BASE_URL = 'https://api.luxjson.is-a.dev/api';
const DEVELOPMENT_API_BASE_URL = 'http://localhost:5000/api';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function resolveApiBaseUrl(configuredValue, isProduction) {
  const fallback = isProduction ? PRODUCTION_API_BASE_URL : DEVELOPMENT_API_BASE_URL;
  const candidate = String(configuredValue || '').trim();
  if (!candidate) return fallback;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return fallback;
  }

  if (url.username || url.password || url.search || url.hash) return fallback;
  if (url.pathname.replace(/\/+$/, '') !== '/api') return fallback;

  if (isProduction) {
    if (url.origin !== 'https://api.luxjson.is-a.dev') return fallback;
  } else {
    const isLocalHttp = url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname);
    const isProductionApi = url.origin === 'https://api.luxjson.is-a.dev';
    if (!isLocalHttp && !isProductionApi) return fallback;
  }

  return `${url.origin}/api`;
}

export function shouldAttachAuthToken(requestUrl, baseUrl) {
  const request = String(requestUrl || '').trim();
  if (!request) return false;

  try {
    const base = new URL(baseUrl);
    const basePath = base.pathname.replace(/\/+$/, '');
    const isAbsoluteOrProtocolRelative = /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(request);
    const normalizedRequest = isAbsoluteOrProtocolRelative ? request : request.replace(/^\/+/, '');
    const target = new URL(normalizedRequest, `${base.origin}${basePath}/`);

    if (target.origin !== base.origin) return false;
    if (target.pathname !== basePath && !target.pathname.startsWith(`${basePath}/`)) return false;
    if (target.pathname === `${basePath}/auth/login`) return false;

    return true;
  } catch {
    return false;
  }
}
