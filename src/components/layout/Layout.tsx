import React from 'react';
import { View, ViewProps, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';

interface LayoutProps extends ViewProps {
  children: React.ReactNode;
}

export default function Layout({ children, style, ...props }: LayoutProps) {
  const Container = SafeAreaView;
  
  return (
    <Container 
      style={[styles.container, style]}
      {...props}
    >
      <StatusBar style="dark" />
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
}); 