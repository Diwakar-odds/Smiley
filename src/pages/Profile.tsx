// frontend/src/pages/Profile.tsx
import React, { useEffect, useReducer, useState } from "react";
import { ContentSkeleton } from "../components/ui/SkeletonLoaders";
import { motion } from "framer-motion";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "../types/schema";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  LogOut,
  Moon,
  Sun,
  Heart,
  ShoppingBag,
  Camera,
  ArrowLeft,
  Home,
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


interface OrderItem {
  name?: string;
  quantity: number;
  price?: number;
  menuItemId?: number;  // Changed from string to number
}

interface Order {
  id: number;           // Changed from _id: string to id: number
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;  // ✅ Now using typed enum instead of string
  createdAt: string;
}

interface SavedItem {
  id: string;
  name: string;
}

const initialState: AppState = {
  profile: {
    name: "",
    email: "",
    mobile: "",
    address: "",
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




const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { profile, notifications, darkMode, loading, error } = state;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfileAndOrders = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Fetch user profile
        const userProfile = await fetchUserProfile();
        dispatch({ type: "SET_PROFILE", payload: userProfile });

        // Fetch user orders
        const { data: userOrders } = await client.get<Order[]>("/orders/user");
        console.log('Fetched user orders:', userOrders);
        console.log('First order details:', userOrders?.[0]);
        console.log('First order MenuItems:', userOrders?.[0]?.MenuItems);
        setOrders(userOrders || []);

        // Fetch saved items (replace with real API if available)
        // Placeholder: fetch from /users/saved or similar endpoint
        // const { data: saved } = await client.get<SavedItem[]>("/users/saved");
        // setSavedItems(saved);
        setSavedItems([
          { id: "1", name: "Pizza Hut - Farmhouse Pizza" },
          { id: "2", name: "Biryani by Kilo - Chicken Biryani" },
        ]);
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch profile or orders." });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    };

    loadProfileAndOrders();
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
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Gradient overlay for consistent look */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-pink-100/40 to-yellow-100/60 z-10 pointer-events-none animate-pulse" />
        
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg"
        >
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => navigate('/')}
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-white text-xl font-bold tracking-tight">My Profile</h1>
          
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => navigate('/')}
            aria-label="Go to home"
          >
            <Home className="w-5 h-5" />
          </Button>
        </motion.div>

        <div className="relative z-20 w-full p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center min-h-screen-minus-nav">
          <ContentSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (selectedOrder) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Gradient overlay for consistent look */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-pink-100/40 to-yellow-100/60 z-10 pointer-events-none animate-pulse" />
        
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg"
        >
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => setSelectedOrder(null)}
            aria-label="Go back to profile"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile
          </Button>
          
          <h1 className="text-white text-xl font-bold tracking-tight">Order Details</h1>
          
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => navigate('/')}
            aria-label="Go to home"
          >
            <Home className="w-5 h-5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 w-full h-full p-4 sm:p-8 lg:p-12 font-sans min-h-screen-minus-nav"
          aria-label="Order details content"
        >
          <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Gradient overlay for extra style */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-pink-100/40 to-yellow-100/60 z-10 pointer-events-none animate-pulse" />
      
      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg"
      >
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 transition-colors duration-200"
          onClick={() => navigate('/')}
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        
        <h1 className="text-white text-xl font-bold tracking-tight">My Profile</h1>
        
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 transition-colors duration-200"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <Home className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full h-full p-4 sm:p-8 lg:p-12 font-sans min-h-screen-minus-nav"
        aria-label="Profile main content"
      >
        <Card className="shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-3xl border-0 bg-white/80 backdrop-blur-2xl animate-fadein w-full h-full min-h-screen flex flex-col">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl py-4 px-8 shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            >
              <CardTitle className="flex items-center justify-between text-white text-2xl font-extrabold tracking-tight">
                <span className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-200 animate-bounce" aria-hidden="true" /> Welcome Back
                </span>
                <div className="flex space-x-2">
                  <Button
                    className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow-md hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-transform duration-200 ripple"
                    size="sm"
                    onClick={handleLogoutAll}
                    aria-label="Logout from all devices"
                  >
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" /> Logout All
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold shadow-md hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-transform duration-200 ripple"
                    size="sm"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" /> Logout
                  </Button>
                </div>
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8 sm:p-10 lg:p-12 flex-1 flex flex-col">
            <motion.p
              className="text-center text-gray-700 mb-4 text-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Welcome, <span className="font-semibold text-orange-500">{profile.name}</span> <span className="animate-wave">👋</span>
            </motion.p>

            <motion.div
              className="flex flex-col items-center space-y-3 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
            >
              <div className="relative">
                {profile.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-pink-300 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-red-200 flex items-center justify-center text-gray-500 shadow-lg">
                    <Camera className="w-8 h-8 animate-pulse" aria-hidden="true" />
                  </div>
                )}
                <div className="flex justify-center mt-2 space-x-2">
                  <Button size="sm" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-transform duration-200 ripple">Upload / Change</Button>
                  {profile.profilePic && (
                    <Button size="sm" variant="destructive" className="font-bold shadow hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-transform duration-200 ripple">
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            <Tabs defaultValue="info" className="animate-fadein flex-1 flex flex-col" aria-label="Profile sections">
              <TabsList className="grid grid-cols-5 bg-gradient-to-r from-orange-200 via-pink-200 to-red-200 rounded-xl mb-4">
                <TabsTrigger value="info" className="font-bold text-orange-700 transition-all duration-200 hover:text-pink-600 focus:ring-2 focus:ring-pink-300 focus:outline-none">Profile Info</TabsTrigger>
                <TabsTrigger value="orders" className="font-bold text-pink-700 transition-all duration-200 hover:text-orange-600 focus:ring-2 focus:ring-pink-300 focus:outline-none">My Orders</TabsTrigger>
                <TabsTrigger value="addresses" className="font-bold text-red-700 transition-all duration-200 hover:text-orange-600 focus:ring-2 focus:ring-pink-300 focus:outline-none">Addresses</TabsTrigger>
                <TabsTrigger value="payment" className="font-bold text-orange-700 transition-all duration-200 hover:text-pink-600 focus:ring-2 focus:ring-pink-300 focus:outline-none">Payment</TabsTrigger>
                <TabsTrigger value="settings" className="font-bold text-pink-700 transition-all duration-200 hover:text-orange-600 focus:ring-2 focus:ring-pink-300 focus:outline-none">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="flex-1">
                <div className="space-y-4 mt-4 h-full">
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Full Name"
                    className="rounded-lg border-2 border-orange-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  />
                  <Input
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Email"
                    className="rounded-lg border-2 border-orange-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  />
                  <Input
                    name="mobile"
                    value={profile.mobile}
                    onChange={handleProfileChange}
                    placeholder="Phone (optional)"
                    className="rounded-lg border-2 border-orange-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  />
                  <Input
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="Address"
                    className="rounded-lg border-2 border-orange-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  />
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-transform duration-200 ripple" onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="flex-1">
                <div className="mt-4 space-y-3 h-full overflow-y-auto">
                  {orders.length === 0 ? (
                    <div className="text-center text-gray-500">No orders found.</div>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="p-3 flex items-center justify-between bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 shadow rounded-xl backdrop-blur-md">
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="w-5 h-5 text-pink-500 animate-bounce" />
                          <span className="font-semibold text-orange-700">Order #{order.id} - {order.status}</span>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple" onClick={() => {
                          console.log('Setting selected order:', order);
                          setSelectedOrder(order);
                        }} aria-label={`View details for order #${order.id}`}>View Details</Button>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="flex-1">
                <div className="h-full overflow-y-auto">
                  <AddressManagement />
                </div>
              </TabsContent>

              <TabsContent value="payment" className="flex-1">
                <div className="h-full overflow-y-auto">
                  <PaymentMethodManagement />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="flex-1">
                <div className="mt-4 space-y-6 h-full overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      {darkMode ? <Moon className="text-pink-500 animate-spin" /> : <Sun className="text-orange-400 animate-spin" />}
                      <span className="font-bold">Dark Mode</span>
                    </span>
                    <Switch checked={darkMode} onCheckedChange={(payload) => dispatch({ type: 'SET_DARK_MODE', payload })} />
                  </div>
                  <div className="space-y-2 mt-6">
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
                  <div className="mt-8">
                    <h3 className="font-bold mb-2 flex items-center text-pink-600">
                      <Heart className="w-4 h-4 mr-2 text-pink-500 animate-bounce" /> Saved Items
                    </h3>
                    {savedItems.length === 0 ? (
                      <div className="text-center text-gray-500">No saved items.</div>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {savedItems.map((item) => (
                          <li key={item.id} className="flex items-center justify-between bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 rounded-lg px-4 py-2 shadow hover:scale-105 transition-transform">
                            <span className="font-semibold text-orange-700">{item.name}</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold shadow hover:scale-110 active:scale-95 transition-transform duration-200 ripple"
                                onClick={() => alert(`Reorder placed for ${item.name}!`)}
                                aria-label={`Reorder ${item.name}`}
                              >
                                <ShoppingBag className="w-4 h-4 mr-1" aria-hidden="true" /> Reorder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-pink-400 text-pink-600 font-bold shadow hover:bg-pink-100 hover:scale-110 active:scale-95 transition-transform duration-200 ripple"
                                onClick={() => alert(`${item.name} added to favorites!`)}
                                aria-label={`Add ${item.name} to favorites`}
                              >
                                <Heart className="w-4 h-4 mr-1 text-pink-500" aria-hidden="true" /> Favorite
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-8">
                    <ChangePassword />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Profile;
