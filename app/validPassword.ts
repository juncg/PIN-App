export function isPasswordValid(password: string): boolean {
  // Regex explanation:
  // (?=.*[A-Z])   -> at least one uppercase letter
  // (?=.*\d)      -> at least one digit
  // (?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]) -> at least one symbol
  const complexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

  return complexityRegex.test(password);
}
