import { Tabs, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { AppContext } from '@/context/AppContext';

export default function TabLayout() {
  const router = useRouter();
  const context = useContext(AppContext);
  const { user } = context;
  useEffect(() => {
    if(!user) {
      router.navigate("/auth/login")
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
