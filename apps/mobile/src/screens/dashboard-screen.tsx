import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../context/auth-context';
import api from '../lib/api';

export const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTurnos = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const response = await api.get('/turnos', { params: { fecha: hoy } });
      setTurnos(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTurnos();
  };

  const renderTurno = ({ item }) => (
    <View style={styles.turnoCard}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {new Date(item.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.pacienteName}>{item.paciente?.apellido}, {item.paciente?.nombre}</Text>
        <Text style={styles.motivoText}>{item.motivo || 'Consulta general'}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.consultorioBadge}>📍 {item.consultorio?.nombre}</Text>
          <Text style={styles.estadoBadge}>{item.estado.toUpperCase()}</Text>
        </div>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hola, {user?.nombre || 'Doc'}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </div>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={turnos}
          renderItem={renderTurno}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay turnos para hoy.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Pacientes')}
      >
        <Text style={styles.fabText}>👥</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  date: {
    fontSize: 14,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 24,
    paddingTop: 0,
  },
  turnoCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  timeContainer: {
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  timeText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  pacienteName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  motivoText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  consultorioBadge: {
    fontSize: 12,
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  estadoBadge: {
    fontSize: 10,
    color: '#94a3b8',
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
  },
});
