const PREFIX = 'air_db_';

export const saveToStorage = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(data));
  }
};

export const loadFromStorage = (key, fallback) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`${PREFIX}${key}`);
    return stored ? JSON.parse(stored) : fallback;
  }
  return fallback;
};

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});