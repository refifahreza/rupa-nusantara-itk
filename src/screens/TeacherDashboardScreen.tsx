import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
  TextInput,
  FlatList
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getCurrentUser, logoutUser } from '../utils/auth';
import Header from '../components/layout/Header';

type RootStackParamList = {
  Login: undefined;
  TeacherDashboard: undefined;
  TeacherQuizManagement: undefined;
  TeacherContributor: undefined;
};

const TeacherDashboardScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    } else {
      navigation.navigate('Login');
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigation.navigate('Login');
  };

  const handleNavigateToQuizManagement = () => {
    navigation.navigate('TeacherQuizManagement');
  };

  // Sample data
  const students = [
    { 
      id: '1', 
      name: 'Andi Putra', 
      email: 'andi@student.com', 
      progress: 0.75, 
      level: 'Menengah',
      lastActive: '2 jam yang lalu',
      completedQuizzes: 7,
      vocabulary: 54
    },
    { 
      id: '2', 
      name: 'Budi Santoso', 
      email: 'budi@student.com', 
      progress: 0.45, 
      level: 'Pemula',
      lastActive: '1 hari yang lalu',
      completedQuizzes: 3,
      vocabulary: 28
    },
    { 
      id: '3', 
      name: 'Cindy Larasati', 
      email: 'cindy@student.com', 
      progress: 0.9, 
      level: 'Mahir',
      lastActive: '5 jam yang lalu',
      completedQuizzes: 12,
      vocabulary: 87
    },
    { 
      id: '4', 
      name: 'Deni Wijaya', 
      email: 'deni@student.com', 
      progress: 0.6, 
      level: 'Menengah',
      lastActive: '3 jam yang lalu',
      completedQuizzes: 5,
      vocabulary: 42
    },
  ];

  const classStats = {
    totalStudents: 24,
    activeStudents: 18,
    averageProgress: 0.65,
    completedQuizzes: 142
  };

  const recentMaterials = [
    { id: '1', title: 'Budaya Kalimantan Timur', type: 'PDF', date: '2 hari yang lalu', size: '2.4 MB' },
    { id: '2', title: 'Kosakata Bahasa Dayak', type: 'DOCX', date: '5 hari yang lalu', size: '1.8 MB' },
    { id: '3', title: 'Quiz Mingguan 3', type: 'QUIZ', date: '1 minggu yang lalu', size: '-' },
  ];

  const notifications = [
    { id: '1', title: 'Kuis baru tersedia', message: 'Admin telah menambahkan template kuis baru', time: '1 jam yang lalu', read: false },
    { id: '2', title: 'Pelatihan Daring', message: 'Pelatihan penggunaan aplikasi akan diadakan pada 12 Juli', time: '1 hari yang lalu', read: true },
    { id: '3', title: 'Materi Bahasa Berau Diperbarui', message: 'Kosakata bahasa Berau telah diperbarui oleh admin', time: '3 hari yang lalu', read: true },
  ];

  // Filter students based on search
  const filteredStudents = searchQuery 
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  // Menu component for mobile
  const MobileMenu = () => (
    <View style={styles.mobileMenuContainer}>
      <TouchableOpacity 
        style={styles.mobileMenuBackdrop}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
      />
      <View style={styles.mobileMenu}>
        <View style={styles.mobileMenuHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name.charAt(0) || 'G'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'Guru'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guru@example.com'}</Text>
          </View>
        </View>
        
        <View style={styles.menuDivider} />
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={Colors.text} />
          <Text style={styles.menuItemText}>Profil Saya</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color={Colors.text} />
          <Text style={styles.menuItemText}>Pengaturan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.text} />
          <Text style={styles.menuItemText}>Bantuan</Text>
        </TouchableOpacity>
        
        <View style={styles.menuDivider} />
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) {
    return null; // Or loading indicator
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title="Rupa Nusantara"
        showNotifications={true}
      />
      
      <View style={styles.content}>
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Selamat Datang, {user?.name || 'Guru'}</Text>
            <Text style={styles.welcomeSubtext}>Dashboard Guru</Text>
          </View>
        </View>
        
        <ScrollView style={styles.scrollContent}>
          {/* Class Statistics */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Statistik Kelas</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="people-outline" size={24} color="#2196F3" />
                </View>
                <Text style={styles.statValue}>{classStats.totalStudents}</Text>
                <Text style={styles.statLabel}>Total Siswa</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="person-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.statValue}>{classStats.activeStudents}</Text>
                <Text style={styles.statLabel}>Siswa Aktif</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="trending-up-outline" size={24} color="#FF9800" />
                </View>
                <Text style={styles.statValue}>{Math.round(classStats.averageProgress * 100)}%</Text>
                <Text style={styles.statLabel}>Rata-rata Progress</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FBE9E7' }]}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#FF5722" />
                </View>
                <Text style={styles.statValue}>{classStats.completedQuizzes}</Text>
                <Text style={styles.statLabel}>Quiz Diselesaikan</Text>
              </View>
            </View>
          </View>
          
          {/* Recent Materials */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Materi Terbaru</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            
            {recentMaterials.map(material => (
              <View key={material.id} style={styles.materialItem}>
                <View style={styles.materialIconContainer}>
                  <Ionicons 
                    name={
                      material.type === 'PDF' ? 'document-outline' : 
                      material.type === 'DOCX' ? 'document-text-outline' : 
                      'help-circle-outline'
                    } 
                    size={24} 
                    color={Colors.primary} 
                  />
                </View>
                <View style={styles.materialContent}>
                  <Text style={styles.materialTitle}>{material.title}</Text>
                  <Text style={styles.materialDetails}>
                    {material.type} • {material.date} • {material.size}
                  </Text>
                </View>
                <TouchableOpacity style={styles.materialActionButton}>
                  <Ionicons name="ellipsis-vertical" size={20} color={Colors.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {/* Notifications */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Notifikasi</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Tandai Semua Dibaca</Text>
              </TouchableOpacity>
            </View>
            
            {notifications.map(notification => (
              <View key={notification.id} style={styles.notificationItem}>
                {!notification.read && <View style={styles.unreadDot} />}
                <View style={[
                  styles.notificationIconContainer,
                  { backgroundColor: notification.read ? '#F5F5F5' : Colors.primary + '20' }
                ]}>
                  <Ionicons 
                    name="notifications-outline" 
                    size={24} 
                    color={notification.read ? Colors.lightText : Colors.primary} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flex: 1,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: Colors.lightText,
  },
  // Card styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  // Stats styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.lightText,
    textAlign: 'center',
  },
  // Material item styles
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  materialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  materialContent: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  materialDetails: {
    fontSize: 12,
    color: Colors.lightText,
  },
  materialActionButton: {
    padding: 8,
  },
  // Notification styles
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    left: 0,
    top: 16,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.lightText,
  },
  // Mobile menu styles
  mobileMenuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  mobileMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.lightText,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
  },
});

export default TeacherDashboardScreen; 