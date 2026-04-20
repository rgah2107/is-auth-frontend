export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No fue posible leer la imagen.'));
    reader.onload = () => {
      const res = reader.result;
      if (typeof res !== 'string') return reject(new Error('Formato de imagen no válido.'));
      // result is a data URL: data:image/png;base64,....
      const comma = res.indexOf(',');
      if (comma === -1) return resolve(res);
      resolve(res.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}

export function base64ToDataUrl(base64) {
  if (!base64) return '';
  // We don't always know mime type; default to png.
  return `data:image/png;base64,${base64}`;
}

