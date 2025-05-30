import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useRef } from "react";
import CustomBackground from "@/components/CustomBackground";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getCurrentUserName } from '@/lib/store/user';

export default function HomeScreen() {
	const router = useRouter();
	const bottomSheetRef = useRef(null);

	const handleAddButtonPress = () => {
		bottomSheetRef.current?.present();
	};

	return (
		<CustomBackground>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Hello, {getCurrentUserName()}</Text>
				</View>
				<View style={styles.menuContainer}>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/study")}
					>
						<AntDesign name="book" size={32} color="#7b45a6" />
						<Text style={styles.menuText}>Study Plans</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/progress")}
					>
						<MaterialCommunityIcons
							name="progress-clock"
							size={32}
							color="#FF8C00"
						/>
						<Text style={styles.menuText}>Progress</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/tasks")}
					>
						<FontAwesome5 name="tasks" size={32} color="#228B22" />
						<Text style={styles.menuText}>Tasks</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/me")}
					>
						<AntDesign name="user" size={32} color="#6200EE" />
						<Text style={styles.menuText}>Me</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.floatingButton} onPress={handleAddButtonPress}>
					<Text style={styles.floatingButtonText}>+</Text>
				</TouchableOpacity>
			</SafeAreaView>
			<CustomBottomSheet ref={bottomSheetRef}>
					<View style={styles.bottomSheetContent}>
						<TouchableOpacity
							style={styles.bottomSheetButton}
							onPress={() => {
								router.push("/(stack)/study");
								bottomSheetRef.current?.dismiss();
							}}
						>
							<Text style={styles.bottomSheetButtonText}>Add Study Plan</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.bottomSheetButton}
							onPress={() => {
								router.push("/(stack)/add-tasks");
								bottomSheetRef.current?.dismiss();
							}}
						>
							<Text style={styles.bottomSheetButtonText}>Add Task</Text>
						</TouchableOpacity>
					</View>
				</CustomBottomSheet>
		</CustomBackground>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	header: {
		marginTop: 10,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	menuContainer: {
		flexDirection: "row",
		backgroundColor: "#F5F5F5",
		borderRadius: 10,
		padding: 20,
		height: 100,
		marginTop: 10,
		elevation: 3,
	},
	menuCard: {
		width: 80,
		justifyContent: "center",
		alignItems: "center",
	},
	menuText: {
		marginTop: 8,
		fontSize: 12,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
	},
	divider: {
		width: 1,
		height: 60,
		backgroundColor: "#ccc",
	},
	floatingButton: {
		position: "absolute",
		bottom: 30,
		right: 10,
		backgroundColor: "#6200EE",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	floatingButtonText: {
		color: "#FFFFFF",
		fontSize: 28,
		fontWeight: "bold",
	},
	bottomSheetContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	bottomSheetButton: {
		width: "100%",
		padding: 16,
		backgroundColor: "#6200EE",
		borderRadius: 8,
		marginBottom: 16,
		alignItems: "center",
	},
	bottomSheetButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});
