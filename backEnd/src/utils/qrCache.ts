const qrMap = new Map<string, { token: string | null; timeout: NodeJS.Timeout }>();

export const createQRSession = (code: string) => {
  if (qrMap.has(code)) return;

  const timeout = setTimeout(() => qrMap.delete(code), 60000); // 60 segundos

  qrMap.set(code, { token: null, timeout });
};

export const linkTokenToQR = (code: string, token: string) => {
  const entry = qrMap.get(code);
  if (!entry) return false;
  entry.token = token;
  return true;
};

export const getTokenForQR = (code: string): string | null => {
  return qrMap.get(code)?.token || null;
};

export const clearQRSession = (code: string) => {
  const entry = qrMap.get(code);
  if (entry) {
    clearTimeout(entry.timeout);
    qrMap.delete(code);
  }
};
