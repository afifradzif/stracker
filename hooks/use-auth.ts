import { create } from "zustand";
import {
	createJSONStorage,
	persist,
	type StateStorage,
} from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV({
	id: "auth-store",
});

const mmkvStorage: StateStorage = {
	setItem: (name, value) => {
		return mmkv.set(name, value);
	},
	getItem: (name) => {
		const value = mmkv.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return mmkv.delete(name);
	},
};

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
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);
