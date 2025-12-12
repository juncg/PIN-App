import type { Preview } from "@storybook/nextjs-vite";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import "../app/globals.css";
import 'sonner/dist/styles.css';

const funnelSans = Funnel_Sans({
	variable: "--font-funnel-sans",
	display: "swap",
	subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
	variable: "--font-funnel-display",
	display: "swap",
	subsets: ["latin"],
});

const preview: Preview = {
    parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
            options: {
                dark: {
					name: "dark",
					value: "#121212",
				}
            }
        },
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
	},

    decorators: [
		(Story) => (
			<div className={`${funnelSans.variable} ${funnelDisplay.variable} font-funnel-sans antialiased text-white`}>
				<Story />
			</div>
		),
	],

    initialGlobals: {
        backgrounds: {
            value: "dark"
        }
    }
};

export default preview;
