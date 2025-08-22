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
      } catch (_error) {
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
    } catch (_error) {
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
    <div className="container mx-auto max-w-3xl p-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Profile</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogoutAll}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout All
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Welcome, <span className="font-semibold">{profile.username}</span> 👋
          </p>

          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className="relative">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <Camera className="w-6 h-6" />
                </div>
              )}
              <div className="flex justify-center mt-2 space-x-2">
                <Button size="sm">Upload / Change</Button>
                {profile.profilePic && (
                  <Button size="sm" variant="destructive">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="info">Profile Info</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="space-y-4 mt-4">
                <Input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                />
                <Input
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  placeholder="Username"
                />
                <Input
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone (optional)"
                />
                <Input
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  placeholder="Location"
                />
                <Button className="w-full" onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-red-500" />
                      <span>Order #{order.id} - {order.status}</span>
                    </div>
                    <Button size="sm" onClick={() => setSelectedOrder(order)}>View Details</Button>
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
                    {darkMode ? <Moon /> : <Sun />}
                    <span>Dark Mode</span>
                  </span>
                  <Switch checked={darkMode} onCheckedChange={(payload) => dispatch({ type: 'SET_DARK_MODE', payload })} />
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                  </h3>
                  <div className="space-y-2">
                    {Object.keys(notifications).map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span>{key.toUpperCase()}</span>
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
                  <h3 className="font-medium mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-red-500" /> Saved Items
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Pizza Hut - Farmhouse Pizza</li>
                    <li>Biryani by Kilo - Chicken Biryani</li>
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
