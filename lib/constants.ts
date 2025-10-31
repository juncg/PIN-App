// These routes (and their childrens, i.e. "/offers/create/...") can't be accessed without the user being authenticated
export const PROTECTED_ROUTES = ["/offers/create", "/petitions/create", "/profile"];

// Middleware locale cookie info
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "es"];
