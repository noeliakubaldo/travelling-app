import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chabot"
        options={{
          title: 'Chabot',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="face-agent" size={24} color={color} />
          ),
        }}
      />
      {isAuthenticated && (
        <Tabs.Screen
          name="reservation"
          options={{
            title: 'Reservations',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-check" size={24} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
