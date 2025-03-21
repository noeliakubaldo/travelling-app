import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FlightCard from "../../components/FlightCard";
import Colors from "../../constants/Colors";

export default function FlightsScreen() {
    const [search, setSearch] = useState("");
    const [flights, setFlights] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(""); 

    const API_URL = "https://test-travell.azurewebsites.net/api/flights";

    useEffect(() => {
        async function fetchFlights() {
            setLoading(true);
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setFlights(data);
            } catch (err) {
                setError("Error fetching flights");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchFlights();
    }, []);

    const filteredFlights = flights.filter((flight: any) =>
        flight.destinationAirport.city
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    

      return (
        <View style={styles.container}>
          <Text style={styles.header}>Buscador de Vuelos</Text>
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
                  onPress={() => {
                    // pantalla de navegacion detalle del vuelo
                  }}
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
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.primaryflightcard,
        marginBottom: 10,
        textAlign: "center",
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


