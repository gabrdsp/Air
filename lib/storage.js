// lib/storage.js
const PREFIX = 'air_db_';

export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;

  try {
    const payload = JSON.stringify(data);
    localStorage.setItem(`${PREFIX}${key}`, payload);
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
};

export const loadFromStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = localStorage.getItem(`${PREFIX}${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch (err) {
    console.error('Erro ao ler do localStorage:', err);
    return fallback;
  }
};

/**
 * Converte um arquivo em Base64.
 * maxSizeMB é opcional. Se informado, limita o tamanho do arquivo.
 */
export const fileToBase64 = (file, maxSizeMB) =>
  new Promise((resolve, reject) => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return reject(
        new Error(
          `Arquivo muito grande. Limite de aproximadamente ${maxSizeMB} MB para upload.`
        )
      );
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
