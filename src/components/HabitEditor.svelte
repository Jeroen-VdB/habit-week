<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Dialog, Content } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import type { Habit } from '$lib/types';

	export let open = false;
	export let habit: Habit | null = null;

	const dispatch = createEventDispatcher();

	const colors = [
		{ name: 'Blue', value: '#3B82F6' },
		{ name: 'Green', value: '#10B981' },
		{ name: 'Purple', value: '#8B5CF6' },
		{ name: 'Pink', value: '#EC4899' },
		{ name: 'Orange', value: '#F97316' },
		{ name: 'Red', value: '#EF4444' },
		{ name: 'Yellow', value: '#F59E0B' },
		{ name: 'Teal', value: '#14B8A6' },
	];

	let formData = {
		name: '',
		description: '',
		color: colors[0].value,
	};

	$: if (habit) {
		formData = {
			name: habit.name,
			description: habit.description || '',
			color: habit.color,
		};
	} else {
		formData = {
			name: '',
			description: '',
			color: colors[0].value,
		};
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		const habitData: Habit = {
			id: habit?.id || crypto.randomUUID(),
			...formData,
			day: habit?.day || '',
			timeSlot: habit?.timeSlot || '',
			createdAt: habit?.createdAt || new Date(),
			updatedAt: new Date(),
		};

		dispatch('save', habitData);
	}

	function handleDelete() {
		if (habit && confirm('Are you sure you want to delete this habit?')) {
			dispatch('delete', habit.id);
		}
	}
</script>

<Dialog bind:open>
	<Content class="sm:max-w-[425px]">
		<div class="mb-4">
			<h2 class="text-lg font-semibold">
				{habit ? 'Edit Habit' : 'Add New Habit'}
			</h2>
		</div>

		<form on:submit={handleSubmit} class="space-y-4">
			<div>
				<label for="name" class="mb-1 block text-sm font-medium"> Habit Name </label>
				<input
					id="name"
					type="text"
					bind:value={formData.name}
					class="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
					placeholder="e.g., Morning Meditation"
					required
				/>
			</div>

			<div>
				<label for="description" class="mb-1 block text-sm font-medium">
					Description (optional)
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					class="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
					placeholder="Add any notes or details..."
					rows="3"
				/>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium"> Color </label>
				<div class="grid grid-cols-4 gap-2">
					{#each colors as color}
						<button
							type="button"
							class="h-10 rounded-md border-2 transition-all {formData.color === color.value
								? 'border-foreground scale-110'
								: 'border-transparent'}"
							style="background-color: {color.value}"
							on:click={() => (formData.color = color.value)}
							title={color.name}
						/>
					{/each}
				</div>
			</div>

			<div class="flex justify-between pt-4">
				{#if habit}
					<Button type="button" variant="destructive" on:click={handleDelete}>Delete</Button>
				{:else}
					<div />
				{/if}

				<div class="space-x-2">
					<Button type="button" variant="outline" on:click={() => (open = false)}>Cancel</Button>
					<Button type="submit">
						{habit ? 'Save Changes' : 'Add Habit'}
					</Button>
				</div>
			</div>
		</form>
	</Content>
</Dialog>
