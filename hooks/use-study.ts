import { useState, useEffect } from "react";
import { StudyPlan } from "@/lib/graphql/types";
import * as studyAPI from "@/lib/graphql/study";

export const useStudyPlan = () => {
	const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

	useEffect(() => {
		loadStudyPlans();
	}, []);

	const loadStudyPlans = async () => {
		try {
			const plans = await studyAPI.getStudyPlans();
			setStudyPlans(plans);
		} catch (error) {
			console.error("Error loading study plans:", error);
		}
	};

	const addStudyPlan = async (plan: Omit<StudyPlan, "user_id" | "created_at">) => {
		try {
			const newPlan = await studyAPI.addStudyPlan(plan);
			setStudyPlans([...studyPlans, newPlan]);
		} catch (error) {
			console.error("Error adding study plan:", error);
		}
	};

	const setCompleted = async (id: string, completed: boolean) => {
		try {
			await studyAPI.updateStudyPlan(id, completed);
			setStudyPlans(
				studyPlans.map((plan) =>
					plan.id === id ? { ...plan, completed } : plan,
				),
			);
		} catch (error) {
			console.error("Error updating study plan:", error);
		}
	};

	const removeStudyPlan = async (id: string) => {
		try {
			await studyAPI.deleteStudyPlan(id);
			setStudyPlans(studyPlans.filter((plan) => plan.id !== id));
		} catch (error) {
			console.error("Error removing study plan:", error);
		}
	};

	return { studyPlans, addStudyPlan, setCompleted, removeStudyPlan };
};
