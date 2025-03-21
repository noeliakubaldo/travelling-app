import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import VueloDetalle from '../../components/VueloDetalle';
import Colors from '../../constants/Colors';

type Flight = {
  id: number;
  airline: string;
  departureAirport: { city: string; country: string };
  destinationAirport: { city: string; country: string };
  duration: string;
  price: string;
  image_url: string;
  rating: string;
  description: string;
  includes: string[];
};

export default function InformacionScreen() {
  const { id } = useLocalSearchParams();
  const [vuelo, setVuelo] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState(1);

  const fetchDestinoById = async (id: string) => {
    try {
      const response = await fetch(`https://tu-api.com/api/destinos/${id}`);
      const data = await response.json();
      setVuelo(data);
    } catch (err) {
      console.error('Error:', err);
      setVuelo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDestinoById(id.toString());
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Cargando información...</Text>
      </View>
    );
  }

  if (!vuelo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el vuelo.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <VueloDetalle vuelo={vuelo} passengers={passengers} setPassengers={setPassengers} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: Colors.danger, textAlign: "center", marginTop: 40 },
});
