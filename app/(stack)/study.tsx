import { useStudyPlan } from "@/hooks/use-study";
// import Dropdown from "@/components/dropdown";
import { Dropdown } from "react-native-element-dropdown";
import type { TStudy } from "@/types/study.types";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
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

const StudyScreen = () => {
	const [reminderFocus, setReminderFocus] = useState(false);
	const [dailyMotivationFocus, setDailyMotivationFocus] = useState(false);

	const [selected, setSelected] = useState<TStudy>({
		id: createId(),
		title: "",
		date: new Date(),
		reminder: "",
		dailyMotivation: "",
		completed: false,
	});

	const [dateData, setDateData] = useState<DateData>(() => {
		const today = new Date();
		return {
			dateString: today.toISOString().split("T")[0],
			day: today.getDate(),
			month: today.getMonth() + 1, // getMonth() returns 0-11
			timestamp: today.getTime(),
			year: today.getFullYear(),
		};
	});

	const { addStudyPlan } = useStudyPlan();

	const router = useRouter();

	return (
		<ScrollView>
			<Stack.Screen
				options={{
					title: "Study Plans",
					headerShown: true,
					headerBackVisible: true,
				}}
			/>
			<Calendar
				style={{
					borderWidth: 1,
					borderColor: "gray",
					height: 350,
				}}
				onDayPress={(day: DateData) => {
					setSelected({ ...selected, date: new Date(day.dateString) });
					setDateData(day);
				}}
				markedDates={{
					[dateData.dateString]: {
						selected: true,
						disableTouchEvent: true,
						selectedDotColor: "orange",
					},
				}}
			/>

			<View style={styles.backdrop}>
				<View style={styles.formContainer}>
					<Text style={styles.label}>Selected Date</Text>
					<Text style={styles.dateText}>{dateData.dateString}</Text>

					<Text style={styles.label}>Title</Text>
					<TextInput
						style={{
							height: 40,
							borderColor: "gray",
							borderWidth: 1,
							borderRadius: 8,
							padding: 8,
							backgroundColor: "#f9f9f9",
						}}
						value={selected.title}
						onChangeText={(text) => setSelected({ ...selected, title: text })}
						placeholder="Enter study plan title"
					/>
					<View
						style={{
							height: 16,
						}}
					/>
					<Text style={styles.label}>Reminder</Text>
					<Dropdown
						style={[
							dropdownStyles.dropdown,
							reminderFocus && { borderColor: "blue" },
						]}
						placeholderStyle={dropdownStyles.placeholderStyle}
						selectedTextStyle={dropdownStyles.selectedTextStyle}
						inputSearchStyle={dropdownStyles.inputSearchStyle}
						iconStyle={dropdownStyles.iconStyle}
						search
						maxHeight={300}
						labelField="label"
						valueField="value"
						placeholder={!reminderFocus ? "Select item" : "..."}
						searchPlaceholder="Search..."
						data={reminderOptions}
						onFocus={() => setReminderFocus(true)}
						onBlur={() => setReminderFocus(false)}
						onChange={(item) => {
							setSelected({ ...selected, reminder: item.value });
							setReminderFocus(false);
						}}
					/>
					<View
						style={{
							height: 16,
						}}
					/>
					<Text style={styles.label}>Daily Motivation</Text>
					<Dropdown
						style={[
							dropdownStyles.dropdown,
							dailyMotivationFocus && { borderColor: "blue" },
						]}
						placeholderStyle={dropdownStyles.placeholderStyle}
						selectedTextStyle={dropdownStyles.selectedTextStyle}
						inputSearchStyle={dropdownStyles.inputSearchStyle}
						iconStyle={dropdownStyles.iconStyle}
						search
						maxHeight={300}
						labelField="label"
						valueField="value"
						placeholder={!dailyMotivationFocus ? "Select item" : "..."}
						searchPlaceholder="Search..."
						data={dailyMotivationOptions}
						onFocus={() => setDailyMotivationFocus(true)}
						onBlur={() => setDailyMotivationFocus(false)}
						onChange={(item) => {
							setSelected({ ...selected, dailyMotivation: item.value });
							setDailyMotivationFocus(false);
						}}
					/>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.submitButton}
							onPress={() => {
								if (selected.title.trim()) {
									addStudyPlan(selected);
									router.back();
								}
							}}
						>
							<Text style={styles.submitButtonText}>Save Plan</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.submitButton, styles.cancelButton]}
							onPress={() => router.back()}
						>
							<Text style={styles.submitButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	formContainer: {
		gap: 12,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		width: "100%",
	},
	dateText: {
		fontSize: 16,
		color: "#666",
	},
	buttonContainer: {
		marginTop: 24,
		gap: 12,
	},
	cancelButton: {
		backgroundColor: "#666",
	},
	backdrop: {
		padding: 20,
	},
	label: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 2,
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

const dropdownStyles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 16,
	},
	dropdown: {
		height: 50,
		borderColor: "gray",
		borderWidth: 0.5,
		borderRadius: 8,
		paddingHorizontal: 8,
	},
	icon: {
		marginRight: 5,
	},
	label: {
		position: "absolute",
		backgroundColor: "white",
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});

export default StudyScreen;
