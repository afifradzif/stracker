import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomBackground from "@/components/CustomBackground";
import CustomButton from "@/components/CustomButton";
import { useTaskStore } from "@/hooks/use-task";
import Slider from "@react-native-community/slider";

export default function EditProgressScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { tasks, updateProgress } = useTaskStore();
	const [progress, setProgress] = useState(0);

	const task = tasks.find((t) => t.id === id);

	useEffect(() => {
		if (task) {
			setProgress(task.progress);
		}
	}, [task]);

	const handleUpdateProgress = async () => {
		try {
			await updateProgress(id as string, progress);
			Alert.alert("Success", "Progress updated successfully!");
			router.back();
		} catch (error) {
			Alert.alert("Error", "Failed to update progress");
		}
	};

	if (!task) {
		return (
			<CustomBackground>
				<Text>Task not found</Text>
			</CustomBackground>
		);
	}

	return (
		<CustomBackground>
			<View style={styles.container}>
				<Text style={styles.title}>Update Progress</Text>
				<Text style={styles.taskTitle}>{task.title}</Text>

				<View style={styles.progressContainer}>
					<Slider
						style={{ width: "100%", height: 40 }}
						minimumValue={0}
						maximumValue={1}
						minimumTrackTintColor="#7b45a6"
						maximumTrackTintColor="#000000"
						value={progress}
						onValueChange={setProgress}
					/>
					<Text style={styles.progressText}>
						{Math.round(progress * 100)}%
					</Text>
				</View>

				<CustomButton
					text="Save Progress"
					onPress={handleUpdateProgress}
					backgroundColor="#7b45a6"
					textColor="#FFFFFF"
				/>
			</View>
		</CustomBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	taskTitle: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
	progressContainer: {
		backgroundColor: "#f9f9f9",
		padding: 20,
		borderRadius: 10,
		marginBottom: 20,
		alignItems: "center",
	},
	progressText: {
		fontSize: 16,
		marginTop: 10,
	},
});
