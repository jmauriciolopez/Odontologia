import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/auth-context';
import { AppNavigator } from './src/navigation/app-navigator';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
