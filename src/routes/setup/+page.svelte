<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import HomeButton from '../HomeButton.svelte';

	// The progress of the Notion page creation process
	let progress = 0;

	// stage 0 is initial; stage 1 is page creation; stage 2 is finished
	let stage = 0;

	const createChunk = async (chunk: number, data: { [key: string]: string } = {}) => {
		const formData = new FormData();
		formData.set('chunk', chunk.toString());

		Object.entries(data).forEach(([key, value]) => {
			formData.set(key, value);
		});

		const response = await fetch('/setup', {
			method: 'POST',
			body: formData
		});
		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'error') {
			// Render error page
			applyAction(result);
		} else if (result.type === 'success') {
			progress += 1;
			return result.data as string[];
		}
	};

	const start = async () => {
		stage = 1;

		const weekIds = [];

		weekIds.push(...((await createChunk(0)) ?? []));
		weekIds.push(...((await createChunk(1)) ?? []));
		weekIds.push(...((await createChunk(2)) ?? []));

		await createChunk(3, { weekIds: JSON.stringify(weekIds) });

		stage = 2;
	};

	$: title = ['Are you ready?', 'Hang on tight!', 'All done!'][stage];
</script>

<h2 class="text-2xl font-semibold mb-8">{title}</h2>

<div class="radial-progress" style:--value={progress * 25}>{progress}/4</div>

{#if stage !== 2}
	<button class="btn btn-wide mt-4" on:click={start} disabled={stage > 0}>Begin</button>
{:else}
	<HomeButton />
{/if}
