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
  | { type: 'SET_PROFILE', payload: ProfileState }
  | { type: 'SET_NOTIFICATIONS', payload: NotificationsState }
  | { type: 'SET_DARK_MODE', payload: boolean }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null };

// Reducer function
export const profileReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Mock API functions
export const fetchUserProfile = async (): Promise<ProfileState> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: "Aditya Sharma",
        username: "aditya123",
        phone: "",
        location: "Mumbai, India",
        profilePic: "",
      });
    }, 1000);
  });
};

export const updateUserProfile = async (profile: ProfileState): Promise<ProfileState> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Updated profile:", profile);
      resolve(profile);
    }, 1000);
  });
};