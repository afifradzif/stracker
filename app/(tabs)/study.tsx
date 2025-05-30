import { Link, Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Dimensions } from "react-native";
import { useStudyPlan } from "@/hooks/use-study";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import CustomBackground from "@/components/CustomBackground";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import CustomButton from "@/components/CustomButton";
import { Calendar, type DateData } from "react-native-calendars";
import { createId } from "@paralleldrive/cuid2";

const reminderOptions = [
	{ label: "Everyday", value: "Everyday" },
	{ label: "1 day before", value: "1 day before" },
	{ label: "1 week before", value: "1 week before" },
];

const dailyMotivationOptions = [
	{ label: "Everyday", value: "Everyday" },
	{ label: "Every week", value: "Every Week" },
	{ label: "Every month", value: "Every month" },
];

export default function StudyPlanScreen() {
	const { studyPlans, setCompleted, removeStudyPlan, addStudyPlan } = useStudyPlan();
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [reminderFocus, setReminderFocus] = useState(false);
	const [dailyMotivationFocus, setDailyMotivationFocus] = useState(false);

	const [selected, setSelected] = useState({
		id: createId(),
		title: "",
		date: new Date(),
		reminder: "",
		daily_motivation: "", // Changed from dailyMotivation
		completed: false,
	});

	const [dateData, setDateData] = useState<DateData>(() => {
		const today = new Date();
		return {
			dateString: today.toISOString().split("T")[0],
			day: today.getDate(),
			month: today.getMonth() + 1,
			timestamp: today.getTime(),
			year: today.getFullYear(),
		};
	});

	const router = useRouter();
	const bottomSheetRef = useRef(null);
	const addPlanSheetRef = useRef(null);
	const calendarSheetRef = useRef(null);
	const dropdownSheetRef = useRef(null);
	const [dropdownData, setDropdownData] = useState<{ label: string; value: string }[]>([]);
	const [dropdownPlaceholder, setDropdownPlaceholder] = useState("");
	const [dropdownSelectedValue, setDropdownSelectedValue] = useState<string | null>(null);
	const [dropdownOnChange, setDropdownOnChange] = useState<(value: string) => void>(() => {});

	const handlePresentModal = useCallback((taskId: string) => {
		setSelectedTaskId(taskId);
		bottomSheetRef.current?.present();
	}, []);

	const handleCompleteTask = useCallback(() => {
		if (selectedTaskId) {
			const task = studyPlans.find((t) => t.id === selectedTaskId);
			if (task) {
				setCompleted(selectedTaskId, !task.completed);
			}
		}
		bottomSheetRef.current?.dismiss();
	}, [selectedTaskId, studyPlans, setCompleted]);

	const handleDeleteTask = useCallback(() => {
		if (selectedTaskId) {
			removeStudyPlan(selectedTaskId);
		}
		bottomSheetRef.current?.dismiss();
	}, [selectedTaskId, removeStudyPlan]);

	const handleAddPlan = () => {
		if (selected.title.trim()) {
			addStudyPlan(selected);
			addPlanSheetRef.current?.dismiss();
		}
	};

	const handleOpenDropdown = (
		data: { label: string; value: string }[],
		placeholder: string,
		selectedValue: string | null,
		onChange: (value: string) => void
	) => {
		setDropdownData(data);
		setDropdownPlaceholder(placeholder);
		setDropdownSelectedValue(selectedValue);
		setDropdownOnChange(() => onChange);
		dropdownSheetRef.current?.present();
	};

	const handleSelectDropdownItem = (item: { label: string; value: string }) => {
		dropdownOnChange(item.value);
		dropdownSheetRef.current?.dismiss();
	};

	return (
		<CustomBackground>
			<Tabs.Screen
				options={{
					headerShown: true,
					title: "Study Plans",
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
							onPress={() => addPlanSheetRef.current?.present()}
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
					{studyPlans.length === 0 ? (
						<Text
							style={{
								textAlign: "center",
							}}
						>
							No study plan available
						</Text>
					) : (
						studyPlans.map((task) => (
							<View
								key={task.id}
								style={{
									width: "100%",
									backgroundColor: task.completed ? "#A8E6CF" : "#D6BBEA",
									borderWidth: 1,
									borderColor: task.completed ? "#3CB371" : "#7b45a6",
									borderRadius: 10,
									padding: 16,
									elevation: 3,
								}}
							>
								<TouchableOpacity
									onPress={() => handlePresentModal(task.id)}
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<View>
										<Text
											style={{
												fontSize: 20,
												fontWeight: "bold",
												textDecorationLine: task.completed
													? "line-through"
													: "none",
												color: task.completed ? "#666" : "#000",
											}}
										>
											{task.title}
										</Text>
										<Text
											style={{
												fontSize: 14,
												color: "#666",
												marginTop: 4,
											}}
										>
											{moment(task.date).format("D MMM YYYY, h:mm A")}
										</Text>
									</View>
									<AntDesign
										name="right"
										size={20}
										color={task.completed ? "#666" : "#000"}
									/>
								</TouchableOpacity>
							</View>
						))
					)}
				</View>
			</ScrollView>
			<CustomBottomSheet ref={bottomSheetRef}>
				<View
					style={{
						flex: 1,
						padding: 16,
					}}
				>
					<CustomButton
						text={
							studyPlans.find((t) => t.id === selectedTaskId)?.completed
								? "Mark as Incomplete"
								: "Mark as Complete"
						}
						onPress={handleCompleteTask}
						backgroundColor="#3CB371"
						textColor="#FFFFFF"
					/>
					<CustomButton
						text="Delete Task"
						onPress={handleDeleteTask}
						backgroundColor="#ff4444"
						textColor="#FFFFFF"
					/>
				</View>
			</CustomBottomSheet>
			<CustomBottomSheet ref={addPlanSheetRef}>
				<ScrollView>
					<View style={{ padding: 16 }}>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Selected Date</Text>
						<TouchableOpacity
							onPress={() => calendarSheetRef.current?.present()}
							style={{
								height: 40,
								borderColor: "gray",
								borderWidth: 1,
								borderRadius: 8,
								padding: 8,
								backgroundColor: "#f9f9f9",
								justifyContent: "center",
								marginBottom: 16,
							}}
						>
							<Text style={{ fontSize: 14, color: "#666" }}>
								{dateData.dateString}
							</Text>
						</TouchableOpacity>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Title</Text>
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
							value={selected.title}
							onChangeText={(text) => setSelected({ ...selected, title: text })}
							placeholder="Enter study plan title"
						/>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Reminder</Text>
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
							onPress={() =>
								handleOpenDropdown(
									reminderOptions,
									"Select Reminder",
									selected.reminder,
									(value) => setSelected({ ...selected, reminder: value })
								)
							}
						>
							<Text style={{ fontSize: 16, color: "#666" }}>
								{selected.reminder || "Select Reminder"}
							</Text>
						</TouchableOpacity>
						<Text style={{ fontSize: 16, fontWeight: "bold" }}>Daily Motivation</Text>
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
							onPress={() =>
								handleOpenDropdown(
									dailyMotivationOptions,
									"Select Daily Motivation",
									selected.daily_motivation, // Changed from dailyMotivation
									(value) => setSelected({ ...selected, daily_motivation: value }) // Changed from dailyMotivation
								)
							}
						>
							<Text style={{ fontSize: 16, color: "#666" }}>
								{selected.daily_motivation || "Select Daily Motivation"} {/* Changed from dailyMotivation */}
							</Text>
						</TouchableOpacity>
						<CustomButton
							text="Save Plan"
							onPress={handleAddPlan}
							backgroundColor="#7b45a6"
							textColor="#FFFFFF"
						/>
					</View>
				</ScrollView>
			</CustomBottomSheet>
			<CustomBottomSheet ref={calendarSheetRef}>
				<Calendar
					style={{
						height: 350,
					}}
					theme={{
						backgroundColor: "#ffffff",
						calendarBackground: "#ffffff",
						textSectionTitleColor: "#7b45a6",
						textSectionTitleDisabledColor: "#d9e1e8",
						selectedDayBackgroundColor: "#7b45a6",
						selectedDayTextColor: "#ffffff",
						todayTextColor: "#7b45a6",
						dayTextColor: "#2d4150",
						textDisabledColor: "#d9e1e8",
						dotColor: "#7b45a6",
						selectedDotColor: "#ffffff",
						arrowColor: "#7b45a6",
						disabledArrowColor: "#d9e1e8",
						monthTextColor: "#7b45a6",
						indicatorColor: "#7b45a6",
						textDayFontWeight: "300",
						textMonthFontWeight: "bold",
						textDayHeaderFontWeight: "300",
						textDayFontSize: 16,
						textMonthFontSize: 16,
						textDayHeaderFontSize: 14,
					}}
					onDayPress={(day: DateData) => {
						setSelected({ ...selected, date: new Date(day.dateString) });
						setDateData(day);
						calendarSheetRef.current?.dismiss();
					}}
					markedDates={{
						[dateData.dateString]: {
							selected: true,
							disableTouchEvent: true,
							selectedDotColor: "orange",
						},
					}}
				/>
			</CustomBottomSheet>
			<CustomBottomSheet ref={dropdownSheetRef}>
				<ScrollView
					contentContainerStyle={{
						padding: 16,
						maxHeight: Dimensions.get("window").height * 0.5,
					}}
					keyboardShouldPersistTaps="handled"
				>
					{dropdownData.map((item) => (
						<TouchableOpacity
							key={item.value}
							style={{
								padding: 16,
								borderBottomWidth: 1,
								borderBottomColor: "#ddd",
							}}
							onPress={() => handleSelectDropdownItem(item)}
						>
							<Text style={{ fontSize: 16, color: "#000" }}>{item.label}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</CustomBottomSheet>
		</CustomBackground>
	);
}
