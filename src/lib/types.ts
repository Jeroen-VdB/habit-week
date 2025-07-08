export interface Habit {
	id: string;
	name: string;
	description?: string;
	color: string;
	day: string;
	timeSlot: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface WeekData {
	habits: Habit[];
	lastSynced?: Date;
}
