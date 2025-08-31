// frontend/src/pages/Profile.tsx
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  LogOut,
  Moon,
  Sun,
  Bell,
  Heart,
  ShoppingBag,
  Camera,
} from "lucide-react";
import {
  profileReducer,
  fetchUserProfile,
  updateUserProfile,
  AppState,
} from "./profile.utils";
import OrderDetails from "@/components/ui/OrderDetails";
import ChangePassword from "@/components/ui/ChangePassword";
import AddressManagement from "@/components/ui/AddressManagement";
import PaymentMethodManagement from "@/components/ui/PaymentMethodManagement";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

const initialState: AppState = {
  profile: {
    fullName: "",
    username: "",
    phone: "",
    location: "",
    profilePic: "",
  },
  notifications: {
    email: true,
    push: true,
    inApp: false,
  },
  darkMode: false,
  loading: true,
  error: null,
};

const orders: Order[] = [
  {
    id: "12345",
    date: "2023-10-26",
    status: "Delivered",
    total: 25.99,
    items: [
      { name: "Pizza", quantity: 1, price: 15.99 },
      { name: "Coke", quantity: 2, price: 5.0 },
    ],
  },
  {
    id: "12346",
    date: "2023-10-27",
    status: "On the way",
    total: 12.5,
    items: [{ name: "Burger", quantity: 1, price: 12.5 }],
  },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { profile, notifications, darkMode, loading, error } = state;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const userProfile = await fetchUserProfile();
        dispatch({ type: "SET_PROFILE", payload: userProfile });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch profile." });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    };

    loadProfile();
  }, [navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_PROFILE',
      payload: { ...profile, [e.target.name]: e.target.value }
    });
  };

  const handleSaveChanges = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const updatedProfile = await updateUserProfile(profile);
      dispatch({ type: "SET_PROFILE", payload: updatedProfile });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to save changes." });
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleLogoutAll = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 w-full font-sans relative bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen">
      {/* Animated SVG background */}
      <svg className="absolute top-0 left-0 w-full h-full -z-10" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="650" cy="100" r="80" fill="url(#grad1)" opacity="0.25">
          <animate attributeName="r" values="80;100;80" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="500" r="60" fill="url(#grad2)" opacity="0.2">
          <animate attributeName="r" values="60;80;60" dur="8s" repeatCount="indefinite" />
        </circle>
        <defs>
          <radialGradient id="grad1" cx="0.5" cy="0.5" r="1" gradientTransform="rotate(90 .5 .5) scale(1)">
            <stop offset="0%" stopColor="#F59E42" />
            <stop offset="100%" stopColor="#F472B6" />
          </radialGradient>
          <radialGradient id="grad2" cx="0.5" cy="0.5" r="1" gradientTransform="rotate(90 .5 .5) scale(1)">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#F59E42" />
          </radialGradient>
        </defs>
      </svg>
      <Card className="shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-lg animate-fadein">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl py-6 px-8">
          <CardTitle className="flex items-center justify-between text-white text-3xl font-extrabold tracking-tight">
            <span className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-pink-200 animate-bounce" /> My Profile
            </span>
            <div className="flex space-x-2">
              <Button
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 ripple"
                size="sm"
                onClick={handleLogoutAll}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout All
              </Button>
              <Button
                className="bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 ripple"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <p className="text-center text-gray-700 mb-4 text-lg font-medium">
            Welcome, <span className="font-semibold text-orange-500">{profile.username}</span> <span className="animate-wave">👋</span>
          </p>

          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className="relative">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-pink-300 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-red-200 flex items-center justify-center text-gray-500 shadow-lg">
                  <Camera className="w-8 h-8 animate-pulse" />
                </div>
              )}
              <div className="flex justify-center mt-2 space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple">Upload / Change</Button>
                {profile.profilePic && (
                  <Button size="sm" variant="destructive" className="font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="animate-fadein">
            <TabsList className="grid grid-cols-5 bg-gradient-to-r from-orange-200 via-pink-200 to-red-200 rounded-xl mb-4">
              <TabsTrigger value="info" className="font-bold text-orange-600 transition-all duration-200 hover:text-pink-600">Profile Info</TabsTrigger>
              <TabsTrigger value="orders" className="font-bold text-pink-600 transition-all duration-200 hover:text-orange-600">My Orders</TabsTrigger>
              <TabsTrigger value="addresses" className="font-bold text-red-600 transition-all duration-200 hover:text-orange-600">Addresses</TabsTrigger>
              <TabsTrigger value="payment" className="font-bold text-orange-600 transition-all duration-200 hover:text-pink-600">Payment</TabsTrigger>
              <TabsTrigger value="settings" className="font-bold text-pink-600 transition-all duration-200 hover:text-orange-600">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="space-y-4 mt-4">
                <Input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                  className="rounded-lg border-2 border-orange-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                />
                <Input
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  placeholder="Username"
                  className="rounded-lg border-2 border-orange-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                />
                <Input
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone (optional)"
                  className="rounded-lg border-2 border-orange-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                />
                <Input
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  placeholder="Location"
                  className="rounded-lg border-2 border-orange-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                />
                <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple" onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="p-3 flex items-center justify-between bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 shadow rounded-xl backdrop-blur-md">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-pink-500 animate-bounce" />
                      <span className="font-semibold text-orange-700">Order #{order.id} - {order.status}</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple" onClick={() => setSelectedOrder(order)}>View Details</Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <AddressManagement />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentMethodManagement />
            </TabsContent>

            <TabsContent value="settings">
              <div className="mt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    {darkMode ? <Moon className="text-pink-500 animate-spin" /> : <Sun className="text-orange-400 animate-spin" />}
                    <span className="font-bold">Dark Mode</span>
                  </span>
                  <Switch checked={darkMode} onCheckedChange={(payload) => dispatch({ type: 'SET_DARK_MODE', payload })} />
                </div>

                <div>
                  <h3 className="font-bold mb-2 flex items-center text-orange-600">
                    <Bell className="w-4 h-4 mr-2 animate-pulse" /> Notifications
                  </h3>
                  <div className="space-y-2">
                    {Object.keys(notifications).map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="font-semibold text-pink-600">{key.toUpperCase()}</span>
                        <Switch
                          checked={notifications[key as keyof typeof notifications]}
                          onCheckedChange={(val) =>
                            dispatch({
                              type: 'SET_NOTIFICATIONS',
                              payload: { ...notifications, [key]: val }
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2 flex items-center text-pink-600">
                    <Heart className="w-4 h-4 mr-2 text-pink-500 animate-bounce" /> Saved Items
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {[{ name: "Pizza Hut - Farmhouse Pizza", id: 1 }, { name: "Biryani by Kilo - Chicken Biryani", id: 2 }].map((item) => (
                      <li key={item.id} className="flex items-center justify-between bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 rounded-lg px-4 py-2 shadow hover:scale-105 transition-transform">
                        <span className="font-semibold text-orange-700">{item.name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple"
                            onClick={() => alert(`Reorder placed for ${item.name}!`)}
                          >
                            <ShoppingBag className="w-4 h-4 mr-1" /> Reorder
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-pink-400 text-pink-600 font-bold shadow hover:bg-pink-100 hover:scale-110 active:scale-95 transition-transform duration-200 ripple"
                            onClick={() => alert(`${item.name} added to favorites!`)}
                          >
                            <Heart className="w-4 h-4 mr-1 text-pink-500" /> Favorite
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <ChangePassword />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
