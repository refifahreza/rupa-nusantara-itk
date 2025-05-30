import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import './src/utils/GlobalStyles';

// Inject Tailwind styles for web (including DaisyUI)
if (Platform.OS === 'web') {
  // @ts-ignore
  import('./tailwind.css');
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
