let lastFailedTime: number | null = null;
let lastSuccessTime: number | null = null;

interface InternetCheckOptions {
  timeout?: number;
  minFailureDelay?: number;
  checkEndpoint?: string;
  validStatusCodes?: number[];
}

export const isInternetConnected = async (
  options: InternetCheckOptions = {}
): Promise<boolean> => {
  const {
    timeout = 10000, // ms
    minFailureDelay = 10000, // ms
    checkEndpoint = "https://www.google.com/generate_204", // reliable minimal response
    validStatusCodes = [204, 200],
  } = options;

  const now = Date.now();

  // Avoid repeated checks if recent failure
  if (lastFailedTime && now - lastFailedTime < minFailureDelay) {
    return false;
  }

  // Use cached success if recent
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

    const isValid = response.ok && validStatusCodes.includes(response.status);

    if (isValid) {
      lastSuccessTime = now;
      lastFailedTime = null;
      return true;
    }

    lastFailedTime = now;
    return false;
  } catch (error) {
    console.warn("[isInternetConnected] Connection check failed:", error);
    lastFailedTime = now;
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};
