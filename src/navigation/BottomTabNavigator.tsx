import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet, Text } from 'react-native';
import { BottomTabParamList } from './types';
import Home from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import TranslateScreen from '../screens/TranslateScreen';
import EduCenterScreen from '../screens/EduCenterScreen';
import HomeScreen from '../screens/HomeScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Tab descriptions
const tabDescriptions = {
  Home: 'Beranda',
  Translate: 'Terjemahan',
  EduCenter: 'Edukasi',
  Profile: 'Profil',
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          height: 80,
          ...styles.shadow,
          borderTopWidth: 0,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 0,
          marginBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: tabDescriptions.Home,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="home" size={24} color={color} />
              {focused && <View style={styles.indicator} />}
              <Text style={[styles.tabDescription, { color: focused ? Colors.primary : '#8E8E93' }]}>
                Menu utama
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Translate"
        component={TranslateScreen}
        options={{
          tabBarLabel: tabDescriptions.Translate,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={24} color={color} />
              {focused && <View style={styles.indicator} />}
              <Text style={[styles.tabDescription, { color: focused ? Colors.primary : '#8E8E93' }]}>
                Cari arti kata
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="EduCenter"
        component={EduCenterScreen}
        options={{
          tabBarLabel: tabDescriptions.EduCenter,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="language" size={24} color={color} />
              {focused && <View style={styles.indicator} />}
              <Text style={[styles.tabDescription, { color: focused ? Colors.primary : '#8E8E93' }]}>
                Materi belajar
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: tabDescriptions.Profile,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={24} color={color} />
              {focused && <View style={styles.indicator} />}
              <Text style={[styles.tabDescription, { color: focused ? Colors.primary : '#8E8E93' }]}>
                Akun anda
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  indicator: {
    position: 'absolute',
    bottom: 24,
    width: 25,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  tabDescription: {
    fontSize: 8,
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 2,
  }
}); 