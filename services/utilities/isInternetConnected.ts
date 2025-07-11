let lastFailedTime: number | null = null;
let lastSuccessTime: number | null = null;

export const isInternetConnected = async (
  options: {
    timeout?: number;
    minFailureDelay?: number;
    checkEndpoint?: string;
  } = {}
): Promise<boolean> => {
  const {
    timeout = 15000,
    minFailureDelay = 10000,
    checkEndpoint = "https://example.com",
  } = options;

  const now = Date.now();

  if (lastFailedTime && now - lastFailedTime < minFailureDelay) {
    return false;
  }

  if (lastSuccessTime && now - lastSuccessTime < 10000) {
    return true;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(checkEndpoint, {
      method: "GET",
      cache: "no-store", 
      signal: controller.signal,
      credentials: "omit",
      referrerPolicy: "no-referrer", 
    });

    if ((response.status === 204 || response.status === 200) && response.ok) {
      lastSuccessTime = now;
      lastFailedTime = null;
      return true;
    }

    lastFailedTime = now;
    return false;
  } catch (error) {
    console.log("error", error);

    lastFailedTime = now;
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};
