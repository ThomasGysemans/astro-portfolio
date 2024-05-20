const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					light: '#619cf3',
					DEFAULT: '#062451',
					dark: '#051d41',
					darker: '#030F20'
				},
				secondary: {
					DEFAULT: '#F4F7FB',
				},
			},
			fontFamily: {
				sans: ['"Comfortaa"', ...defaultTheme.fontFamily.sans],
			}
		},
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant('hocus', ['&:hover', '&:focus']);
		})
	],
}
