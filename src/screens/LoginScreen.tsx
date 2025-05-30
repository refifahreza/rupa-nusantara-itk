import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Alert,
  Image
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { loginUser, saveUserSession, isAuthenticated } from '../utils/auth';

// Define navigation param types
type RootStackParamList = {
  Login: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
  LanguageOfficeDashboard: undefined;
  Home: undefined;
  Main: undefined;
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const userRole = localStorage.getItem('user') 
          ? JSON.parse(localStorage.getItem('user')!).role 
          : null;
          
        if (userRole === 'student') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'StudentDashboard' }],
          });
        } else if (userRole === 'teacher') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'TeacherDashboard' }],
          });
        } else if (userRole === 'languageOffice') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LanguageOfficeDashboard' }],
          });
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        alert('Email dan password harus diisi');
      } else {
        Alert.alert('Error', 'Email dan password harus diisi');
      }
      return;
    }

    setLoading(true);

    // Simulate network request
    setTimeout(() => {
      const user = loginUser(email, password);
      
      if (user) {
        saveUserSession(user);
        
        if (user.role === 'student') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'StudentDashboard' }],
          });
        } else if (user.role === 'teacher') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'TeacherDashboard' }],
          });
        } else if (user.role === 'languageOffice') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LanguageOfficeDashboard' }],
          });
        }
      } else {
        if (Platform.OS === 'web') {
          alert('Email atau password salah');
        } else {
          Alert.alert('Error', 'Email atau password salah');
        }
      }
      
      setLoading(false);
    }, 1000);
  };

  // Example user credentials section
  const renderExampleCredentials = () => (
    <View style={styles.exampleCredentials}>
      <Text style={styles.exampleTitle}>Contoh Akun:</Text>
      <View style={styles.exampleItem}>
        <Text style={styles.exampleLabel}>Siswa:</Text>
        <Text style={styles.exampleText}>siswa@example.com / password123</Text>
      </View>
      <View style={styles.exampleItem}>
        <Text style={styles.exampleLabel}>Guru:</Text>
        <Text style={styles.exampleText}>guru@example.com / password123</Text>
      </View>
      <View style={styles.exampleItem}>
        <Text style={styles.exampleLabel}>Kantor Bahasa:</Text>
        <Text style={styles.exampleText}>dinas@example.com / password123</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[
        styles.loginContainer,
        isDesktop && styles.desktopLoginContainer
      ]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🌊</Text>
          </View>
          <Text style={styles.headerTitle}>Rupa Nusantara</Text>
        </View>
        
        <Text style={styles.title}>Masuk ke Akun Anda</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Masukkan email Anda"
              placeholderTextColor={Colors.lightText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Masukkan password Anda"
              placeholderTextColor={Colors.lightText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity 
              style={styles.passwordToggle}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons 
                name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={Colors.lightText} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Memproses...' : 'Masuk'}
          </Text>
        </TouchableOpacity>
        
        {renderExampleCredentials()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Belum punya akun? 
          </Text>
          <TouchableOpacity>
            <Text style={styles.registerText}>Daftar di sini</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  desktopLoginContainer: {
    maxWidth: 480,
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 16,
  },
  logoContainer: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logo: {
    color: 'white',
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: Colors.text,
  },
  passwordToggle: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exampleCredentials: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  exampleLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    marginRight: 8,
  },
  exampleText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    color: Colors.lightText,
    marginRight: 4,
  },
  registerText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 