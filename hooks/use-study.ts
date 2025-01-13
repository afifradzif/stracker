import { create } from "zustand";
import {
	createJSONStorage,
	persist,
	type StateStorage,
} from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { TStudy } from "@/types/study.types";

const mmkv = new MMKV({
	id: "study-store",
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

interface StudyPlanStore {
	studyPlans: TStudy[];
	addStudyPlan: (studyPlans: TStudy) => void;
	updateStudyPlan: (id: string, task: TStudy) => void;
	setCompleted: (id: string, completed: boolean) => void;
	removeStudyPlan: (id: string) => void;
	clearStudyPlan: () => void;
}

export const useStudyPlan = create(
	persist<StudyPlanStore>(
		(set, get) => ({
			studyPlans: [],
			addStudyPlan: (task) => set({ studyPlans: [...get().studyPlans, task] }),
			setCompleted: (id, completed) => {
				const currentTasks = get().studyPlans;
				const updatedTasks = currentTasks.map((task) =>
					task.id === id
						? { ...task, completed, progress: !completed ? 0 : 100 }
						: task,
				);
				set({ studyPlans: updatedTasks });
			},
			updateStudyPlan: (id, task) => {
				const currentTasks = get().studyPlans;
				const updatedTasks = currentTasks.map((t) => (t.id === id ? task : t));
				set({ studyPlans: updatedTasks });
			},
			removeStudyPlan: (id) =>
				set({ studyPlans: get().studyPlans.filter((task) => task.id !== id) }),
			clearStudyPlan: () => set({ studyPlans: [] }),
		}),
		{
			name: "task-store",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);
