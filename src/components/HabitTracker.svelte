<script lang="ts">
	import { onMount } from 'svelte';
	import HabitSlot from './HabitSlot.svelte';
	import type { Habit } from '$lib/types';
	import { habitStore } from '$lib/stores/habits';

	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const timeSlots = ['Morning', 'Afternoon', 'Evening'];

	let habits: Record<string, Habit[]> = {};

	onMount(() => {
		// Load habits from localStorage
		habitStore.loadFromStorage();

		// Subscribe to habit store
		const unsubscribe = habitStore.subscribe((value) => {
			habits = value;
		});

		return unsubscribe;
	});

	function getHabitsForSlot(day: string, timeSlot: string): Habit[] {
		const key = `${day.toLowerCase()}-${timeSlot.toLowerCase()}`;
		return habits[key] || [];
	}
</script>

<div class="mx-auto w-full max-w-7xl p-4">
	<h1 class="mb-6 text-center text-3xl font-bold">Weekly Habit Tracker</h1>

	<div class="grid grid-cols-8 gap-2">
		<!-- Time column header -->
		<div class="text-muted-foreground text-sm font-medium"></div>

		<!-- Day headers -->
		{#each days as day}
			<div class="border-b p-2 text-center text-sm font-semibold">
				{day}
			</div>
		{/each}

		<!-- Time slots -->
		{#each timeSlots as timeSlot}
			<div class="text-muted-foreground py-4 pr-2 text-right text-sm font-medium">
				{timeSlot}
			</div>
			{#each days as day}
				<div
					class="bg-card hover:bg-accent/50 min-h-[100px] rounded-lg border p-2 transition-colors"
				>
					<HabitSlot
						day={day.toLowerCase()}
						timeSlot={timeSlot.toLowerCase()}
						habits={getHabitsForSlot(day, timeSlot)}
						on:update={(e) =>
							habitStore.updateSlot(`${day.toLowerCase()}-${timeSlot.toLowerCase()}`, e.detail)}
					/>
				</div>
			{/each}
		{/each}
	</div>
</div>
