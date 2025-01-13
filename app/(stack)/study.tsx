import { useStudyPlan } from "@/hooks/use-study";
import type { TStudy } from "@/types/study.types";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import { createId } from "@paralleldrive/cuid2";

const StudyScreen = () => {
	const [selected, setSelected] = useState<TStudy>({
		id: createId(),
		title: "",
		date: new Date(),
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
		<View>
			<Stack.Screen
				options={{
					title: "Study Plans",
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
						style={styles.input}
						value={selected.title}
						onChangeText={(text) => setSelected({ ...selected, title: text })}
						placeholder="Enter study plan title"
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
		</View>
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

export default StudyScreen;
