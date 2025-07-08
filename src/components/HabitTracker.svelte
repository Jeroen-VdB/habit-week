<script lang="ts">
	import { onMount } from "svelte";
	import HabitSlot from "./HabitSlot.svelte";
	import type { Habit } from "$lib/types";
	import { habitStore } from "$lib/stores/habits";
	
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const timeSlots = ['Morning', 'Afternoon', 'Evening'];
	
	let habits: Record<string, Habit[]> = {};
	
	onMount(() => {
		// Load habits from localStorage
		habitStore.loadFromStorage();
		
		// Subscribe to habit store
		const unsubscribe = habitStore.subscribe(value => {
			habits = value;
		});
		
		return unsubscribe;
	});
	
	function getHabitsForSlot(day: string, timeSlot: string): Habit[] {
		const key = `${day.toLowerCase()}-${timeSlot.toLowerCase()}`;
		return habits[key] || [];
	}
</script>

<div class="w-full max-w-7xl mx-auto p-4">
	<h1 class="text-3xl font-bold mb-6 text-center">Weekly Habit Tracker</h1>
	
	<div class="grid grid-cols-8 gap-2">
		<!-- Time column header -->
		<div class="font-medium text-sm text-muted-foreground"></div>
		
		<!-- Day headers -->
		{#each days as day}
			<div class="text-center font-semibold text-sm p-2 border-b">
				{day}
			</div>
		{/each}
		
		<!-- Time slots -->
		{#each timeSlots as timeSlot}
			<div class="text-right pr-2 font-medium text-sm text-muted-foreground py-4">
				{timeSlot}
			</div>
			{#each days as day}
				<div class="border rounded-lg p-2 min-h-[100px] bg-card hover:bg-accent/50 transition-colors">
					<HabitSlot
						day={day.toLowerCase()}
						timeSlot={timeSlot.toLowerCase()}
						habits={getHabitsForSlot(day, timeSlot)}
						on:update={(e) => habitStore.updateSlot(`${day.toLowerCase()}-${timeSlot.toLowerCase()}`, e.detail)}
					/>
				</div>
			{/each}
		{/each}
	</div>
</div>