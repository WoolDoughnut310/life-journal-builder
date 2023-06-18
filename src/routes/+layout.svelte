<script>
	import '../app.postcss';
</script>

<div class="w-full h-full flex flex-col justify-center items-center">
	<slot />
</div>

<style>
	:global(body) {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
