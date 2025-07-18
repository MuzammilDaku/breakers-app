import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { useAppStore } from "@/context/appStore";
import { FontAwesome6 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  const router = useRouter();
  const user = useAppStore((state) => state?.user);
  const setUser = useAppStore((state) => state.setUser);
  useEffect(() => {
    if (user && user?.date) {
      const userDate = new Date(user.date);
      const today = new Date();
      // Zero out time for accurate day comparison
      userDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - userDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        setUser(null);
        router.replace("/auth/login");
      }
    } else {
        return router.replace("/auth/login");
      
    }
  }, [user]);
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="billings"
        options={{
          title: "Billing",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="money-bill" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="manual-billing"
        options={{
          title: "Manual Billing",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="pencil" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
