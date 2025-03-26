import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Inicio de sesión exitoso');
        router.push('/(tabs)/flights');
      } else {
        Alert.alert('Error', data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con el inicio de sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.subtitle}>Por favor, ingrese su cuenta</Text>
      <Text style={styles.label}>Correo</Text>
      <TextInput
        placeholder="youremail@yahoo.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        placeholder="********"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => Alert.alert('Recuperación de contraseña')}>
        <Text style={styles.forgot}>Olvidé la contraseña</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <Text style={styles.or}>─  O  ─</Text>
      <View style={styles.socials}>
        <TouchableOpacity style={styles.socialBtn}><Text>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><Text>X</Text></TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.link}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f9ff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#468cd1', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
  forgot: { textAlign: 'right', marginBottom: 20, color: '#555' },
  button: { backgroundColor: '#468cd1', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  or: { textAlign: 'center', color: '#888', marginVertical: 10 },
  socials: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialBtn: { backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 2, marginHorizontal: 10 },
  registerText: { textAlign: 'center', color: '#444' },
  link: { fontWeight: 'bold', color: '#468cd1' },
  subtitle: {
    color: '#333',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '600',
    color: '#444',
  },
});
