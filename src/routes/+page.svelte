<script>
	import { onMount } from 'svelte';
	import removeLine from '../lib/text.js';
	import capitalize from '../lib/capizalize.js';
	const visibleLimit = 100;

	let icons = [];
	let visibleIcons = [];
	let searchQuery = '';
	let filled = false;
	let weight = 400;

	const iconsUrl = 'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true';
	const proxiedUrl = 'https://s.bnyro.ga/proxy?url=' + encodeURIComponent(iconsUrl);

	const rewriteName = (icon) => {
		return capitalize(icon.name.replaceAll('_', ' '));
	};

	const updateIcons = (i) => {
		let props = '';
		if (weight != 400) props += 'wght' + weight;
		if (filled) props += 'fill1';
		if (!props) props = 'default';
		i.forEach((icon) => {
			icon.url = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${icon.name}/${props}/${icon['sizes_px'][0]}px.svg`;
		});
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
			<input type="checkbox" bind:checked={filled} on:change={() => updateIcons(visibleIcons)} />
			<span class="checkmark" />
		</label>
		<input
			class="slider"
			type="range"
			min="100"
			max="700"
			step="100"
			bind:value={weight}
			on:change={() => updateIcons(visibleIcons)}
		/>
		<input bind:value={searchQuery} on:keyup={onQueryChanged} type="text" placeholder="Search" />
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
	}

	#filters {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	input[type='text'] {
		margin: 1rem 0;
		padding: 1rem;
		width: 30%;
		border-radius: 1rem;
		background-color: var(--surface);
		border: none;
		outline: none;
		color: var(--text);
	}

	input[type='range'] {
		border-radius: 1rem;
		-webkit-appearance: none;
		appearance: none;
		padding: 0.7rem;
		background: var(--surface);
		outline: none;
		opacity: 0.7;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
	}

	input[type='range']:hover {
		opacity: 1;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb,
	input[type='range']::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		padding: 0.2rem;
		background: var(--accent);
		border-radius: 1rem;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding-left: 35px;
		cursor: pointer;
		font-size: 22px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.container input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		margin-top: 6px;
		position: absolute;
		top: 0;
		left: 0;
		height: 20px;
		width: 20px;
		background-color: var(--surface);
	}

	.container:hover input:not(:checked) ~ .checkmark {
		filter: brightness(1.2);
	}

	.container input:checked ~ .checkmark {
		background-color: var(--accent);
	}

	.checkmark:after {
		content: '';
		position: absolute;
		display: none;
	}

	.container input:checked ~ .checkmark:after {
		display: block;
	}

	.container .checkmark:after {
		left: 7px;
		top: 3px;
		width: 4px;
		height: 9px;
		border: solid var(--base);
		border-width: 0 3px 3px 0;
		transform: rotate(45deg);
	}

	#filters > * {
		margin-left: 1rem;
		margin-right: 1rem;
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
