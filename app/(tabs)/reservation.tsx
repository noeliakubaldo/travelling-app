import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReservationItem from '../../components/ReservationItem';

const API_URL = 'http://localhost:3000/api/reservations';

type Reservation = {
  id: number;
  flight: {
    airline: string;
    departureAirport: { name: string };
    destinationAirport: { name: string };
  };
  reservation_date: string;
  passenger_count: number;
  total_price: number;
  status: string;
};

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Debes iniciar sesión o registrarte.');
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data: Reservation[] = await response.json();
      setReservations(data);
    } catch (err) {
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  const handleEdit = async (id: number, passengerCount: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Asegurar consistencia
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ passenger_count: passengerCount })
      });
      await fetchReservations(); // Recargar reservas después de editar
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la reserva');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Asegurar consistencia
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchReservations(); // Recargar reservas después de eliminar
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la reserva');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Mis Reservas</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReservationItem reservation={item} onUpdate={fetchReservations} />
        )}
      />
    </View>
  );
}