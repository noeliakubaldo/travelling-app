import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';

// 🔑 Coloca tu API Key aquí directamente (¡No recomendado para producción!)
const GEMINI_API_KEY = 'AIzaSyBIwvq0seBH9LdjcZGvRUP7rb81ct1zjxk';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const AiChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const response = await axios.post(API_URL, {
        contents: updatedMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model", // Gemini usa "user" y "model"
          parts: [{ text: msg.text }],
        })),
      });

      const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se obtuvo respuesta.";
      setMessages((prevMessages) => [...prevMessages, { role: "gemini", text: replyText }]);
    } catch (error) {
      console.error("Error en la API:", error);
      setMessages((prevMessages) => [...prevMessages, { role: "gemini", text: "Hubo un error al obtener la respuesta." }]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal', color: msg.role === 'user' ? '#007bff' : '#28a745' }}>
              {msg.role === 'user' ? 'Tú: ' : 'Gemini: '}
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Escribe tu pregunta..."
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 }}
      />
      <Button title="Enviar" onPress={sendMessage} color="#007bff" />
    </View>
  );
};

export default AiChat;
