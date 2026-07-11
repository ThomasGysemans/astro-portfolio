import { vitePreprocess } from '@astrojs/svelte';

export default {
	preprocess: vitePreprocess(),
	warningFilter: (warning) => {
		if (warning.code === 'element_invalid_self_closing_tag') return false;
		return true;
	}
}
