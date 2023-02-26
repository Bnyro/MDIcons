<script>
	import { onMount } from 'svelte';
	import removeLine from '../lib/text.js';
	import capitalize from '../lib/capizalize.js';
	const visibleLimit = 100;

	let icons = [];
	let visibleIcons = [];
	let searchQuery = '';

	const iconsUrl = 'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true';
	const proxiedUrl = 'https://s.bnyro.ga/proxy?url=' + encodeURIComponent(iconsUrl);

	const rewriteName = (icon) => {
		return capitalize(icon.name.replaceAll('_', ' '));
	};

	const updateIcons = (i) => {
		visibleIcons = i.sort((a, b) => a.popularity < b.popularity).slice(0, visibleLimit);
	};

	const fetchIcons = async () => {
		const response = await fetch(proxiedUrl);
		const text = await response.text();
		const json = removeLine(text, 0);
		icons = JSON.parse(json).icons;
		updateIcons(icons);
	};

	const onQueryChanged = () => {
		if (!searchQuery) {
			updateIcons(icons);
			return;
		}
		const query = searchQuery.toLowerCase();
		const filteredIcons = icons.filter((icon) => {
			return (
				rewriteName(icon).toLowerCase().includes(query) ||
				icon.tags.some((tag) => tag.includes(query))
			);
		});
		updateIcons(filteredIcons);
	};

	onMount(() => {
		fetchIcons();
	});
</script>

<section>
	<input bind:value={searchQuery} on:keyup={onQueryChanged} type="text" placeholder="Search" />
	<div id="icons">
		{#each visibleIcons as icon}
			<span>
				<img
					src="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/{icon.name}/default/{icon[
						'sizes_px'
					][0]}px.svg"
					alt=""
				/>
				<p>{rewriteName(icon)}</p>
			</span>
		{/each}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	input {
		margin: 1rem 0;
		padding: 1rem;
		width: 30%;
		border-radius: 1rem;
		background-color: var(--surface);
		border: none;
		outline: none;
		color: var(--text);
	}

	#icons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	#icons span {
		padding: 1rem;
		margin: 0.5rem;
		width: 8rem;
		background-color: var(--surface);
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	#icons span:hover {
		filter: brightness(1.2);
	}

	#icons img {
		height: auto;
		width: 5rem;
		filter: var(--filter);
	}

	#icons p {
		text-align: center;
	}
</style>
