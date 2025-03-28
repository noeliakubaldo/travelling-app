import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    'Poppins-Regular': require('./Poppins-Regular.ttf'),
  });
}
