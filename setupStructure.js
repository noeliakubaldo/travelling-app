const fs = require('fs');

const folders = [
  'src/assets/images',
  'src/assets/fonts',
  'src/components',
  'src/navigation',
  'src/screens',
  'src/services',
  'src/store/actions',
  'src/store/reducers',
  'src/utils'
];

const files = {
  'src/navigation/AppNavigator.tsx': `
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
  'src/screens/HomeScreen.tsx': `
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Bienvenido a Traveling App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
`,
  'src/services/api.ts': `
import axios from 'axios';

const API_URL = 'https://tu-api.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default api;
`
};

// Crear carpetas y archivos
folders.forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

Object.entries(files).forEach(([filePath, content]) => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, content.trim());
});

console.log("✅ Estructura de proyecto creada correctamente.");
