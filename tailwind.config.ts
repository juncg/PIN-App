import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
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
			},

			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},

			fontFamily: {
				"funnel-sans": "var(--font-funnel-sans)",
				"funnel-display": "var(--font-funnel-display)",
			},

			colors: {
				/* DESIGN COLORS */
				black: "rgb(var(--black))",
				white: "rgb(var(--white))",
				chernobyl: "rgb(var(--chernobyl))",
				darkmode: "rgb(var(--darkmode))",
				hover: "rgb(var(--hover))",
				cardborder: "rgb(var(--cardborder))",
				placeholder: "rgb(var(--placeholder))",
				darkgrey: "rgb(var(--darkgrey))",
				lightgrey: "rgb(var(--lightgrey))",

				/* ADDITIONAL COLORS */
				destructive: "rgb(var(--destructive))",
				muted: "rgb(var(--muted))",
			},

			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},

	plugins: [animate],
} satisfies Config;
