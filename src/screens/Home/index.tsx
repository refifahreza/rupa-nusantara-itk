import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../navigation/types';

export default function Home() {
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    // Navigate to the HomeScreen
    navigation.navigate('HomeScreen');
  }, [navigation]);

  return <View />;
} 