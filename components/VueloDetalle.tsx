// components/VueloDetalle.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type Flight = {
  id: number;
  airline: string;
  departureAirport: { city: string; country: string };
  destinationAirport: { city: string; country: string };
  duration: string;
  price: string;
  image_url: string;
  rating: string;
  description: string;
  includes: string[];
};

type Props = {
  vuelo: Flight;
  passengers: number;
  setPassengers: (val: number) => void;
};

const VueloDetalle = ({ vuelo, passengers, setPassengers }: Props) => {
  return (
    <View>
      <Image source={{ uri: vuelo.image_url }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.city}>{vuelo.destinationAirport.city}, {vuelo.destinationAirport.country}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="airplane-outline" size={18} color={Colors.gray} />
          <Text style={styles.infoText}> {vuelo.airline}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color={Colors.secondary} />
          <Text style={styles.duration}> {vuelo.duration}</Text>
        </View>

        <Text style={styles.description}>{vuelo.description}</Text>

        <Text style={styles.sectionTitle}>Elegir fecha</Text>
        <View style={styles.dateSelector}>
          <TouchableOpacity style={styles.dateOption}>
            <Text style={styles.dateText}>15 Dic - 20 Dic 2023</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateOption}>
            <Text style={styles.dateText}>25 Dic - 30 Dic 2023</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectDateButton}>
            <Text style={styles.selectDateText}>Elegir fecha</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Nro de pasajeros</Text>
        <View style={styles.passengerContainer}>
          <Text style={styles.price}>${vuelo.price} /pax</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => setPassengers(Math.max(1, passengers - 1))}>
              <FontAwesome5 name="minus" size={14} color="black" />
            </TouchableOpacity>
            <Text style={styles.passengerCount}>{passengers}</Text>
            <TouchableOpacity onPress={() => setPassengers(passengers + 1)}>
              <FontAwesome5 name="plus" size={14} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Incluye</Text>
        <View style={styles.includesContainer}>
          {vuelo.includes.map((item, index) => (
            <View key={index} style={styles.includeItem}>
              <MaterialIcons name="check-circle" size={18} color={Colors.primary} />
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.totalPrice}>${parseFloat(vuelo.price) * passengers}</Text>
          <TouchableOpacity style={styles.reserveButton}>
            <Text style={styles.reserveText}>Reservar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VueloDetalle;

const styles = StyleSheet.create({
  image: { width: "100%", height: 300 },
  detailsContainer: { padding: 20 },
  city: { fontSize: 24, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  infoText: { fontSize: 16, color: Colors.gray },
  duration: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14, color: "#444", marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  dateOption: { backgroundColor: Colors.secondary, padding: 10, borderRadius: 8 },
  dateText: { color: "#fff", fontSize: 14 },
  selectDateButton: { backgroundColor: Colors.lightGray, padding: 10, borderRadius: 8 },
  selectDateText: { fontSize: 14, color: "#000" },
  passengerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  price: { fontSize: 18, fontWeight: "bold" },
  counterContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 5, borderRadius: 8 },
  passengerCount: { marginHorizontal: 10, fontSize: 16 },
  includesContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  includeItem: { flexDirection: "row", alignItems: "center", width: "45%", marginVertical: 5 },
  includeText: { fontSize: 14, marginLeft: 5 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, backgroundColor: Colors.secondary, borderRadius: 10, padding: 15 },
  totalPrice: { fontSize: 20, color: "#fff" },
  reserveButton: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10 },
  reserveText: { fontSize: 16, color: "#fff" },
});
