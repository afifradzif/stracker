import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Link, Tabs, useRouter } from "expo-router";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	ScrollView,
} from "react-native";
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { useTaskStore } from "@/hooks/use-task";
import moment from "moment";
import CustomBackground from "@/components/CustomBackground";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import CustomButton from "@/components/CustomButton";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";

const reminderOptions = [
	{ label: "Everyday", value: "Everyday" },
	{ label: "1 day before", value: "1 day before" },
	{ label: "1 week before", value: "1 week before" },
];

export default function ProgressScreen() {
	const router = useRouter();
	const { tasks, removeTask, updateProgress, updateTask, addTask } = useTaskStore();
	const [selectedProgressId, setSelectedProgressId] = useState<string | null>(
		null,
	);
	const addTaskSheetRef = useRef(null);
	const reminderSheetRef = useRef(null);

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const handlePresentModal = useCallback((progressId: string) => {
		console.log("handlePresentModal", progressId);
		setSelectedProgressId(progressId);
		bottomSheetModalRef.current?.present();
	}, []);

	const handleDeleteProgress = useCallback(() => {
		if (selectedProgressId) {
			removeTask(selectedProgressId);
		}
		bottomSheetModalRef.current?.dismiss();
	}, [selectedProgressId, removeTask]);

	const handleUpdateProgress = async (id: string, progress: number) => {
		try {
			await updateProgress(id, progress);
		} catch (error) {
			console.error("Error updating progress:", error);
		}
	};

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				opacity={0.9}
				onPress={bottomSheetModalRef.current?.dismiss}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
			/>
		),
		[],
	);

	// Add the same task state as in tasks.tsx
	const [newTask, setNewTask] = useState({
		id: "",
		title: "",
		due: new Date(),
		reminder: "",
		completed: false,
		progress: 0,
	});

	// Copy these handlers from tasks.tsx
	const handleAddTask = () => {
		if (newTask.title.trim() && newTask.reminder) {
			addTask(newTask);
			setNewTask({
				id: "",
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
						title: "Progress",
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
								No progress available
							</Text>
						) : (
							tasks.map((item) => (
								<TouchableOpacity
									key={item.id}
									onPress={() => handlePresentModal(item.id)}
									style={{
										backgroundColor: item.completed ? "#A8E6CF" : "#D6BBEA",
										borderWidth: 1,
										borderColor: item.completed ? "#3CB371" : "#7b45a6",
										width: "100%",
										position: "relative",
										height: 100,
										justifyContent: "center",
										padding: 16,
										borderRadius: 10,
										opacity: item.completed ? 0.8 : 1,
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
												textDecorationLine: item.completed
													? "line-through"
													: "none",
												color: item.completed ? "#666" : "#000",
											}}
										>
											{item.title}
										</Text>
									</View>
									<View
										style={{
											height: 10,
										}}
									/>
									<View style={styles.progressBar}>
										<View
											style={[
												styles.progressFill,
												{ width: `${item.progress * 100}%` },
											]}
										/>
									</View>
									<Text
										style={{
											position: "absolute",
											right: 5,
											bottom: 5,
										}}
									>
										{moment(item.due).format("D MMM YYYY, h:mm A")}
									</Text>
								</TouchableOpacity>
							))
						)}
					</View>
				</ScrollView>
				<BottomSheetModal
					ref={bottomSheetModalRef}
					snapPoints={["25%"]}
					enableDismissOnClose
					backdropComponent={renderBackdrop}
					enablePanDownToClose
				>
					<BottomSheetView
						style={{
							flex: 1,
							padding: 16,
						}}
					>
						<TouchableOpacity
							onPress={() =>
								router.navigate(`/(stack)/update-progress/${selectedProgressId}`)
							}
							style={{
								flexDirection: "row",
								alignItems: "center",
								padding: 16,
								gap: 12,
								borderBottomWidth: 1,
								borderBottomColor: "#eee",
							}}
						>
							<AntDesign name="edit" size={24} color="#3CB371" />
							<Text style={{ fontSize: 16 }}>Edit</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleDeleteProgress}
							style={{
								flexDirection: "row",
								alignItems: "center",
								padding: 16,
								gap: 12,
							}}
						>
							<MaterialIcons name="delete-outline" size={24} color="#ff4444" />
							<Text style={{ fontSize: 16, color: "#ff4444" }}>
								Delete Progress
							</Text>
						</TouchableOpacity>
					</BottomSheetView>
				</BottomSheetModal>

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

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
	},
	progressBar: {
		height: 12,
		backgroundColor: "#f2f2f2",
		borderRadius: 6,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#7b45a6",
	},
	inputGroup: {
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 8,
	},
	input: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 10,
		fontSize: 16,
	},
	datePicker: {
		width: "100%",
	},
	addButton: {
		backgroundColor: "#3CB371",
		paddingVertical: 12,
		borderRadius: 4,
		alignItems: "center",
	},
	addButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
