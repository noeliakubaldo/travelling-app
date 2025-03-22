import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

type Flight = {
  id: number;
  airline: string;
  departure_airport_id: number;
  destination_airport_id: number;
  departure_datetime: string;
  arrival_datetime: string;
  price: number;
  image_url: string;
  departureAirport: {
    id: number;
    name: string;
    country: string;
    city: string;
  };
  destinationAirport: {
    id: number;
    name: string;
    country: string;
    city: string;
  };
  duration: string;
};

export default function FlightDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:3000/api/flights";

  useEffect(() => {
    async function fetchFlight() {
      try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
          console.error("Error en la respuesta:", response.status);
          setFlight(null);
          return;
        }
        const data = await response.json();
        setFlight(data);
      } catch (error) {
        console.error("Error fetching flight:", error);
        setFlight(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchFlight();
  }, [id]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  if (!flight) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el vuelo.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: flight.image_url }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{flight.destinationAirport.city} - {flight.destinationAirport.country}</Text>
          <Text style={styles.subtitle}>{flight.destinationAirport.name}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>✈️ {flight.airline}</Text>
        <Text style={styles.detailText}>⏳ Duración: {flight.duration}</Text>
        <Text style={styles.detailText}>💰 Precio: ${flight.price}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  card: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 250,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
  },
  iconsContainer: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 18,
    color: Colors.danger,
  },
});