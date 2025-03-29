import { View, Text, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://localhost:3000/api/reservations';

type Reservation = {
  id: number;
  flight: {
    airline: string;
    departureAirport: { name: string };
    destinationAirport: { name: string };
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
      onUpdate();  // Refresca la lista
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
      onUpdate();  // Refresca la lista
      setConfirmModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la reserva');
    }
  };

  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>Vuelo: {reservation.flight.airline}</Text>
      <Text>Salida: {reservation.flight.departureAirport.name}</Text>
      <Text>Destino: {reservation.flight.destinationAirport.name}</Text>
      <Text>Fecha: {new Date(reservation.reservation_date).toLocaleDateString()}</Text>
      <Text>Pasajeros: {reservation.passenger_count}</Text>
      <Text>Total: ${reservation.total_price}</Text>
      <Text>Estado: {reservation.status}</Text>

      {/* Botón para Editar */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: 'blue', padding: 5, marginTop: 5 }}>
        <Text style={{ color: 'white' }}>Editar</Text>
      </TouchableOpacity>

      {/* Botón para Eliminar (abre modal de confirmación) */}
      <TouchableOpacity onPress={() => setConfirmModalVisible(true)} style={{ backgroundColor: 'red', padding: 5, marginTop: 5 }}>
        <Text style={{ color: 'white' }}>Eliminar</Text>
      </TouchableOpacity>

      {/* Modal para Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text>Editar número de pasajeros</Text>
            <TextInput 
              value={passengerCount} 
              onChangeText={setPassengerCount} 
              keyboardType="numeric" 
              style={{ borderWidth: 1, padding: 5, marginTop: 10 }}
            />
            <Button title="Guardar" onPress={updateReservation} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal visible={confirmModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ marginBottom: 10 }}>¿Estás seguro de que quieres eliminar esta reserva?</Text>
            <Button title="Sí, eliminar" onPress={deleteReservation} color="red" />
            <Button title="Cancelar" onPress={() => setConfirmModalVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReservationItem;
