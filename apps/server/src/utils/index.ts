export const isValidUrl = (url: string) => {
  const acceptedProtocols = ['http:', 'https:'];
  try {
    const theUrl = new URL(url);

    // Must have valid protocol
    if (!acceptedProtocols.includes(theUrl.protocol)) {
      return false;
    }

    // Must have a hostname
    if (!theUrl.hostname) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}