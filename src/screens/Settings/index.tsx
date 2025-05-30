import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../components/layout/Layout';
import Text from '../../components/common/Text';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <Layout>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text variant="h2" className="ml-4">Settings</Text>
      </View>
      
      <View className="p-4">
        <Text variant="h3" className="mb-4">App Settings</Text>
        
        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
          <Ionicons name="person-outline" size={20} color="#3498db" />
          <Text className="ml-3">Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
          <Ionicons name="notifications-outline" size={20} color="#3498db" />
          <Text className="ml-3">Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
          <Ionicons name="color-palette-outline" size={20} color="#3498db" />
          <Text className="ml-3">Appearance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
          <Ionicons name="help-circle-outline" size={20} color="#3498db" />
          <Text className="ml-3">Help & Support</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
} 