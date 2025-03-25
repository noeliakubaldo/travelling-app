import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router'; // 👈 Importación necesaria

export default function RegisterScreen() {
  const router = useRouter(); // 👈 Inicializa el router

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <Text style={styles.subtitle}>Crearse una cuenta es gratis</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        placeholder="Tu nombre"
        placeholderTextColor="#999"
        style={styles.input}
        />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        placeholder="youremail@yahoo.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        style={styles.input}
        />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        placeholder="********"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        />
        
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={styles.or}>─  O  ─</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialBtn}><Text>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><Text>X</Text></TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        ¿Ya tienes una cuenta?{' '}
        <Text style={styles.loginLink} onPress={() => router.push('/login')}>
            Iniciar sesión
        </Text>
        </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f9ff',
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: '#eaf3ff',
      borderRadius: 30,
      padding: 20,
      width: '100%',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#468cd1',
      marginBottom: 8,
    },
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
    input: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 12,
    },
    registerButton: {
      backgroundColor: '#468cd1',
      padding: 15,
      borderRadius: 30,
      marginTop: 15,
      alignItems: 'center',
    },
    registerButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    divider: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      width: '100%',
      marginVertical: 20,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    socialBtn: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
    },
    footerText: {
        color: '#888',
        textAlign: 'center',
    },
    loginLink: {
      fontWeight: 'bold',
      color: '#468cd1',
    },
    or: { textAlign: 'center', color: '#888', marginVertical: 10 },
  });
  
  