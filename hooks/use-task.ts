import { create } from "zustand";
import {
	createJSONStorage,
	persist,
	type StateStorage,
} from "zustand/middleware";
import type { TTask } from "@/types/task.types";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV({
	id: "task-store",
});

const mmkvStorage: StateStorage = {
	setItem: (name, value) => {
		return mmkv.set(name, value);
	},
	getItem: (name) => {
		const value = mmkv.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return mmkv.delete(name);
	},
};

interface TaskStore {
	tasks: TTask[];
	addTask: (tasks: TTask) => void;
	updateTask: (id: string, task: TTask) => void;
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
			updateTask: (id, task) => {
				const currentTasks = get().tasks;
				const updatedTasks = currentTasks.map((t) => (t.id === id ? task : t));
				set({ tasks: updatedTasks });
			},
			removeTask: (id) =>
				set({ tasks: get().tasks.filter((task) => task.id !== id) }),
			clearTasks: () => set({ tasks: [] }),
		}),
		{
			name: "task-store",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);
