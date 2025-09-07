// Define types for the state
export interface ProfileState {
  fullName: string;
  username: string;
  phone: string;
  location: string;
  profilePic: string;
}

export interface NotificationsState {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface AppState {
  profile: ProfileState;
  notifications: NotificationsState;
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}

// Define actions
export type Action =
  | { type: "SET_PROFILE"; payload: ProfileState }
  | { type: "SET_NOTIFICATIONS"; payload: NotificationsState }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Reducer function
export const profileReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

import client from "../api/client";

// Real API function
export const fetchUserProfile = async (): Promise<ProfileState> => {
  const { data } = await client.get("/users/profile");
  return {
    fullName: data.name || "",
    username: data.username || data.email || "",
    phone: data.mobile || "",
    location: data.address || "",
    profilePic: data.profilePic || "",
  };
};

export const updateUserProfile = async (
  profile: ProfileState
): Promise<ProfileState> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Updated profile:", profile);
      resolve(profile);
    }, 1000);
  });
};
