import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/Colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

type Flight = {
  id: number;
  airline: string;
  departure_airport_id: number;
  destination_airport_id: number;
  departure_datetime: string;
  arrival_datetime: string;
  price: string;
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

type FlightCardProps = {
  flight: Flight;
  onPress: () => void;
};

export default function FlightCard({ flight, onPress }: FlightCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: flight.image_url }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.destinationText}>
          {flight.destinationAirport.city} - {flight.destinationAirport.country}
        </Text>
        <Text style={styles.originText}>
          Partiendo desde {flight.departureAirport.city}
        </Text>
        <Text style={styles.priceText}>${flight.price} por persona</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 10,
    overflow: "hidden",
    width: CARD_WIDTH,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevación para Android
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardContent: {
    padding: 10,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  originText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 14,
    color: "#777",
  },
});
