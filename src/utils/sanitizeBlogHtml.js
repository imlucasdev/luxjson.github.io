const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a',
]);
const DISCARDED_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template',
]);

function safeHref(value) {
  const href = String(value || '').trim();
  if (!href || href.startsWith('//') || [...href].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  })) return null;
  if (/^(#|\/(?!\/)|\.\.?\/|\?)/.test(href)) return href;
  if (/^mailto:[^\s]+$/i.test(href)) return href;

  try {
    const url = new URL(href, 'https://luxjson.is-a.dev');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function cleanChildren(parent) {
  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const tag = node.tagName.toLowerCase();
    if (DISCARDED_TAGS.has(tag)) {
      node.remove();
      continue;
    }

    cleanChildren(node);

    if (!ALLOWED_TAGS.has(tag)) {
      node.replaceWith(...Array.from(node.childNodes));
      continue;
    }

    const href = tag === 'a' ? safeHref(node.getAttribute('href')) : null;
    for (const attribute of Array.from(node.attributes)) node.removeAttribute(attribute.name);

    if (tag === 'a' && href) {
      node.setAttribute('href', href);
      const parsed = href.startsWith('#') || href.startsWith('/') || href.startsWith('?') || href.startsWith('./') || href.startsWith('../') || href.startsWith('mailto:')
        ? null
        : new URL(href, 'https://luxjson.is-a.dev');
      if (parsed && parsed.origin !== 'https://luxjson.is-a.dev') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    } else if (tag === 'a') {
      node.replaceWith(...Array.from(node.childNodes));
    }
  }
}

export function sanitizeBlogHtml(value) {
  if (typeof DOMParser === 'undefined' || typeof Node === 'undefined') return '';
  const document = new DOMParser().parseFromString(String(value || ''), 'text/html');
  cleanChildren(document.body);
  return document.body.innerHTML;
}
