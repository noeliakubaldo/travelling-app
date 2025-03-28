import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import FlightCard from "@/components/FlightCard";
import Colors from "@/constants/Colors";
import CustomText from '@/components/CustomText';

export default function FlightsScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const API_URL = "http://localhost:3000/api/flights";

  const numColumns = useMemo(() => {
    if (screenWidth < 600) return 2;
    if (screenWidth < 900) return 3;
    return 4;
  }, [screenWidth]);

  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    const dimensionHandler = Dimensions.addEventListener('change', updateWidth);

    return () => {
      dimensionHandler.remove();
    };
  }, []);

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
    flight.destinationAirport?.city?.toLowerCase().includes(search.toLowerCase())
  );

  const calculateCardWidth = () => {
    const horizontalPadding = 32;
    const spacing = 16;
    return (screenWidth - horizontalPadding - (numColumns - 1) * spacing) / numColumns;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Image 
            source={require('@/assets/images/t-logo.png')} 
            style={styles.logo} 
          />
          
          <View style={styles.authContainer}>
            <TouchableOpacity onPress={() => router.push("/login")}> 
              <CustomText style={styles.loginButton}>Iniciar sesión</CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <CustomText style={styles.registerButton}>Registrarse</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <CustomText style={styles.header}>Buscador de Vuelos</CustomText>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vuelos..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />

        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primaryflightcard} />
          ) : error ? (
            <CustomText style={styles.errorText}>{error}</CustomText>
          ) : (
            <FlatList
              key={`flatlist-${numColumns}`}
              data={filteredFlights}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }) => (
                <FlightCard
                  flight={item}
                  onPress={() => router.push(`../flight-details/${item.id}`)}
                  width={calculateCardWidth()}
                />
              )}
              numColumns={numColumns}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryflightcard,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  safe: {
    flex: 1,
    backgroundColor: Colors.secondaryflightcard,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  logo: {
    width: 140,
    height: 50,
    resizeMode: "contain",
  },
  authContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButton: {
    backgroundColor: Colors.primaryflightcard,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "600",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: Colors.primaryflightcard,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    color: Colors.primaryflightcard,
    fontWeight: "600",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryflightcard,
    marginBottom: 10,
    textAlign: "left",
  },
  searchInput: {
    backgroundColor: Colors.tertiaryflightcard,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    marginBottom: 20,
    gap: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});