import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: /\.[jt]sx?$/,
			use: [
				{
					loader: require.resolve("@svgr/webpack"),
					options: {
						// Puedes agregar opciones aquí si lo necesitas
					},
				},
			],
		});
		return config;
	},
};

export default nextConfig;
