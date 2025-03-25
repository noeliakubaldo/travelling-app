import React from 'react';
import { View, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChabotScreen() {
  const { width, height } = useWindowDimensions();
  
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          src="https://storage.googleapis.com/landbot.online/v3/H-2845872-X5WL2NSLP11HCP1L/index.html"
          width={width}
          height={height}
          style={{ border: 'none' }}
        />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: 'https://storage.googleapis.com/landbot.online/v3/H-2845872-X5WL2NSLP11HCP1L/index.html' }}
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
