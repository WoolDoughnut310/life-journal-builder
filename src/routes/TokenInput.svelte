<script lang="ts">
	let text = '';
</script>

<form method="POST" class="form-control w-full max-w-xs">
	<label class="label">
		<span class="label-text">Enter integration token</span>
		<a
			class="label-text-alt"
			href="https://www.notion.so/help/create-integrations-with-the-notion-api#create-an-internal-integration"
			>But, from where?</a
		>
	</label>
	<input
		type="text"
		name="token"
		class="input input-bordered input-primary w-full max-w-xs"
		bind:value={text}
		required
	/>

	{#if text.length > 0}
		<button class="btn btn-secondary mt-4">Connect workspace</button>
	{/if}
</form>
