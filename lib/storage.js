const STORAGE_KEY = 'markview_content';

export function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, content);
  } catch {
    // localStorage unavailable (SSR or private mode)
  }
}

export function loadContent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearContent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
