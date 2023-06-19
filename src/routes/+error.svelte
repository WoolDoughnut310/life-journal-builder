<script>
	import { page } from '$app/stores';
	import HomeButton from './HomeButton.svelte';
</script>

<h1 class="text-2xl font-bold">{$page.status}</h1>
<p>{$page.error.message}</p>
<HomeButton />
