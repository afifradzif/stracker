import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Auth {
	username: string;
	password: string;
	isLoggedIn: boolean;
}

interface AuthStore {
	auth: Auth;
	signIn: (credentials: Pick<Auth, "username" | "password">) => boolean;
	signOut: () => void;
}

export const useAuthStore = create(
	persist<AuthStore>(
		(set, get) => ({
			auth: {
				username: "admin",
				password: "admin",
				isLoggedIn: false,
			},
			signIn: (credentials) => {
				if (
					credentials.username === "admin" &&
					credentials.password === "admin"
				) {
					set({ auth: { ...credentials, isLoggedIn: true } });
					return true;
				}
				return false;
			},
			signOut: () => set({ auth: { ...get().auth, isLoggedIn: false } }),
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
