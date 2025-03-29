import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FlightsScreen from '@/app/(tabs)/flights';
import StatsScreen from '@/app/(tabs)/stats';
import ChatbotScreen from '@/app/(tabs)/chatbot';
import ReservationScreen from '@/app/(tabs)/reservation';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// 🔹 Componente para el botón del menú lateral
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

// 🔽 Pantalla protegida para reservas
function AuthenticatedReservation() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return isAuthenticated ? <ReservationScreen /> : null;
}

// 🔽 Definimos las pestañas inferiores
function BottomTabs() {
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
      <Tab.Screen
        name="Reservation"
        component={AuthenticatedReservation}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-check" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 🔽 Definimos el Drawer con la navegación lateral
export default function Layout() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerLeft: () => <CustomHeader />, // Agrega el botón del menú en el header
      }}
    >
      {/* Pantalla principal con Bottom Tabs dentro del Drawer */}
      <Drawer.Screen name="Home" component={BottomTabs} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Flights" component={FlightsScreen} options={{ title: 'Vuelos' }} />
      <Drawer.Screen name="Stats" component={StatsScreen} options={{ title: 'Estadísticas' }} />
      <Drawer.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Chatbot' }} />
      <Drawer.Screen name="Reservation" component={AuthenticatedReservation} options={{ title: 'Reservas' }} />
    </Drawer.Navigator>
  );
}