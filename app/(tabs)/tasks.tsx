import { Link, Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTaskStore } from "@/hooks/use-task";
import moment from "moment";
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function TaskScreen() {
	const router = useRouter();
	const { tasks, setCompleted, removeTask } = useTaskStore();
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const handlePresentModal = useCallback((taskId: string) => {
		console.log("handlePresentModal", taskId);
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

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Tabs.Screen
				options={{
					headerRight: () => (
						<Link style={{ marginRight: 16 }} push href="/(stack)/add-tasks">
							<AntDesign name="plus" size={24} color="black" />
						</Link>
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
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
