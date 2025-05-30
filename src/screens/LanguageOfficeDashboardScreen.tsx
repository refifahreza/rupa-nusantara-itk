import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Header from '../components/layout/Header';

// Type definitions
type RootStackParamList = {
  LanguageOfficeDashboard: undefined;
  ContentValidation: undefined;
  LanguageManagement: undefined;
  UserCommunity: undefined;
  ReportsExport: undefined;
};

type NotificationType = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

type TaskType = {
  id: string;
  title: string;
  count: number;
  priority: string;
  dueDate: string;
};

// Mock data for statistics
const mockStats = {
  activeLanguages: 42,
  verifiedVocabulary: 8756,
  totalContributors: 124,
  pendingValidations: 17
};

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'new_content',
    title: 'Kontribusi Kosakata Baru',
    message: 'Guru Bahasa Kutai menambahkan 24 kosakata baru menunggu validasi',
    time: '2 jam yang lalu',
    read: false
  },
  {
    id: '2',
    type: 'content_update',
    title: 'Pembaruan Cerita Rakyat',
    message: 'Komunitas Bahasa Banjar memperbarui 3 cerita rakyat',
    time: '4 jam yang lalu',
    read: false
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Pengingat Validasi',
    message: '5 audio rekaman Bahasa Dayak menunggu validasi lebih dari 7 hari',
    time: '1 hari yang lalu',
    read: true
  },
  {
    id: '4',
    type: 'system',
    title: 'Laporan Bulanan Tersedia',
    message: 'Laporan statistik penggunaan bulan Juni telah tersedia untuk diunduh',
    time: '2 hari yang lalu',
    read: true
  }
];

// Mock data for tasks
const mockTasks = [
  {
    id: '1',
    title: 'Validasi Kosakata Bahasa Kutai',
    count: 24,
    priority: 'high',
    dueDate: '2 hari lagi'
  },
  {
    id: '2',
    title: 'Tinjau Cerita Rakyat Bahasa Banjar',
    count: 3,
    priority: 'medium',
    dueDate: '5 hari lagi'
  },
  {
    id: '3',
    title: 'Validasi Audio Bahasa Dayak',
    count: 5,
    priority: 'high',
    dueDate: 'Terlambat 2 hari'
  },
  {
    id: '4',
    title: 'Pemetaan Bahasa Indonesia',
    count: 1,
    priority: 'low',
    dueDate: '2 minggu lagi'
  }
];

interface LanguageOfficeDashboardScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const LanguageOfficeDashboardScreen = ({ navigation }: LanguageOfficeDashboardScreenProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Notification item renderer
  const renderNotificationItem = ({ item }: { item: NotificationType }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
    >
      <View style={styles.notificationIcon}>
        {item.type === 'new_content' && (
          <Ionicons name="add-circle" size={24} color={Colors.primary} />
        )}
        {item.type === 'content_update' && (
          <Ionicons name="refresh-circle" size={24} color="#4CAF50" />
        )}
        {item.type === 'reminder' && (
          <Ionicons name="alarm" size={24} color="#FF9800" />
        )}
        {item.type === 'system' && (
          <Ionicons name="information-circle" size={24} color="#2196F3" />
        )}
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  // Task item renderer
  const renderTaskItem = ({ item }: { item: TaskType }) => (
    <TouchableOpacity style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={[
          styles.priorityBadge, 
          item.priority === 'high' ? styles.highPriority : 
          item.priority === 'medium' ? styles.mediumPriority : styles.lowPriority
        ]}>
          <Text style={styles.priorityText}>
            {item.priority === 'high' ? 'Tinggi' : 
             item.priority === 'medium' ? 'Sedang' : 'Rendah'}
          </Text>
        </View>
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskCount}>{item.count} item</Text>
        <Text style={[
          styles.taskDueDate,
          item.dueDate.includes('Terlambat') && styles.overdue
        ]}>{item.dueDate}</Text>
      </View>
      <TouchableOpacity style={styles.taskAction}>
        <Text style={styles.taskActionText}>Proses Sekarang</Text>
        <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Custom navigation items for Language Office
  const navItems = [
    { title: 'Dashboard', route: 'LanguageOfficeDashboard', isActive: true, icon: 'dashboard' },
    { title: 'Validasi Konten', route: 'ContentValidation', isActive: false, icon: 'check-circle' },
    { title: 'Manajemen Bahasa', route: 'LanguageManagement', isActive: false, icon: 'language' },
    { title: 'Pengguna & Komunitas', route: 'UserCommunity', isActive: false, icon: 'people' },
    { title: 'Ekspor & Laporan', route: 'ReportsExport', isActive: false, icon: 'description' }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard Kantor Bahasa" 
        showNotifications={true}
        showNavigation={true}
        activeNavItem="LanguageOfficeDashboard"
        customNavItems={navItems}
      />

      <ScrollView style={styles.content}>
        {/* Statistics Section */}
        <View style={[styles.section, styles.statsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistik Ringkas</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="language" size={24} color="#2196F3" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{mockStats.activeLanguages}</Text>
                <Text style={styles.statLabel}>Bahasa Aktif</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-done-circle" size={24} color="#4CAF50" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{mockStats.verifiedVocabulary}</Text>
                <Text style={styles.statLabel}>Kosakata Terverifikasi</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="people" size={24} color="#FF9800" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{mockStats.totalContributors}</Text>
                <Text style={styles.statLabel}>Total Kontributor</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="hourglass" size={24} color="#F44336" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{mockStats.pendingValidations}</Text>
                <Text style={styles.statLabel}>Menunggu Validasi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tugas Mendesak</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifikasi Terbaru</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  statsSection: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.lightText,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notificationIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.lightText,
  },
  notificationMessage: {
    fontSize: 13,
    color: Colors.text,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DDDDDD',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  highPriority: {
    backgroundColor: '#FFEBEE',
  },
  mediumPriority: {
    backgroundColor: '#FFF3E0',
  },
  lowPriority: {
    backgroundColor: '#E8F5E9',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskCount: {
    fontSize: 12,
    color: Colors.lightText,
  },
  taskDueDate: {
    fontSize: 12,
    color: Colors.lightText,
  },
  overdue: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  taskAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  taskActionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default LanguageOfficeDashboardScreen; 