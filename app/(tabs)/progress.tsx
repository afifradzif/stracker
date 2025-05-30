import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Link, Tabs, useRouter } from "expo-router";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
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

export default function ProgressScreen() {
	const router = useRouter();
	const { tasks, removeTask, updateProgress, updateTask } = useTaskStore();
	const [selectedProgressId, setSelectedProgressId] = useState<string | null>(
		null,
	);

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
							<Link push style={{ marginRight: 16 }} href="/(tabs)/tasks">
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
});
