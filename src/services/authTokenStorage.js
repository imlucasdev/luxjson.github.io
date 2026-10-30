let memoryToken = null;

export function getStoredToken() {
  try {
    const storedToken = window.localStorage.getItem('lux-token');
    if (storedToken) memoryToken = storedToken;
    return storedToken || memoryToken;
  } catch {
    return memoryToken;
  }
}

export function storeAuthToken(token) {
  memoryToken = typeof token === 'string' && token ? token : null;
  try {
    if (memoryToken) window.localStorage.setItem('lux-token', memoryToken);
    else window.localStorage.removeItem('lux-token');
  } catch {
    // Keep the token in memory for the current page session.
  }
}

export function clearAuthToken() {
  memoryToken = null;
  try {
    window.localStorage.removeItem('lux-token');
  } catch {
    // In-memory state is already cleared.
  }
}
