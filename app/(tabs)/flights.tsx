import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import FlightCard from "@/components/FlightCard";
import Colors from "@/constants/Colors";

export default function FlightsScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3000/api/flights";

  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setFlights(data);
      } catch (err) {
        setError("Error al obtener vuelos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter((flight: any) =>
    flight.destinationAirport?.city
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top bar con título y botones */}
      <View style={styles.topBar}>
        <Text style={styles.header}>Buscador de Vuelos</Text>
        <View style={styles.authButtons}>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginButton}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerButton}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar vuelos..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primaryflightcard} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredFlights}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <FlightCard
              flight={item}
              onPress={() => router.push(`../flight-details/${item.id}`)}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryflightcard,
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryflightcard,
  },
  authButtons: {
    flexDirection: "row",
    gap: 10,
  },
  loginButton: {
    backgroundColor: Colors.primaryflightcard,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: "#fff",
    fontWeight: "600",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: Colors.primaryflightcard,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: Colors.primaryflightcard,
    fontWeight: "600",
    marginLeft: 10,
  },
  searchInput: {
    backgroundColor: Colors.tertiaryflightcard,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
