import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
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
    code?: string;
  };
  destinationAirport?: {
    city?: string;
    country?: string;
    code?: string;
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
  onDecrementPassengers,
}: FlightDetailCardProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando información del vuelo...</Text>
      </View>
    );
  }

  if (!flight) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No hay información del vuelo</Text>
      </View>
    );
  }

  const totalPrice = flight.price ? flight.price * passengerCount : 0;
  
  // Format departure time nicely
  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return "No disponible";
    const date = new Date(dateTimeStr);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate}, ${formattedTime}`;
  };

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
        
        {/* Gradient overlay for better text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        
        <View style={styles.overlayInfo}>
          <Text style={styles.overlayCity}>
            {flight.destinationAirport?.city || "Destino Desconocido"}
          </Text>
          <Text style={styles.overlayCountry}>
            {flight.destinationAirport?.country || "País Desconocido"}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        {/* Flight route with visual indicator */}
        <View style={styles.routeContainer}>
          <View style={styles.routeEndpoint}>
            <Text style={styles.cityName}>{flight.departureAirport?.city || "Origen"}</Text>
          </View>
          
          <View style={styles.flightPath}>
            <View style={styles.dottedLine} />
            <View style={styles.airplane}>
              <Text>✈️</Text>
            </View>
          </View>
          
          <View style={styles.routeEndpoint}>
            <Text style={styles.cityName}>{flight.destinationAirport?.city || "Destino"}</Text>
          </View>
        </View>

        <View style={[
          styles.detailsContainer,
          showPassengerControls && styles.detailsContainerWithControls
        ]}>
          <View style={styles.detailColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>✈️</Text>
              <View>
                <Text style={styles.detailLabel}>Aerolínea</Text>
                <Text style={styles.detailValue}>{flight.airline || "No disponible"}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🕒</Text>
              <View>
                <Text style={styles.detailLabel}>Duración</Text>
                <Text style={styles.detailValue}>{flight.duration || "No disponible"}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🗓️</Text>
              <View>
                <Text style={styles.detailLabel}>Salida</Text>
                <Text style={styles.detailValue}>{formatDateTime(flight.departure_datetime)}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🛬</Text>
              <View>
                <Text style={styles.detailLabel}>Llegada</Text>
                <Text style={styles.detailValue}>{formatDateTime(flight.arrival_datetime)}</Text>
              </View>
            </View>
          </View>
        </View>

        {showPassengerControls && (
          <View style={styles.passengerContainer}>
            <View>
              <Text style={styles.passengerLabel}>Pasajeros</Text>
              <View style={styles.passengerControls}>
                <TouchableOpacity
                  style={[styles.passengerButton, passengerCount <= 1 && styles.disabledButton]}
                  onPress={onDecrementPassengers}
                  disabled={passengerCount <= 1}
                >
                  <Text style={styles.passengerButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.passengerCount}>{passengerCount}</Text>
                <TouchableOpacity
                  style={[styles.passengerButton, passengerCount >= 10 && styles.disabledButton]}
                  onPress={onIncrementPassengers}
                  disabled={passengerCount >= 10}
                >
                  <Text style={styles.passengerButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio total</Text>
              <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
              <Text style={styles.pricePer}>/{passengerCount > 1 ? `${passengerCount} pax` : 'pax'}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  card: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 220,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  overlayInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  overlayCity: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlayCountry: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routeEndpoint: {
    alignItems: 'center',
    width: 70,
  },
  airportCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cityName: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  flightPath: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 10,
  },
  dottedLine: {
    height: 2,
    flex: 1,
    borderRadius: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  airplane: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#f0f0f0',
  },
  detailsContainerWithControls: {
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  detailColumn: {
    flex: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#777',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  passengerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  passengerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerButton: {
    backgroundColor: Colors.primaryflightcard, 
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  passengerCount: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
    width: 24,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryflightcard,
  },
  pricePer: {
    fontSize: 12,
    color: Colors.primaryflightcard,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    height: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4285f4', // Matching your existing blue button color
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    height: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e63946',
  },
  placeholderContainer: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});