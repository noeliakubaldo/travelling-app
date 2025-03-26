import React, { useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatbotScreen() {
  const chatbotUrl = 'https://storage.googleapis.com/landbot.online/v3/H-2845872-X5WL2NSLP11HCP1L/index.html';
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe src={chatbotUrl} style={styles.iframe} title="Chatbot"></iframe>
      ) : (
        <>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <WebView 
            source={{ uri: chatbotUrl }} 
            style={styles.webview} 
            javaScriptEnabled={true} 
            domStorageEnabled={true} 
            originWhitelist={['*']} 
            onLoad={() => setLoading(false)}
            onError={() => alert('Error al cargar el chatbot')}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
  iframe: {
    width: '100%',
    height: '100%',
  },
});
