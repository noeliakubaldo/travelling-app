import { useEffect, useState } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { loadFonts } from '@/assets/fonts/fonts'; // ajusta según tu estructura

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    });
  }, []);

  if (!fontsLoaded) return null;

  return <Slot />;
}
