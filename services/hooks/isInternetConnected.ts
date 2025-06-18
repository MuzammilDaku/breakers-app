export const isInternetConnected = async (): Promise<boolean> => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort(); 
  }, 10000);

  try {
    const response = await fetch('https://clients3.google.com/generate_204', {
      method: 'GET',
      cache: 'no-cache',
      signal: controller.signal,
    });
    return response.status === 204;
  } catch (error) {
    return false;
  } finally {
    clearTimeout(timeout); // cleanup timer
  }
};
