import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import Colors from '../constants/Colors';

type UserRole = 'student' | 'teacher' | 'any';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * A component that protects routes requiring authentication.
 * If user is not authenticated, shows login prompt or fallback UI.
 * Can also check for specific user roles.
 */
const ProtectedRoute = ({ 
  children, 
  fallback, 
  requiredRole = 'any' 
}: ProtectedRouteProps) => {
  const navigation = useNavigation();
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = () => {
    const isAuth = isAuthenticated();
    
    if (isAuth && requiredRole !== 'any') {
      // Check if user has required role
      const user = getCurrentUser();
      const hasRole = user?.role === requiredRole;
      setAuthorized(hasRole);
    } else {
      setAuthorized(isAuth);
    }
    
    setAuthChecked(true);
  };

  if (!authChecked) {
    // Still checking authorization
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!authorized) {
    // User is not authorized - show fallback or default login prompt
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedTitle}>Akses Terbatas</Text>
        <Text style={styles.unauthorizedText}>
          Anda perlu masuk atau mendaftar untuk mengakses halaman ini.
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.registerButtonText}>Daftar</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // User is authorized, render children
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  unauthorizedText: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 8,
  },
  registerButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 14,
  },
});

export default ProtectedRoute; 