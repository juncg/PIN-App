// These routes (and their childrens, i.e. "/offers/create/...") can't be accessed without the user being authenticated
export const PROTECTED_ROUTES = ["/offers/create", "/petitions/create", "/profile"];

// Middleware locale cookie info
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "es"];

// Environment variables
export const { BASE_DOMAIN } = process.env;
export const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true" || false;

// Pagination
export const OFFERS_PAGE_SIZE = 5;
export const OFFERS_MAX_POSTS = 50;
export const PETITIONS_PAGE_SIZE = 5;
export const PETITIONS_MAX_POSTS = 50;
