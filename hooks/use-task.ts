import { useState, useEffect } from "react";
import { Task } from "@/lib/graphql/types";
import * as taskAPI from "@/lib/graphql/task";
import { useAuthStore } from "./use-auth";
import { schedulePushNotification, calculateReminderDate } from '@/utils/notifications';

export const useTaskStore = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const { auth } = useAuthStore();

	useEffect(() => {
		console.log("auth.isLoggedIn",auth.isLoggedIn)
		if (auth.isLoggedIn) {
			loadTasks();
		}
	}, [auth.isLoggedIn]);

	const loadTasks = async () => {
		try {
			const data = await taskAPI.getTasks();
			setTasks(data);
		} catch (error) {
			console.error("Error loading tasks:", error);
		}
	};

	const addTask = async (task: Omit<Task, "user_id" | "created_at">) => {
		try {
			const newTask = await taskAPI.addTask(task);
			setTasks([...tasks, newTask]);

			// Schedule reminder notification
			if (task.reminder) {
				const reminderDate = calculateReminderDate(task.due, task.reminder);
				await schedulePushNotification({
					title: `Task Reminder: ${task.title}`,
					body: `Your task is ${task.reminder === 'Everyday' ? 'ongoing' : 'due soon'}!`,
					trigger: reminderDate,
				});
			}
		} catch (error) {
			console.error("Error adding task:", error);
		}
	};

	const setCompleted = async (id: string, completed: boolean) => {
		try {
			await taskAPI.updateTaskStatus(id, completed);
			setTasks(
				tasks.map((task) =>
					task.id === id ? { ...task, completed } : task,
				),
			);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};

	const removeTask = async (id: string) => {
		try {
			await taskAPI.deleteTask(id);
			setTasks(tasks.filter((task) => task.id !== id));
		} catch (error) {
			console.error("Error removing task:", error);
		}
	};

	const updateProgress = async (id: string, progress: number) => {
		try {
			await taskAPI.updateTaskProgress(id, progress);
			setTasks(
				tasks.map((task) =>
					task.id === id ? { ...task, progress } : task,
				),
			);
		} catch (error) {
			console.error("Error updating task progress:", error);
		}
	};

	const updateTask = async (id: string, updates: Partial<Task>) => {
		try {
			await taskAPI.updateTask(id, updates);
			setTasks(
				tasks.map((task) =>
					task.id === id ? { ...task, ...updates } : task,
				),
			);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};

	const removeAllTasks = async () => {
		try {
			await taskAPI.removeAllTasks();
			setTasks([]);
		} catch (error) {
			console.error('Error removing all tasks:', error);
		}
	};

	return {
		tasks,
		addTask,
		setCompleted,
		removeTask,
		updateProgress,
		updateTask,
		removeAllTasks,
		loadTasks,
	};
};
