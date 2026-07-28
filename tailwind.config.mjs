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
				'btn-glow': 'var(--btn-glow)',
			},
			fontFamily: {
				// Body face: everything that is read rather than glanced at.
				sans: ['"Source Sans 3"', ...defaultTheme.fontFamily.sans],
				// Display face: headings, the logo wordmark and the stat numbers.
				display: ['"Comfortaa"', ...defaultTheme.fontFamily.sans],
			},
		},
		// Type scale, overriding Tailwind's defaults so that `text-xs` is a
		// real floor (13px) instead of 12px, and there is a continuous ramp
		// between body copy and headings. Sizes below `xs` are deliberately
		// unavailable: the previous design had 22 distinct hardcoded sizes,
		// 10px included, with nothing at all between 13px and 34px.
		fontSize: {
			xs: ['0.8125rem', { lineHeight: '1.5' }],    // 13px — meta, chips, captions, badges
			sm: ['0.9375rem', { lineHeight: '1.6' }],    // 15px — dense card copy, secondary text
			base: ['1rem', { lineHeight: '1.7' }],       // 16px — body copy
			lg: ['1.125rem', { lineHeight: '1.5' }],     // 18px — card titles, lead-in
			xl: ['1.3125rem', { lineHeight: '1.4' }],    // 21px — minor headings
			'2xl': ['1.625rem', { lineHeight: '1.3' }],  // 26px — section headings
			'3xl': ['2.125rem', { lineHeight: '1.2' }],  // 34px — page titles
		},
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant('hocus', ['&:hover', '&:focus']);
		})
	],
}
