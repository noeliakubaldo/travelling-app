import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlightDetailCard from "../../components/FlightDetailCard";
import BookingButton from "../../components/BookingButton"; // Importa el nuevo componente

type Flight = {
  id: number;
  airline?: string;
  departure_datetime?: string;
  arrival_datetime?: string;
  price?: number;
  duration?: string;
  image_url?: string;
  departureAirport?: {
    city?: string;
    country?: string;
  };
  destinationAirport?: {
    city?: string;
    country?: string;
  };
};

export default function FlightDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [flight, setFlight] = useState<Flight | undefined>(undefined);
  const [userId, setUserId] = useState<number | null>(null);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAndFlight() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user ID
        const storedUserId = await AsyncStorage.getItem("user_id");
        setUserId(storedUserId ? Number(storedUserId) : null);

        // Validate flightId
        if (!id) {
          throw new Error("No flight ID was provided. Cannot fetch flight details.");
        }

        // Fetch flight data
        const response = await fetch(`http://localhost:3000/api/flights/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const flightData: Flight = await response.json();
        console.log("Flight Data from API:", flightData);
        setFlight(flightData);
      } catch (error) {
        console.error("Error fetching flight data:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        
        Alert.alert(
          "Error",
          errorMessage || "No se pudo cargar la información del vuelo. Por favor, intente de nuevo.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserAndFlight();
  }, [id]);

  const incrementPassengers = () => {
    if (passengerCount < 10) {
      setPassengerCount(prev => prev + 1);
    } else {
      Alert.alert(
        "Límite de pasajeros",
        "No se pueden seleccionar más de 10 pasajeros por reserva."
      );
    }
  };

  const decrementPassengers = () => {
    if (passengerCount > 1) {
      setPassengerCount(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlightDetailCard 
          flight={flight}
          isLoading={isLoading}
          showPassengerControls={true}
          passengerCount={passengerCount}
          onIncrementPassengers={incrementPassengers}
          onDecrementPassengers={decrementPassengers}
        />
        {flight && (
          <BookingButton 
            flight={flight}
            passengerCount={passengerCount}
            onBeforeBooking={() => {
              console.log('Iniciando reserva...');
            }}
            onBookingSuccess={(bookingId) => {
              console.log(`Reserva exitosa: ${bookingId}`);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
