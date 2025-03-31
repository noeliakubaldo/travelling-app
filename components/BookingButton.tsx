import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { API_URL } from '@env';

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

  const reservation_detail_url = `${API_URL}/api/reservations`;

  const handleBookFlight = async () => {
    // Optional pre-booking callback
    onBeforeBooking?.();
    setIsBooking(true);

    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
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
                router.replace("/login");
              }
            }
          ]
        );
        return;
      }

      const bookingData = {
        flight_id: flight.id,
        passenger_count: passengerCount,
        status: "pendiente"
      };

      const response = await fetch(reservation_detail_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('No se pudo realizar la reserva');
      }

      const bookingResult = await response.json();

      onBookingSuccess?.(bookingResult.bookingId);

      Alert.alert(
        "Reserva Exitosa",
        `Tu reserva para ${passengerCount} pasajero(s) ha sido confirmada.\n` +
        `Vuelo: ${flight.airline}\n` +
        `Ruta: ${flight.departureAirport?.city} - ${flight.destinationAirport?.city}\n` +
        `Código de reserva: ${bookingResult.bookingId}`,
        [{
          text: "Ver Vuelos",
          onPress: () => {
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

  return (
    <View style={styles.fullWidthContainer}>
      <TouchableOpacity
        style={styles.fullWidthButton}
        onPress={handleBookFlight}
        disabled={isBooking}
      >
        {isBooking ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.bookButtonText}>Reservar Vuelo</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fullWidthContainer: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 0,
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: Colors.primaryflightcard,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingButton;
