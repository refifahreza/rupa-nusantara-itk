import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  onReady?: () => void;
}

export default function AppNavigator({ onReady }: AppNavigatorProps) {
  return (
    <NavigationContainer onReady={onReady}>
      <Stack.Navigator
        initialRouteName="BottomTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 