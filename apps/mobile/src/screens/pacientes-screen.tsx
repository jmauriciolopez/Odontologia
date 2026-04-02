import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../lib/api';

export const PacientesScreen = () => {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPacientes = async (query = '') => {
    try {
      const response = await api.get('pacientes', { params: { q: query } });
      setPacientes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    fetchPacientes(text);
  };

  const renderPaciente = ({ item }) => (
    <TouchableOpacity style={styles.pacienteCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nombre[0]}{item.apellido[0]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.apellido}, {item.nombre}</Text>
        <Text style={styles.dni}>Documento: {item.documento}</Text>
        <Text style={styles.contact}>📱 {item.telefono || 'Sin teléfono'}</Text>
      </View>
      <Text style={styles.chevron}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar por nombre o DNI..."
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
      ) : (
        <FlatList 
          data={pacientes}
          renderItem={renderPaciente}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No se encontraron pacientes.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchBox: {
    padding: 24,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  list: {
    padding: 24,
    paddingTop: 0,
  },
  pacienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  dni: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  contact: {
    color: '#3b82f6',
    fontSize: 12,
    marginTop: 4,
  },
  chevron: {
    color: '#334155',
    fontSize: 20,
    fontWeight: 'bold',
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 50,
  },
});
