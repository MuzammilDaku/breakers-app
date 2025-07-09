let lastFailedTime: number | null = null;
let lastSuccessTime: number | null = null;

export const isInternetConnected = async (options: {
  timeout?: number;
  minFailureDelay?: number;
  checkEndpoint?: string;
} = {}): Promise<boolean> => {
  const {
    timeout = 10000, // 10s default timeout
    minFailureDelay = 60000, // 60s default cooldown after failure
    checkEndpoint = 'https://example.com'
  } = options;

  const now = Date.now();


  // If last failed within cooldown period, skip check
  if (lastFailedTime && now - lastFailedTime < minFailureDelay) {
    return false;
  }

  // If we recently had a successful check, return cached success
  if (lastSuccessTime && now - lastSuccessTime < 10000) {
    return true;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(checkEndpoint, {
      method: 'GET',
      cache: 'no-store', // More aggressive than 'no-cache'
      signal: controller.signal,
      credentials: 'omit', // Don't send cookies
      referrerPolicy: 'no-referrer' // Don't send referrer
    });

    if ((response.status === 204 || response.status === 200) && response.ok) {
      lastSuccessTime = now;
      lastFailedTime = null;
      return true;
    }

    // Treat non-204 or non-ok responses as failure
    lastFailedTime = now;
    return false;

  } catch (error) {
    console.log("error", error)

    lastFailedTime = now;
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};