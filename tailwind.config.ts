import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./stories/**/*.{js,ts,jsx,tsx,mdx}",
		"./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
	],

	theme: {
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},

				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},

				"border-spin": {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" },
				},
			},

			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"border-spin": "border-spin 10s linear infinite",
			},

			fontFamily: {
				"funnel-sans": "var(--font-funnel-sans)",
				"funnel-display": "var(--font-funnel-display)",
			},

			colors: {
				/* DESIGN COLORS */
				black: "var(--black)",
				white: "var(--white)",
				chernobyl: "var(--chernobyl)",
				darkmode: "var(--darkmode)",
				hover: "var(--hover)",
				cardborder: "var(--cardborder)",
				placeholder: "var(--placeholder)",
				darkgrey: "var(--darkgrey)",
				lightgrey: "var(--lightgrey)",

				/* ADDITIONAL COLORS */
				destructive: "var(--destructive)",
			},

			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},

			backgroundImage: {
				"chernobyl-to-white": "var(--chernobyl-to-white)",
			},
		},
	},

	plugins: [animate],
} satisfies Config;
