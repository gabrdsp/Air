const DB_VERSION = 2;

const PREFIX = `air_db_v${DB_VERSION}_`;

export function loadFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load from storage", err);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to save to storage", err);
  }
}

export function clearStorage(key) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.error("Failed to clear storage key", err);
  }
}

/**
 * Converte um objeto File (de um input type="file") para uma string Base64.
 * @param {File} file - O arquivo a ser convertido.
 * @returns {Promise<string>} - Uma Promise que resolve para a string Base64 do arquivo.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}