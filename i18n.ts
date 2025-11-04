import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
	locale: locale || "en",
	messages: (await import(`./translations/${locale || "en"}.json`)).default,
}));
