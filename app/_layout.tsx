import { Redirect, Slot } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as Font from "expo-font";
import { useAuthStore } from "@/hooks/use-auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { registerForPushNotificationsAsync } from '../utils/notifications';

export default function RootLayout() {
	const [loaded, setLoaded] = useState(false);
	const { auth } = useAuthStore();

	  useEffect(() => {
		registerForPushNotificationsAsync();
	  }, []);

	useEffect(() => {
		async function prepare() {
			try {
				// Pre-load fonts, make any API calls you need to do here
				await Font.loadAsync(Entypo.font);
				// Artificially delay for two seconds to simulate a slow loading
				// experience. Please remove this if you copy and paste the code!
				// await new Promise((resolve) => setTimeout(resolve, 2000));
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setLoaded(true);
			}
		}

		prepare();
	}, [auth]);

	if (!loaded) {
		return <Slot />;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<RootSiblingParent>
					<Slot />
						<Redirect href="/(stack)/login" />
				</RootSiblingParent>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}
