import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiBaseUrl, shouldAttachAuthToken } from '../src/services/apiConfig.js';
import { safeExternalUrl } from '../src/utils/safeExternalUrl.js';
import { safeImageUrl } from '../src/utils/safeImageUrl.js';
import { translations } from '../src/utils/translations.js';
import {
  clearAuthToken,
  getStoredToken,
  storeAuthToken,
} from '../src/services/authTokenStorage.js';

const productionApi = 'https://api.luxjson.is-a.dev/api';

test('API base URL is pinned to the expected production origin', () => {
  assert.equal(resolveApiBaseUrl('', true), productionApi);
  assert.equal(resolveApiBaseUrl('https://api.luxjson.is-a.dev/api/', true), productionApi);
  assert.equal(resolveApiBaseUrl('https://attacker.example/api', true), productionApi);
  assert.equal(resolveApiBaseUrl('http://api.luxjson.is-a.dev/api', true), productionApi);
  assert.equal(resolveApiBaseUrl('https://user:pass@api.luxjson.is-a.dev/api', true), productionApi);
  assert.equal(resolveApiBaseUrl('https://api.luxjson.is-a.dev', true), productionApi);
});

test('development API overrides are limited to loopback or production API', () => {
  assert.equal(resolveApiBaseUrl('', false), 'http://localhost:5000/api');
  assert.equal(resolveApiBaseUrl('http://127.0.0.1:5000/api/', false), 'http://127.0.0.1:5000/api');
  assert.equal(resolveApiBaseUrl('https://attacker.example/api', false), 'http://localhost:5000/api');
});

test('admin bearer tokens are only attached to the configured API paths', () => {
  assert.equal(shouldAttachAuthToken('/blog/posts', productionApi), true);
  assert.equal(shouldAttachAuthToken('/auth/me', productionApi), true);
  assert.equal(shouldAttachAuthToken('/auth/login', productionApi), false);
  assert.equal(shouldAttachAuthToken('https://api.luxjson.is-a.dev/api/blog/posts', productionApi), true);
  assert.equal(shouldAttachAuthToken('https://api.luxjson.is-a.dev/private', productionApi), false);
  assert.equal(shouldAttachAuthToken('https://attacker.example/collect', productionApi), false);
  assert.equal(shouldAttachAuthToken('//attacker.example/collect', productionApi), false);
});

test('external links reject unsafe or non-HTTPS destinations', () => {
  assert.equal(safeExternalUrl('https://example.com/project'), 'https://example.com/project');
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('http://example.com'), null);
  assert.equal(safeExternalUrl('//example.com'), null);
  assert.equal(safeExternalUrl('https://user:pass@example.com'), null);
});

test('cover images reject protocol-relative, javascript and remote HTTP URLs', () => {
  assert.equal(safeImageUrl('/images/cover.png'), '/images/cover.png');
  assert.equal(safeImageUrl('https://example.com/cover.png'), 'https://example.com/cover.png');
  assert.equal(safeImageUrl('javascript:alert(1)'), null);
  assert.equal(safeImageUrl('//example.com/cover.png'), null);
  assert.equal(safeImageUrl('http://example.com/cover.png'), null);
  assert.equal(safeImageUrl('http://localhost/cover.png'), 'http://localhost/cover.png');
});

test('all supported languages expose the same translation keys', () => {
  assert.deepEqual(Object.keys(translations.pt).sort(), Object.keys(translations.en).sort());
});

test('admin token stays available in memory when localStorage writes fail', () => {
  const originalWindow = globalThis.window;
  const storage = {
    getItem: () => null,
    setItem: () => { throw new Error('storage quota exceeded'); },
    removeItem: () => {},
  };

  try {
    globalThis.window = { localStorage: storage };
    clearAuthToken();
    storeAuthToken('session-token');
    assert.equal(getStoredToken(), 'session-token');
    clearAuthToken();
    assert.equal(getStoredToken(), null);
  } finally {
    clearAuthToken();
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test('stored admin token is refreshed from localStorage when available', () => {
  const originalWindow = globalThis.window;
  let stored = 'persisted-token';

  try {
    globalThis.window = {
      localStorage: {
        getItem: () => stored,
        setItem: (_key, value) => { stored = value; },
        removeItem: () => { stored = null; },
      },
    };
    clearAuthToken();
    assert.equal(getStoredToken(), 'persisted-token');
    storeAuthToken('rotated-token');
    assert.equal(getStoredToken(), 'rotated-token');
    clearAuthToken();
    assert.equal(getStoredToken(), null);
  } finally {
    clearAuthToken();
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
