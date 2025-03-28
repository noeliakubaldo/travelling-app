import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Alert } from 'react-native';
import { ReservationService } from '../src/services/reservationService'; // Ajusta la ruta según tu estructura

interface Airport {
  id: number;
  name: string;
}

interface Flight {
  id: number;
  airline: string;
  price: number;
  departure_datetime: string;
  arrival_datetime: string;
  departureAirport: Airport;
  destinationAirport: Airport;
  image_url?: string;
}

interface Reservation {
  id: number;
  user_id: number;
  flight_id: number;
  reservation_date: string;
  passenger_count: number;
  total_price: number;
  status: 'pendiente' | 'confirmado' | 'cancelado';
  flight?: Flight;
  duration?: string;
}

interface ReservationItemProps {
  reservation: Reservation;
  onUpdateReservation: (updatedReservation: Reservation) => void;
  onDeleteReservation: (reservationId: number) => void;
}

const ReservationItem: React.FC<ReservationItemProps> = ({ 
  reservation, 
  onUpdateReservation,
  onDeleteReservation
}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedPassengerCount, setEditedPassengerCount] = useState(reservation.passenger_count);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirmPayment = async () => {
    try {
      setIsLoading(true);
      const confirmedReservation = await ReservationService.confirmReservation(reservation.id);
      onUpdateReservation(confirmedReservation);
    } catch (error) {
      Alert.alert('Error', 'No se pudo confirmar la reservación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres cancelar esta reservación?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await ReservationService.deleteReservation(reservation.id);
              onDeleteReservation(reservation.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la reservación');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditSubmit = async () => {
    try {
      setIsLoading(true);
      const updatedReservation = await ReservationService.updateReservation(reservation.id, {
        passenger_count: editedPassengerCount
      });
      onUpdateReservation(updatedReservation);
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la reservación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {reservation.flight?.image_url && (
        <Image 
          source={{ uri: reservation.flight.image_url }} 
          style={styles.flightImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.reservationInfo}>
        <Text style={styles.title}>
          {reservation.flight?.airline}
        </Text>
        <View style={styles.routeContainer}>
          <Text style={styles.airportCode}>
            {reservation.flight?.departureAirport?.name || 'N/A'}
          </Text>
          <Text style={styles.routeArrow}>→</Text>
          <Text style={styles.airportCode}>
            {reservation.flight?.destinationAirport?.name || 'N/A'}
          </Text>
        </View>
        
        <Text style={styles.detailText}>
          Salida: {formatDate(reservation.flight?.departure_datetime || new Date().toISOString())}
        </Text>
        <Text style={styles.detailText}>
          Llegada: {formatDate(reservation.flight?.arrival_datetime || new Date().toISOString())}
        </Text>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.detailText}>Pasajeros: {reservation.passenger_count}</Text>
          <Text style={styles.detailText}>
            Precio Total: ${(reservation.total_price || 0).toFixed(2)}
          </Text>
          <Text style={[
            styles.statusText, 
            reservation.status === 'confirmado' ? styles.confirmedStatus : 
            reservation.status === 'cancelado' ? styles.canceledStatus : 
            styles.pendingStatus
          ]}>
            {reservation.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => setEditModalVisible(true)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
        
        {reservation.status !== 'confirmado' && (
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handleConfirmPayment}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Pagar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Reservación</Text>
            <Text style={styles.modalSubtitle}>
              {reservation.flight?.airline} - {reservation.flight?.departureAirport?.name} → {reservation.flight?.destinationAirport?.name}
            </Text>
            
            <View style={styles.passengerEditContainer}>
              <TouchableOpacity 
                style={styles.passengerButton}
                onPress={() => setEditedPassengerCount(Math.max(1, editedPassengerCount - 1))}
                disabled={isLoading}
              >
                <Text style={styles.passengerButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.passengerCountText}>{editedPassengerCount}</Text>
              <TouchableOpacity 
                style={styles.passengerButton}
                onPress={() => setEditedPassengerCount(editedPassengerCount + 1)}
                disabled={isLoading}
              >
                <Text style={styles.passengerButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setEditModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton} 
                onPress={handleEditSubmit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  flightImage: {
    width: '100%',
    height: 150,
  },
  reservationInfo: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  airportCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  routeArrow: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#999',
  },
  detailText: {
    color: '#666',
    marginBottom: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusText: {
    fontWeight: 'bold',
  },
  confirmedStatus: {
    color: 'green',
  },
  canceledStatus: {
    color: 'red',
  },
  pendingStatus: {
    color: 'orange',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  payButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  passengerEditContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  passengerButton: {
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerButtonText: {
    color: 'white',
    fontSize: 24,
  },
  passengerCountText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalSaveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
});


export default ReservationItem;