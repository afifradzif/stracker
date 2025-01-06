import { useTaskStore } from "@/hooks/use-task";
import Toast from "react-native-root-toast";
import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	StyleSheet,
} from "react-native";
import Dropdown from "@/components/dropdown";
import { createId } from "@paralleldrive/cuid2";
import type { TTask } from "@/types/task.types";

const reminderOptions = [
	{ label: "Everyday", value: "Everyday" },
	{ label: "1 day before", value: "1 day before" },
	{ label: "1 week before", value: "1 week before" },
];

export default function AddTaskScreen() {
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
	const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

	const [taskState, setTaskState] = useState<TTask>({
		id: "",
		title: "",
		due: new Date(),
		reminder: "",
		completed: false,
		progress: 0,
	});

	const { addTask: setTasks } = useTaskStore();

	const router = useRouter();

	const onChangeDate = (
		event: DateTimePickerEvent,
		selectedDate: Date | undefined,
	) => {
		setTaskState({ ...taskState, due: selectedDate || new Date() });
		setShowDatePicker(false);
		setShowTimePicker(!showTimePicker);
	};

	const onSubmit = useCallback(() => {
		if (!taskState.title || !taskState.reminder) {
			Toast.show("Please fill all the input", {
				containerStyle: {
					backgroundColor: "#ff0000",
					width: "100%",
				},
				shadow: false,
				duration: Toast.durations.LONG,
				// position: Toast.positions.TOP,
			});

			return;
		}
		if (taskState.due <= new Date()) {
			Toast.show("Please select a future date", {
				containerStyle: {
					backgroundColor: "#ff0000",
					width: "100%",
				},
				shadow: false,
				duration: Toast.durations.LONG,
				// position: Toast.positions.TOP,
			});
			return;
		}

		const cuid = createId();

		setTasks({
			id: cuid,
			title: taskState.title,
			due: taskState.due,
			reminder: taskState.reminder,
			completed: false,
			progress: 0,
		});

		setTaskState({
			id: "",
			title: "",
			due: new Date(),
			reminder: "",
			completed: false,
			progress: 0,
		});

		router.navigate("/(tabs)/tasks");
	}, [taskState, setTasks, router]);

	return (
		<View style={styles.backdrop}>
			<Stack.Screen
				options={{
					title: "Add Task",
					headerShown: true,
					// headerBackTitle: "Back",
					headerBackButtonDisplayMode: "minimal",
				}}
			/>
			<View
				style={{
					width: "100%",
					flex: 1,
				}}
			>
				<Text style={styles.label}>Task Name</Text>
				<TextInput
					style={{
						height: 40,
						borderColor: "gray",
						borderWidth: 1,
						borderRadius: 8,
						padding: 8,
						backgroundColor: "#f9f9f9",
					}}
					onChangeText={(text) => setTaskState({ ...taskState, title: text })}
					value={taskState.title}
				/>
				<View
					style={{
						height: 16,
					}}
				/>
				<Text style={styles.label}>Task Due</Text>
				{Platform.OS === "ios" ? (
					<DateTimePicker
						mode="datetime"
						value={taskState.due}
						onChange={onChangeDate}
						accentColor="#7b45a6"
					/>
				) : (
					<>
						<TouchableOpacity
							onPress={() => setShowDatePicker(true)}
							style={{ paddingVertical: 8, paddingHorizontal: 12 }}
						>
							<Text>{moment(taskState.due).format("h:mm A")}</Text>
						</TouchableOpacity>
						{showDatePicker && (
							<DateTimePicker
								mode="date"
								value={taskState.due}
								onChange={onChangeDate}
								accentColor="#7b45a6"
							/>
						)}
						{showTimePicker && (
							<DateTimePicker
								mode="time"
								value={taskState.due}
								onChange={onChangeDate}
								accentColor="#7b45a6"
							/>
						)}
					</>
				)}
				<Text
					style={{
						fontSize: 16,
						color: "#666",
						marginTop: 8,
					}}
				>
					{moment(taskState.due).format("dddd, D MMM YYYY, h:mm A")}
				</Text>
				<View
					style={{
						height: 16,
					}}
				/>
				<Text style={styles.label}>Task Reminder</Text>
				<Dropdown
					data={reminderOptions}
					onChange={(item) =>
						setTaskState({ ...taskState, reminder: item.value })
					}
					placeholder="Select Reminder"
				/>
			</View>
			<TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
				<Text style={styles.submitButtonText}>Add Task</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	label: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 5,
	},
	submitButton: {
		backgroundColor: "#7b45a6",
		padding: 16,
		marginBottom: 16,
		borderRadius: 8,
		alignItems: "center",
		width: "100%",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
