import { useState, useEffect } from "react";
import { StudyPlan } from "@/lib/graphql/types";
import * as studyAPI from "@/lib/graphql/study";
import { useAuthStore } from "./use-auth";
import { schedulePushNotification, calculateReminderDate, setupDailyMotivation } from '@/utils/notifications';

export const useStudyPlan = () => {
	const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
	const { auth } = useAuthStore();

	useEffect(() => {
		console.log("auth.isLoggedIn use-study",auth.isLoggedIn)
		if (auth.isLoggedIn) {
			loadStudyPlans();
		}
	}, [auth.isLoggedIn]);

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

			// Schedule reminder notification
			if (plan.reminder) {
				const reminderDate = calculateReminderDate(plan.date, plan.reminder);
				await schedulePushNotification({
					title: `Study Plan Reminder: ${plan.title}`,
					body: `Time to study! Your study plan is ${plan.reminder === 'Everyday' ? 'scheduled' : 'coming up'}`,
					trigger: reminderDate,
				});
			}

			// Setup daily motivation if selected
			if (plan.daily_motivation) {
				await setupDailyMotivation(plan.daily_motivation, plan.title);
			}
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

	const removeAllStudyPlans = async () => {
		try {
			await studyAPI.removeAllStudyPlans();
			setStudyPlans([]);
		} catch (error) {
			console.error("Error removing all study plans:", error);
		}
	};

	return {
		studyPlans,
		addStudyPlan,
		setCompleted,
		removeStudyPlan,
		removeAllStudyPlans,
		loadStudyPlans,
	};
};
