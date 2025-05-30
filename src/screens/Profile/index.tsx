import React from 'react';
import { View } from 'react-native';
import Layout from '../../components/layout/Layout';
import Text from '../../components/common/Text';
import Button from '../../components/common/Button';

export default function ProfileScreen() {
  return (
    <Layout>
      <View className="flex-1 p-4 justify-center">
        <Text variant="h2" className="mb-4 text-center">Profile</Text>
        <Text className="text-center mb-6">
          This is a sample profile screen for the Rupa Nusantara app.
        </Text>
        <Button 
          title="Edit Profile" 
          className="mx-4"
        />
      </View>
    </Layout>
  );
} 