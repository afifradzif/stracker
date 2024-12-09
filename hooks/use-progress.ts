import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TProgress } from "@/types/progress.types";

interface ProgressStore {
	progress: TProgress[];
	addProgress: (progress: TProgress) => void;
	updateProgress: (id: string, progress: number) => void;
	removeProgress: (id: string) => void;
	clearProgress: () => void;
}

export const useProgressStore = create(
	persist<ProgressStore>(
		(set, get) => ({
			progress: [],
			addProgress: (task) => set({ progress: [...get().progress, task] }),
			updateProgress: (id, progress) => {
				const currentProgress = get().progress;
				const updatedProgress = currentProgress.map((task) =>
					task.id === id ? { ...task, progress } : task,
				);
				set({ progress: updatedProgress });
			},
			removeProgress: (id) =>
				set({ progress: get().progress.filter((task) => task.id !== id) }),
			clearProgress: () => set({ progress: [] }),
		}),
		{
			name: "task-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
