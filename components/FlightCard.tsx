import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";
import CustomText from "@/components/CustomText";

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
  width?: number;
};

export default function FlightCard({ flight, onPress, width }: FlightCardProps) {
  const { width: screenWidth } = Dimensions.get('window');
  
  const cardWidth = width || (screenWidth - 64) / 2;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          width: cardWidth, 
          maxWidth: (screenWidth - 64) / 2 
        }
      ]} 
      onPress={onPress}
    >
      <Image
        source={{ uri: flight.image_url }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <CustomText style={styles.destinationText} numberOfLines={1}>
          {flight.destinationAirport.city} - {flight.destinationAirport.country}
        </CustomText>
        <CustomText style={styles.originText} numberOfLines={1}>
          Partiendo desde {flight.departureAirport.city}
        </CustomText>
        <CustomText style={styles.priceText}>${flight.price} por persona</CustomText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.tertiaryflightcard,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    aspectRatio: 16 / 9,
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