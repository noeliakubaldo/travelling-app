import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';

type BookingButtonProps = {
  flight: {
    id: number;
    price?: number;
    airline?: string;
    departureAirport?: { city?: string };
    destinationAirport?: { city?: string };
  };
  passengerCount: number;
  onBeforeBooking?: () => void;
  onBookingSuccess?: (bookingId: string) => void;
};

export const BookingButton: React.FC<BookingButtonProps> = ({
  flight, 
  passengerCount, 
  onBeforeBooking,
  onBookingSuccess
}) => {
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);

  const handleBookFlight = async () => {
    // Optional pre-booking callback
    onBeforeBooking?.();
    setIsBooking(true);

    try {
      // Retrieve auth token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');

      // Check if user is logged in (has a valid token)
      if (!token) {
        // Log to console when user is not logged in
        console.log('Usuario no logueado: No se puede realizar la reserva');

        Alert.alert(
          "Iniciar Sesión",
          "Debes iniciar sesión para realizar una reserva.",
          [
            { text: "Cancelar", style: "cancel", onPress: () => setIsBooking(false) },
            { 
              text: "Iniciar Sesión", 
              onPress: () => {
                setIsBooking(false);
                // Use replace to avoid navigation stack issues
                router.replace("/login");
              }
            }
          ]
        );
        return;
      }

      // Prepare booking data
      const bookingData = {
        flight_id: flight.id,
        passenger_count: passengerCount,
        status: "pendiente"
      };

      // Send booking request to backend
      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the request
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('No se pudo realizar la reserva');
      }

      const bookingResult = await response.json();

      // Optional success callback
      onBookingSuccess?.(bookingResult.bookingId);

      // Show success alert with navigation
      Alert.alert(
        "Reserva Exitosa", 
        `Tu reserva para ${passengerCount} pasajero(s) ha sido confirmada.\n` +
        `Vuelo: ${flight.airline}\n` +
        `Ruta: ${flight.departureAirport?.city} - ${flight.destinationAirport?.city}\n` +
        `Código de reserva: ${bookingResult.bookingId}`,
        [{ 
          text: "Ver Vuelos", 
          onPress: () => {
            // Use replace to avoid navigation stack issues
            router.replace("/flights");
          }
        }]
      );
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      Alert.alert(
        "Error",
        "No se pudo completar la reserva. Por favor, intenta de nuevo.",
        [{ text: "OK", onPress: () => setIsBooking(false) }]
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (isBooking) {
    return (
      <TouchableOpacity 
        style={styles.bookButton} 
        disabled={true}
      >
        <ActivityIndicator color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.bookButton} 
      onPress={handleBookFlight}
    >
      <Text style={styles.bookButtonText}>Reservar Vuelo</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookButton: {
    backgroundColor: Colors.primaryflightcard,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingButton;