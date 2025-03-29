import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar pantallas
import FlightsScreen from '@/app/(tabs)/flights';
import StatsScreen from '@/app/(tabs)/stats';
import ChatbotScreen from '@/app/(tabs)/chatbot';
import ReservationScreen from '@/app/(tabs)/reservation';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// 🔹 Componente del botón de menú en el header
function CustomHeader() {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <MaterialCommunityIcons name="menu" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Pantalla principal con autenticación y Drawer Navigation
export default function Layout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" options={{ headerShown: false }}>
        {() => <BottomTabs isAuthenticated={isAuthenticated} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

// 🔽 Configuración de las pestañas inferiores
function BottomTabs({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#007AFF',
        headerShown: false, // Oculta el header superior en las pestañas
      }}
    >
      <Tab.Screen
        name="Flights"
        component={FlightsScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="airplane" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="face-agent" size={24} color={color} />
          ),
        }}
      />
      {isAuthenticated && (
        <Tab.Screen
          name="Reservation"
          component={ReservationScreen}
          options={{
            title: 'Reservas',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-check" size={24} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
