// Define types for the state
export interface ProfileState {
  name: string; // Changed from fullName to match backend
  email: string; // Changed from username to match backend
  mobile: string; // Changed from phone to match backend
  address: string; // Changed from location to match backend
  profilePic: string; // Keep for future use
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
    name: data.name || "",
    email: data.email || "",
    mobile: data.mobile || "",
    address: data.address || "",
    profilePic: data.profilePic || "",
  };
};

export const updateUserProfile = async (
  profile: ProfileState
): Promise<ProfileState> => {
  const { data } = await client.put("/users/profile", profile);
  return {
    name: data.name || "",
    email: data.email || "",
    mobile: data.mobile || "",
    address: data.address || "",
    profilePic: data.profilePic || "",
  };
};
