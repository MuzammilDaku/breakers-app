import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { AppContext } from '@/context/AppContext';

export default function TabLayout() {
  const router = useRouter();
  const context = useContext(AppContext);
  const { user, setUser } = context;
  useEffect(() => {
    if (!user) {
      router.navigate("/auth/login")
    }

    if (user?.date) {
      const userDate = new Date(user.date);
      const today = new Date();
      // Zero out time for accurate day comparison
      userDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - userDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        setUser(null);
        router.navigate("/auth/login")
      }
    }
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}
