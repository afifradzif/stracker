import { useProgressStore } from "@/hooks/use-progress";
import Toast from "react-native-root-toast";
import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import type { TProgress } from "@/types/progress.types";
import Slider from "@react-native-community/slider";

export default function EditProgressScreen() {
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
	const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

	const { progress, updateProgress } = useProgressStore();

	const { id } = useLocalSearchParams();

	const currentProgress = progress.find((p) => p.id === id);

	const [sliderValue, setSliderValue] = useState<number>(
		currentProgress?.progress || 0,
	);

	const [progressState, setProgressState] = useState<TProgress>({
		id: currentProgress?.id || "",
		title: currentProgress?.title || "",
		due: currentProgress?.due || new Date(),
		progress: currentProgress?.progress || 0,
	});

	const router = useRouter();

	const onChangeDate = (
		event: DateTimePickerEvent,
		selectedDate: Date | undefined,
	) => {
		setProgressState({ ...progressState, due: selectedDate || new Date() });
		setShowDatePicker(false);
		setShowTimePicker(!showTimePicker);
	};

	const onSubmit = useCallback(() => {
		if (!progressState.title) {
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
		if (progressState.due <= new Date()) {
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

		updateProgress(currentProgress?.id || "", sliderValue * 100);

		router.navigate("/(tabs)/progress");
	}, [progressState, updateProgress, router, sliderValue, currentProgress]);

	return (
		<View style={styles.backdrop}>
			<Stack.Screen
				options={{
					title: "Update Progress",
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
				<Text style={styles.label}>Subject</Text>
				<TextInput
					style={{
						height: 40,
						borderColor: "gray",
						borderWidth: 1,
						borderRadius: 8,
						padding: 8,
						backgroundColor: "#f9f9f9",
					}}
					onChangeText={(text) =>
						setProgressState({ ...progressState, title: text })
					}
					value={progressState.title}
				/>
				<View
					style={{
						height: 16,
					}}
				/>
				<Text style={styles.label}>Due</Text>
				{Platform.OS === "ios" ? (
					<DateTimePicker
						mode="datetime"
						value={progressState.due}
						onChange={onChangeDate}
						accentColor="#7b45a6"
					/>
				) : (
					<>
						<TouchableOpacity
							onPress={() => setShowDatePicker(true)}
							style={{ paddingVertical: 8, paddingHorizontal: 12 }}
						>
							<Text>{moment(progressState.due).format("h:mm A")}</Text>
						</TouchableOpacity>
						{showDatePicker && (
							<DateTimePicker
								mode="date"
								value={progressState.due}
								onChange={onChangeDate}
								accentColor="#7b45a6"
							/>
						)}
						{showTimePicker && (
							<DateTimePicker
								mode="time"
								value={progressState.due}
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
					{moment(progressState.due).format("dddd, D MMM YYYY, h:mm A")}
				</Text>
				<View
					style={{
						height: 16,
					}}
				/>
				<Text style={styles.label}>Due</Text>
				<Slider
					style={{ width: 200, height: 40 }}
					minimumValue={0}
					maximumValue={1}
					minimumTrackTintColor="#FFFFFF"
					maximumTrackTintColor="#000000"
					value={sliderValue}
					onValueChange={(value) => setSliderValue(value)}
				/>
			</View>
			<TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
				<Text style={styles.submitButtonText}>Update Progress</Text>
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
