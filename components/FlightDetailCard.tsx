import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import Colors from "../constants/Colors";

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

type FlightDetailCardProps = {
  flight?: Flight;
  isLoading?: boolean;
  showPassengerControls?: boolean;
  passengerCount?: number;
  onIncrementPassengers?: () => void;
  onDecrementPassengers?: () => void;
};

export default function FlightDetailCard({ 
  flight, 
  isLoading = false,
  showPassengerControls = false,
  passengerCount = 1,
  onIncrementPassengers,
  onDecrementPassengers
}: FlightDetailCardProps) {
  if (isLoading) {
    return <Text style={styles.loadingText}>Cargando información del vuelo...</Text>;
  }

  if (!flight) {
    return <Text style={styles.errorText}>No hay información del vuelo</Text>;
  }

  const totalPrice = flight.price ? flight.price * passengerCount : 0;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {flight.image_url ? (
          <Image 
            source={{ uri: flight.image_url }} 
            style={styles.cardImage} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No image available</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.destinationText}>
            ✈️ {flight.destinationAirport?.city || "Desconocido"}, {flight.destinationAirport?.country || "Desconocido"}
          </Text>
          <Text style={styles.originText}>
            Partiendo desde: {flight.departureAirport?.city || "Desconocido"}, {flight.departureAirport?.country || "Desconocido"}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.airlineText}>Aerolínea: {flight.airline || "No disponible"}</Text>
            <Text style={styles.priceText}>💰 ${flight.price?.toLocaleString() ?? 0} por persona</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.durationText}>🕒 Duración: {flight.duration || "No disponible"}</Text>
            <Text style={styles.dateText}>
              Salida: {flight.departure_datetime ? new Date(flight.departure_datetime).toLocaleString() : "No disponible"}
            </Text>
          </View>
        </View>
      </View>

      {showPassengerControls && (
        <View style={styles.passengerSection}>
          <Text style={styles.passengerText}>Número de Pasajeros: {passengerCount}</Text>
          <View style={styles.passengerControls}>
            <Button 
              title="-" 
              onPress={onDecrementPassengers} 
              disabled={passengerCount <= 1}
            />
            <Button 
              title="+" 
              onPress={onIncrementPassengers} 
              disabled={passengerCount >= 10}
            />
          </View>
        </View>
      )}

      {showPassengerControls && (
        <View style={styles.priceSection}>
          <Text style={styles.totalPriceText}>
            Precio Total: ${totalPrice.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.tertiaryflightcard,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  placeholderContainer: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.primary,
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    padding: 20,
  },
  cardContent: {
    padding: 10,
  },
  destinationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryflightcard,
    marginBottom: 5,
  },
  originText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  airlineText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  durationText: {
    fontSize: 14,
    color: "#777",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  passengerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  passengerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passengerControls: {
    flexDirection: 'row',
    gap: 10,
  },
  priceSection: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});