<script>
	import '../app.postcss';
	import Footer from './Footer.svelte';
</script>

<svelte:head>
	<title>Life Journal Builder</title>
	<meta
		name="description"
		content="Automate the process of filling in pages for your Life Journal template in Notion"
	/>
</svelte:head>

<div class="display:contents flex flex-col grow shrink-0 justify-center items-center">
	<slot />
</div>

<Footer />

<style>
	:global(body) {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
