import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { loginUser } from "@/lib/graphql/auth";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV({
	id: "auth-store",
});

const mmkvStorage = {
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
	isLoggedIn: boolean;
	userId?: string;
}

interface AuthStore {
	auth: Auth;
	signIn: (credentials: { username: string; password: string }) => Promise<boolean>;
	signOut: () => void;
}

export const useAuthStore = create(
	persist<AuthStore>(
		(set) => ({
			auth: {
				isLoggedIn: false,
				userId: undefined,
			},
			signIn: async (credentials) => {
				const response = await loginUser(credentials.username, credentials.password);
				if (response.error) return false;
				set({ 
					auth: { 
						isLoggedIn: true,
						userId: response.user?.id
					} 
				});
				return true;
			},
			signOut: () => set({ 
				auth: { 
					isLoggedIn: false,
					userId: undefined
				} 
			}),

		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);
