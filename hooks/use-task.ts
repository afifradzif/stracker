import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "@/types/task.types";

interface TaskStore {
	tasks: Task[];
	addTask: (tasks: Task) => void;
	setCompleted: (id: string, completed: boolean) => void;
	removeTask: (id: string) => void;
	clearTasks: () => void;
}

export const useTaskStore = create(
	persist<TaskStore>(
		(set, get) => ({
			tasks: [],
			addTask: (task) => set({ tasks: [...get().tasks, task] }),
			setCompleted: (id, completed) => {
				const currentTasks = get().tasks;
				const updatedTasks = currentTasks.map((task) =>
					task.id === id ? { ...task, completed } : task,
				);
				set({ tasks: updatedTasks });
			},
			removeTask: (id) =>
				set({ tasks: get().tasks.filter((task) => task.id !== id) }),
			clearTasks: () => set({ tasks: [] }),
		}),
		{
			name: "task-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
