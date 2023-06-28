export function isValidUrl(url: string) {
  try {
    new URL(url);
  } catch (_) {
    return false;
  }
  return true;
}

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function checkPasswordStrength(password: string) {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password);
}