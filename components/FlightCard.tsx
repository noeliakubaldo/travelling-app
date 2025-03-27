import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";

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
  image_url?: string;
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
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {flight.image_url && !imageLoadError ? (
        <Image
          source={{ uri: flight.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
          onError={() => setImageLoadError(true)}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>✈️</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.destinationText} numberOfLines={1}>
          {flight.destinationAirport.city} - {flight.destinationAirport.country}
        </Text>
        <Text style={styles.originText} numberOfLines={1}>
          Partiendo desde {flight.departureAirport.city}
        </Text>
        <Text style={styles.priceText}>${flight.price} por persona</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.tertiaryflightcard,
    borderRadius: 10,
    overflow: "hidden",
    width: CARD_WIDTH,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  placeholderImage: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.secondaryflightcard,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: Colors.primaryflightcard,
  },
  cardContent: {
    padding: 10,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryflightcard,
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