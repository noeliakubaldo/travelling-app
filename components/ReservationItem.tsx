import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, Image, ImageBackground } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "../constants/Colors";

const API_URL = 'http://localhost:3000/api/reservations';

type Reservation = {
  id: number;
  flight: {
    airline: string;
    departureAirport: { name: string };
    destinationAirport: { name: string };
    image_url: string;
  };
  reservation_date: string;
  passenger_count: number;
  total_price: number;
  status: string;
};

type Props = {
  reservation: Reservation;
  onUpdate: () => void;
};

const ReservationItem: React.FC<Props> = ({ reservation, onUpdate }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [passengerCount, setPassengerCount] = useState<string>(reservation.passenger_count.toString());

  const updateReservation = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/${reservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ passenger_count: Number(passengerCount) }),
      });

      if (!response.ok) throw new Error('Error al actualizar la reserva');

      Alert.alert('Éxito', 'Reserva actualizada correctamente');
      onUpdate();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la reserva');
    }
  };

  const deleteReservation = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/${reservation.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar la reserva');

      Alert.alert('Éxito', 'Reserva eliminada correctamente');
      onUpdate();
      setConfirmModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la reserva');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return Colors.success;
      case 'pendiente':
        return '#FF9800';
      case 'cancelado':
        return Colors.danger;
      default:
        return Colors.primary;
    }
  };

  const departureCity = reservation.flight.departureAirport.name;
  const destinationCity = reservation.flight.destinationAirport.name;

  return (
    <View style={styles.card}>
      <View style={styles.cardBanner}>
        <View style={styles.overlay}>
          <ImageBackground 
            source={{ uri: reservation.flight.image_url }}
            style={styles.bannerImage}
            resizeMode='cover'
          />
        </View>

        <View style={styles.bannerContent}>
          <View style={styles.bannerHeader}>
            <View style={styles.airlineContainer}>
              <Text style={styles.airlineName}>{reservation.flight.airline}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                <Text style={styles.statusText}>{reservation.status}</Text>
              </View>
            </View>
            <Text style={styles.price}>${reservation.total_price}</Text>
          </View>

          <View style={styles.bannerRoute}>
            <Text style={styles.bannerCity}>{departureCity}</Text>
            <View style={styles.bannerArrow}>
              <Text style={styles.arrowIcon}>✈</Text>
            </View>
            <Text style={styles.bannerCity}>{destinationCity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoDetail}>
            <Text style={styles.infoLabel}>Salida</Text>
            <Text style={styles.infoValue}>{reservation.flight.departureAirport.name}</Text>
          </View>
          <View style={styles.infoDetail}>
            <Text style={styles.infoLabel}>Destino</Text>
            <Text style={styles.infoValue}>{reservation.flight.destinationAirport.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoDetail}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>{new Date(reservation.reservation_date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoDetail}>
            <Text style={styles.infoLabel}>Pasajeros</Text>
            <Text style={styles.infoValue}>{reservation.passenger_count}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setConfirmModalVisible(true)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar número de pasajeros</Text>
            <TextInput
              value={passengerCount}
              onChangeText={setPassengerCount}
              keyboardType="numeric"
              style={styles.textInput}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={updateReservation}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal visible={confirmModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Estás seguro de que quieres eliminar esta reserva?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={deleteReservation}>
                <Text style={styles.buttonText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.tertiaryflightcard,
    borderRadius: 16,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardBanner: {
    height: 140,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  airlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  airlineName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bannerRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerCity: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bannerArrow: {
    paddingHorizontal: 20,
  },
  arrowIcon: {
    color: 'white',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardContent: {
    padding: 16,
    backgroundColor: Colors.tertiaryflightcard,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoDetail: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: Colors.primaryflightcard,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: "#55cfad",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.secondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: Colors.gray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
});



export default ReservationItem;
