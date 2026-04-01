import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/auth-context';
import { LoginScreen } from '../screens/login-screen';
import { DashboardScreen } from '../screens/dashboard-screen';
import { PacientesScreen } from '../screens/pacientes-screen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) return null; // O un Splash Screen

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: '#111827' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {token ? (
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen} 
            options={{ title: 'Agenda Hoy' }}
          />
          <Stack.Screen 
            name="Pacientes" 
            component={PacientesScreen} 
            options={{ title: 'Mis Pacientes' }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
