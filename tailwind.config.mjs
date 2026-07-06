const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,svelte,ts,js}'],
	theme: {
		extend: {
			colors: {
				// Theme tokens driven by the CSS variables declared in tailwind.scss.
				// Dark values by default, light values under html[data-theme="light"].
				// Named "page" (not "base") so that `text-base` keeps its
				// font-size meaning instead of resolving to a color.
				page: 'var(--bg)',
				heading: 'var(--heading)',
				text: 'var(--text)',
				body: 'var(--body)',
				muted: 'var(--muted)',
				faint: 'var(--faint)',
				card: 'var(--card)',
				'card-solid': 'var(--card-solid)',
				edge: 'var(--edge)',
				'edge-strong': 'var(--edge-strong)',
				accent: 'var(--accent)',
				'accent-heading': 'var(--accent-heading)',
				btn: 'var(--btn-bg)',
				'btn-text': 'var(--btn-text)',
				chip: 'var(--chip)',
				'chip-text': 'var(--chip-text)',
				outline: 'var(--outline-bd)',
				avail: 'var(--avail-c)',
				'avail-bg': 'var(--avail-bg)',
				'avail-bd': 'var(--avail-bd)',
				// Fixed colors (identical in both themes).
				night: '#030F20',
				'accent-strong': '#619cf3',
				malt: '#FC5757',
			},
			boxShadow: {
				glow: 'var(--glow)',
				'btn-glow': 'var(--btn-glow)',
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
