<script>
	import { onMount } from 'svelte';
	import removeLine from '../lib/text.js';
	import capitalize from '../lib/capizalize.js';
	const visibleLimit = 100;

	export let searchQuery = '';

	let icons = [];
	let categories = ['All'];
	let visibleIcons = [];
	let filled = false;
	let weight = 400;
	let category = 'All';

	const iconsUrl = 'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true';
	const proxiedUrl = 'https://s.bnyro.ga/proxy?url=' + encodeURIComponent(iconsUrl);

	const rewriteName = (icon) => {
		return capitalize(icon.name.replaceAll('_', ' '));
	};

	const updateIcons = () => {
		let filteredIcons = icons;
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filteredIcons = filteredIcons.filter((icon) => {
				return (
					rewriteName(icon).toLowerCase().includes(query) ||
					icon.tags.some((tag) => tag.includes(query))
				);
			});
		}
		let props = '';
		if (weight != 400) props += 'wght' + weight;
		if (filled) props += 'fill1';
		if (!props) props = 'default';
		filteredIcons.forEach((icon) => {
			icon.url = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${icon.name}/${props}/${icon['sizes_px'][0]}px.svg`;
		});
		if (category !== 'All')
			filteredIcons = filteredIcons.filter((icon) => icon.categories.includes(category));
		visibleIcons = filteredIcons.sort((a, b) => a.popularity < b.popularity).slice(0, visibleLimit);
	};

	const updateCategories = () => {
		icons.forEach((icon) => {
			icon.categories.forEach((category) => {
				if (!categories.includes(category)) categories.push(category);
			});
		});
		categories.sort((a, b) => capitalize(a) > capitalize(b));
		categories = categories;
	};

	const fetchIcons = async () => {
		const response = await fetch(proxiedUrl);
		const text = await response.text();
		const json = removeLine(text, 0);
		icons = JSON.parse(json).icons;
		updateIcons(icons);
		updateCategories();
	};

	const download = (icon) => {
		fetch(icon.url)
			.then((resp) => resp.blob())
			.then((blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = `${icon.name}.svg`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.catch(() => alert('Download failed!'));
	};

	onMount(() => {
		fetchIcons();
	});
</script>

<section>
	<div id="filters">
		<label class="container"
			>Filled
			<input type="checkbox" bind:checked={filled} on:change={updateIcons} />
			<span class="checkmark" />
		</label>
		<input
			class="slider"
			type="range"
			min="100"
			max="700"
			step="100"
			bind:value={weight}
			on:change={updateIcons}
		/>
		<select bind:value={category} on:change={updateIcons}>
			{#each categories as category}
				<option value={category}>{capitalize(category)}</option>
			{/each}
		</select>
		<input bind:value={searchQuery} on:keyup={updateIcons} type="text" placeholder="Search" />
	</div>
	<div id="icons">
		{#each visibleIcons as icon}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span on:click={download(icon)}>
				<img src={icon.url} alt="" />
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
		max-width: min(90rem, calc(100% - 3rem));
		margin: 0 auto;
	}

	#filters {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 0 1.5rem;
	}

	#filters input[type='text'] {
		flex-grow: 1;
	}

	#filters > * {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
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
