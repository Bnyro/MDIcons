<script>
	import Icons from '../../components/Icons.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let query;

	onMount(() => {
		const params = new URLSearchParams(location.search);
		query = params.get('q');
	});
</script>

<Icons searchQuery={query} />
