import { useProgressStore } from "@/hooks/use-progress";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
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

export default function ProgressScreen() {
	const router = useRouter();
	const { progress, removeProgress } = useProgressStore();
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
			removeProgress(selectedProgressId);
		}
		bottomSheetModalRef.current?.dismiss();
	}, [selectedProgressId, removeProgress]);

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
				width: Dimensions.get("window").width,
				padding: 16,
			}}
		>
			<Tabs.Screen
				options={{
					headerRight: () => (
						<TouchableOpacity
							style={{ marginRight: 16 }}
							onPress={() => router.navigate("/(stack)/add-progress")}
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
				{progress.length === 0 ? (
					<Text
						style={{
							textAlign: "center",
						}}
					>
						No progress available
					</Text>
				) : (
					progress.map((item) => (
						<TouchableOpacity
							key={item.id}
							onPress={() => handlePresentModal(item.id)}
							style={styles.container}
						>
							<Text style={styles.title}>{item.title}</Text>
							<View style={styles.progressBar}>
								<View
									style={[styles.progressFill, { width: `${item.progress}%` }]}
								/>
							</View>
						</TouchableOpacity>
					))
				)}
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
		</View>
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
		backgroundColor: "#007bff",
	},
});
