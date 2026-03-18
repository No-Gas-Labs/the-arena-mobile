import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, BackHandler } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initialization (fonts, assets, etc.)
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Let the default back behavior work
      // This just prevents crashes on Android
      return false;
    });

    return () => backHandler.remove();
  }, []);

  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#050812', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator size="large" color="#00d9ff" />
        <Text style={{ color: '#00d9ff', marginTop: 12, fontSize: 14 }}>
          Loading THE ARENA...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#050812',
          },
          headerTintColor: '#00d9ff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="lab" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="publish" />
      </Stack>
      <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
