import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#7b45a6",
				headerShown: true,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
					},
					default: {},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<AntDesign size={28} name="home" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="progress"
				options={{
					title: "Progress",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							size={28}
							name="progress-clock"
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="tasks"
				options={{
					title: "Tasks",
					tabBarIcon: ({ color }) => (
						<FontAwesome5 size={28} name="tasks" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="me"
				options={{
					title: "Me",
					tabBarIcon: ({ color }) => (
						<AntDesign size={28} name="user" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
