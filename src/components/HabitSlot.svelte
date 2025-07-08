<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Plus } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import HabitEditor from "./HabitEditor.svelte";
	import type { Habit } from "$lib/types";
	import { trackEvent, ANALYTICS_EVENTS } from "$lib/analytics";
	
	export let day: string;
	export let timeSlot: string;
	export let habits: Habit[] = [];
	
	let isEditorOpen = false;
	let editingHabit: Habit | null = null;
	
	function openEditor(habit?: Habit) {
		editingHabit = habit || null;
		isEditorOpen = true;
	}
	
	function closeEditor() {
		isEditorOpen = false;
		editingHabit = null;
	}
	
	function handleSave(event: CustomEvent<Habit>) {
		const habit = event.detail;
		let newHabits: Habit[];
		
		if (editingHabit) {
			// Update existing habit
			newHabits = habits.map(h => h.id === habit.id ? habit : h);
			trackEvent(ANALYTICS_EVENTS.HABIT_EDITED, { day, timeSlot });
		} else {
			// Add new habit
			newHabits = [...habits, { ...habit, day, timeSlot }];
			trackEvent(ANALYTICS_EVENTS.HABIT_ADDED, { day, timeSlot, color: habit.color });
		}
		
		habits = newHabits;
		dispatch('update', newHabits);
		closeEditor();
	}
	
	function handleDelete(habitId: string) {
		const newHabits = habits.filter(h => h.id !== habitId);
		habits = newHabits;
		dispatch('update', newHabits);
		trackEvent(ANALYTICS_EVENTS.HABIT_DELETED, { day, timeSlot });
		closeEditor();
	}
	
	const dispatch = createEventDispatcher();
</script>

<div class="h-full w-full">
	{#if habits.length === 0}
		<Button
			variant="ghost"
			size="sm"
			class="w-full h-full justify-center opacity-60 hover:opacity-100"
			on:click={() => openEditor()}
		>
			<Plus class="h-4 w-4" />
			Add Habit
		</Button>
	{:else}
		<div class="space-y-1">
			{#each habits as habit}
				<button
					class="w-full text-left p-2 rounded text-sm hover:bg-accent transition-colors"
					style="background-color: {habit.color}20; border-left: 3px solid {habit.color}"
					on:click={() => openEditor(habit)}
				>
					<div class="font-medium">{habit.name}</div>
					{#if habit.description}
						<div class="text-xs text-muted-foreground">{habit.description}</div>
					{/if}
				</button>
			{/each}
			<Button
				variant="ghost"
				size="sm"
				class="w-full"
				on:click={() => openEditor()}
			>
				<Plus class="h-3 w-3 mr-1" />
				Add
			</Button>
		</div>
	{/if}
</div>

<HabitEditor
	bind:open={isEditorOpen}
	habit={editingHabit}
	on:save={handleSave}
	on:delete={(e) => handleDelete(e.detail)}
/>