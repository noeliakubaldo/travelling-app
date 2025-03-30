import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReservationItem from '../../components/ReservationItem';
import Colors from "../../constants/Colors";

const API_URL = 'http://localhost:3000/api/reservations';

type Reservation = {
  id: number;
  flight: {
    airline: string;
    departureAirport: { name: string };
    destinationAirport: { name: string };
    image_url:string;
  };
  reservation_date: string;
  passenger_count: number;
  total_price: number;
  status: string;
};

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
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
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
  };

  const navigateToFlightSearch = () => {
    router.push('/flights');
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Algo salió mal</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchReservations}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Reservas</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={navigateToFlightSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.searchButtonText}>Buscar Vuelos</Text>
          </TouchableOpacity>
        </View>
        
        {reservations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No tienes reservas activas</Text>
            <Text style={styles.emptyStateText}>Reserva tu primer vuelo para comenzar a disfrutar de nuestros servicios</Text>
            <TouchableOpacity 
              style={styles.newReservationButton}
              onPress={navigateToFlightSearch}
              activeOpacity={0.7}
            >
              <Text style={styles.newReservationButtonText}>Buscar Vuelos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={reservations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReservationItem reservation={item} onUpdate={fetchReservations} />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={[Colors.primary]} 
                tintColor={Colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryflightcard,
  },
  searchButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryflightcard,
  },
  searchButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F8F9FA',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#5F6368',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primaryflightcard,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#5F6368',
    textAlign: 'center',
    marginBottom: 32,
  },
  newReservationButton: {
    backgroundColor: Colors.primaryflightcard,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  newReservationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
