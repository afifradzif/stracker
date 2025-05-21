import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from "react-native";
import { useTaskStore } from "@/hooks/use-task";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import CustomBackground from "@/components/CustomBackground";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import CustomButton from "@/components/CustomButton";
import { createId } from "@paralleldrive/cuid2";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";

const reminderOptions = [
	{ label: "Everyday", value: "Everyday" },
	{ label: "1 day before", value: "1 day before" },
	{ label: "1 week before", value: "1 week before" },
];

export default function TaskScreen() {
	const router = useRouter();
	const { tasks, setCompleted, removeTask, addTask } = useTaskStore();
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

	const bottomSheetModalRef = useRef(null);
	const addTaskSheetRef = useRef(null);
	const reminderSheetRef = useRef(null);

	const [newTask, setNewTask] = useState({
		id: createId(),
		title: "",
		due: new Date(),
		reminder: "",
		completed: false,
		progress: 0,
	});

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const handlePresentModal = useCallback((taskId: string) => {
		setSelectedTaskId(taskId);
		bottomSheetModalRef.current?.present();
	}, []);

	const handleCompleteTask = useCallback(() => {
		if (selectedTaskId) {
			const task = tasks.find((t) => t.id === selectedTaskId);
			if (task) {
				setCompleted(selectedTaskId, !task.completed);
			}
		}
		bottomSheetModalRef.current?.dismiss();
	}, [selectedTaskId, tasks, setCompleted]);

	const handleDeleteTask = useCallback(() => {
		if (selectedTaskId) {
			removeTask(selectedTaskId);
		}
		bottomSheetModalRef.current?.dismiss();
	}, [selectedTaskId, removeTask]);

	const handleAddTask = () => {
		if (newTask.title.trim() && newTask.reminder) {
			addTask(newTask);
			setNewTask({
				id: createId(),
				title: "",
				due: new Date(),
				reminder: "",
				completed: false,
				progress: 0,
			});
			addTaskSheetRef.current?.dismiss();
		}
	};

	const handleSelectTaskDue = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
		setNewTask({ ...newTask, due: selectedDate || new Date() });
	};

	const handleOpenReminderSheet = () => {
		reminderSheetRef.current?.present();
	};

	const handleSelectReminder = (value: string) => {
		setNewTask({ ...newTask, reminder: value });
		reminderSheetRef.current?.dismiss();
	};

	return (
		<CustomBackground>
			<Tabs.Screen
				options={{
					headerShown: true,
					title: "Tasks",
					headerLeft: () => (
						<TouchableOpacity
							style={{ marginLeft: 16 }}
							onPress={() => router.back()}
						>
							<AntDesign name="arrowleft" size={24} color="black" />
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity
							style={{ marginRight: 16 }}
							onPress={() => addTaskSheetRef.current?.present()}
						>
							<AntDesign name="plus" size={24} color="black" />
						</TouchableOpacity>
					),
				}}
			/>
			<ScrollView
				style={{
					width: "100%",
					padding: 16,
					marginBottom: 16,
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 16,
					}}
				>
					{tasks.length === 0 ? (
						<Text
							style={{
								textAlign: "center",
							}}
						>
							No tasks available
						</Text>
					) : (
						tasks.map((task) => (
							<TouchableOpacity
								key={task.id}
								onPress={() => handlePresentModal(task.id)}
								style={{
									backgroundColor: task.completed ? "#A8E6CF" : "#D6BBEA",
									borderWidth: 1,
									borderColor: task.completed ? "#3CB371" : "#7b45a6",
									width: "100%",
									position: "relative",
									height: 100,
									justifyContent: "center",
									padding: 16,
									borderRadius: 10,
									opacity: task.completed ? 0.8 : 1,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: 12,
									}}
								>
									<Text
										style={{
											fontSize: 24,
											fontWeight: "bold",
											textDecorationLine: task.completed
												? "line-through"
												: "none",
											color: task.completed ? "#666" : "#000",
										}}
									>
										{task.title}
									</Text>
								</View>
								<Text
									style={{
										position: "absolute",
										right: 5,
										bottom: 5,
									}}
								>
									{moment(task.due).format("D MMM YYYY, h:mm A")}
								</Text>
							</TouchableOpacity>
						))
					)}
				</View>
			</ScrollView>
			<CustomBottomSheet ref={bottomSheetModalRef}>
				<View
					style={{
						flex: 1,
						padding: 16,
					}}
				>
					<TouchableOpacity
						onPress={handleCompleteTask}
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 16,
							gap: 12,
							borderBottomWidth: 1,
							borderBottomColor: "#eee",
						}}
					>
						<MaterialIcons
							name="check-circle-outline"
							size={24}
							color="#3CB371"
						/>
						<Text style={{ fontSize: 16 }}>
							{tasks.find((t) => t.id === selectedTaskId)?.completed
								? "Mark as Incomplete"
								: "Mark as Complete"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleDeleteTask}
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 16,
							gap: 12,
						}}
					>
						<MaterialIcons name="delete-outline" size={24} color="#ff4444" />
						<Text style={{ fontSize: 16, color: "#ff4444" }}>Delete Task</Text>
					</TouchableOpacity>
				</View>
			</CustomBottomSheet>
			<CustomBottomSheet ref={addTaskSheetRef}>
				<ScrollView>
					<View style={{ padding: 16 }}>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Task Name</Text>
						<TextInput
							style={{
								height: 40,
								borderColor: "gray",
								borderWidth: 1,
								borderRadius: 8,
								padding: 8,
								backgroundColor: "#f9f9f9",
								marginBottom: 16,
							}}
							value={newTask.title}
							onChangeText={(text) => setNewTask({ ...newTask, title: text })}
							placeholder="Enter task title"
						/>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Task Due</Text>
						<View style={{ flexDirection: "row", marginBottom: 16 }}>
							<DateTimePicker
								mode="date"
								value={newTask.due}
								onChange={handleSelectTaskDue}
							/>
							<DateTimePicker
								mode="time"
								value={newTask.due}
								onChange={handleSelectTaskDue}
							/>
						</View>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Task Reminder</Text>
						<TouchableOpacity
							style={{
								height: 50,
								borderColor: "gray",
								borderWidth: 0.5,
								borderRadius: 8,
								paddingHorizontal: 8,
								justifyContent: "center",
								backgroundColor: "#f9f9f9",
								marginBottom: 16,
							}}
							onPress={handleOpenReminderSheet}
						>
							<Text style={{ fontSize: 16, color: "#666" }}>
								{newTask.reminder || "Select Reminder"}
							</Text>
						</TouchableOpacity>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Task Progress</Text>
						<View
							style={{
								backgroundColor: "#f9f9f9",
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
								marginBottom: 16,
							}}
						>
							<Slider
								style={{ width: 200, height: 40 }}
								minimumValue={0}
								maximumValue={1}
								minimumTrackTintColor="#7b45a6"
								maximumTrackTintColor="#000000"
								value={newTask.progress}
								onSlidingComplete={(value) =>
									setNewTask({ ...newTask, progress: value })
								}
							/>
							<Text>{Math.round(newTask.progress * 100)}%</Text>
						</View>
						<CustomButton
							text="Save Task"
							onPress={handleAddTask}
							backgroundColor="#7b45a6"
							textColor="#FFFFFF"
						/>
					</View>
				</ScrollView>
			</CustomBottomSheet>
			<CustomBottomSheet ref={reminderSheetRef}>
				<ScrollView
					contentContainerStyle={{
						padding: 16,
					}}
				>
					{reminderOptions.map((option) => (
						<TouchableOpacity
							key={option.value}
							style={{
								padding: 16,
								borderBottomWidth: 1,
								borderBottomColor: "#ddd",
							}}
							onPress={() => handleSelectReminder(option.value)}
						>
							<Text style={{ fontSize: 16, color: "#000" }}>{option.label}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</CustomBottomSheet>
		</CustomBackground>
	);
}
