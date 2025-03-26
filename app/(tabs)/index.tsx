import { useEffect, useRef } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const hasNavigated = useRef(false); // 🔒 asegura que solo se redirija una vez

  useEffect(() => {
    if (rootNavigationState?.key && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace('/(tabs)/flights');
    }
  }, [rootNavigationState]);

  return null;
}
