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
  TextInput
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getCurrentUser, logoutUser } from '../utils/auth';
import Header from '../components/layout/Header';

type RootStackParamList = {
  Login: undefined;
  StudentDashboard: undefined;
  Quiz: undefined;
};

const StudentDashboardScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  
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

  const handleNavigateToQuiz = () => {
    navigation.navigate('Quiz');
  };

  // Sample data
  const todayWord = {
    word: 'Betas',
    meaning: 'Orang',
    language: 'Berau',
    region: 'Kalimantan Timur'
  };

  const recentStories = [
    { id: '1', title: 'Lahirnya Derawan', region: 'Kalimantan Timur', readTime: '5 menit', progress: 0.7 },
    { id: '2', title: 'Asal Usul Sungai Mahakam', region: 'Kalimantan Timur', readTime: '8 menit', progress: 0.3 },
  ];

  const availableQuizzes = [
    { id: '1', title: 'Kosakata Bahasa Berau', difficulty: 'Mudah', questionsCount: 10, estimatedTime: '5 menit' },
    { id: '2', title: 'Budaya Kalimantan Timur', difficulty: 'Sedang', questionsCount: 15, estimatedTime: '10 menit' },
  ];

  const learningStats = {
    wordsLearned: 42,
    storiesRead: 5,
    quizCompleted: 8,
    streakDays: 3
  };

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
            <Text style={styles.avatarText}>{user?.name.charAt(0) || 'S'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'Siswa'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'siswa@example.com'}</Text>
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
      {/* Use new Header component */}
      <Header 
        title="Rupa Nusantara"
        showNotifications={isDesktop}
      />
      
      {/* Main content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={isDesktop ? styles.desktopContent : null}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Selamat datang,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          
          <View style={styles.streakContainer}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF9500" />
            <Text style={styles.streakText}>{learningStats.streakDays} hari</Text>
          </View>
        </View>
        
        {/* Dashboard Layout */}
        <View style={[
          isDesktop ? styles.desktopLayout : styles.mobileLayout,
          isTablet && styles.tabletLayout
        ]}>
          {/* Left Section */}
          <View style={isDesktop ? styles.leftSection : styles.fullWidthSection}>
            {/* Today's Word */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Kosakata Hari Ini</Text>
              </View>
              
              <View style={styles.todayWordCard}>
                <View style={styles.wordContent}>
                  <Text style={styles.word}>{todayWord.word}</Text>
                  <Text style={styles.wordMeaning}>Berarti: {todayWord.meaning}</Text>
                  <Text style={styles.wordOrigin}>
                    {todayWord.language}, {todayWord.region}
                  </Text>
                </View>
                <View style={styles.wordImageContainer}>
                  <Text style={styles.wordEmoji}>👫</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Lihat Kosakata Lainnya</Text>
              </TouchableOpacity>
            </View>
            
            {/* Learning Stats */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Statistik Pembelajaran</Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="book-outline" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.statValue}>{learningStats.wordsLearned}</Text>
                  <Text style={styles.statLabel}>Kata Dipelajari</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="library-outline" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.statValue}>{learningStats.storiesRead}</Text>
                  <Text style={styles.statLabel}>Cerita Dibaca</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.statValue}>{learningStats.quizCompleted}</Text>
                  <Text style={styles.statLabel}>Kuis Selesai</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#FBE9E7' }]}>
                    <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
                  </View>
                  <Text style={styles.statValue}>{learningStats.streakDays}</Text>
                  <Text style={styles.statLabel}>Hari Beruntun</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Right Section */}
          <View style={isDesktop ? styles.rightSection : styles.fullWidthSection}>
            {/* Recent Stories */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Cerita Rakyat</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>Lihat Semua</Text>
                </TouchableOpacity>
              </View>
              
              {recentStories.map(story => (
                <View key={story.id} style={styles.storyItem}>
                  <View style={styles.storyIconContainer}>
                    <Text style={styles.storyEmoji}>📖</Text>
                  </View>
                  <View style={styles.storyContent}>
                    <Text style={styles.storyTitle}>{story.title}</Text>
                    <Text style={styles.storyDetails}>
                      {story.region} • {story.readTime}
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { width: `${story.progress * 100}%` }
                        ]} 
                      />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Lanjut</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Jelajahi Cerita Lainnya</Text>
              </TouchableOpacity>
            </View>
            
            {/* Available Quizzes */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Kuis Tersedia</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>Lihat Semua</Text>
                </TouchableOpacity>
              </View>
              
              {availableQuizzes.map(quiz => (
                <View key={quiz.id} style={styles.quizItem}>
                  <View style={styles.quizHeader}>
                    <View style={styles.quizIconContainer}>
                      <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.quizTitle}>{quiz.title}</Text>
                      <View style={styles.quizInfoRow}>
                        <View style={styles.quizInfoItem}>
                          <Ionicons name="stats-chart-outline" size={14} color={Colors.lightText} />
                          <Text style={styles.quizInfoText}>{quiz.difficulty}</Text>
                        </View>
                        <View style={styles.quizInfoItem}>
                          <Ionicons name="list-outline" size={14} color={Colors.lightText} />
                          <Text style={styles.quizInfoText}>{quiz.questionsCount} pertanyaan</Text>
                        </View>
                        <View style={styles.quizInfoItem}>
                          <Ionicons name="time-outline" size={14} color={Colors.lightText} />
                          <Text style={styles.quizInfoText}>{quiz.estimatedTime}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.startQuizButton}
                    onPress={handleNavigateToQuiz}
                  >
                    <Text style={styles.startQuizButtonText}>Mulai Kuis</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.cardButton}
                onPress={handleNavigateToQuiz}
              >
                <Text style={styles.cardButtonText}>Temukan Kuis Lainnya</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  desktopContent: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.lightText,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 8,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 4,
  },
  // Layout styles
  desktopLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mobileLayout: {
    flexDirection: 'column',
  },
  tabletLayout: {
    flexDirection: 'column',
  },
  leftSection: {
    width: '48%',
  },
  rightSection: {
    width: '48%',
  },
  fullWidthSection: {
    width: '100%',
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
  cardButton: {
    backgroundColor: Colors.primary + '10',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Today's word styles
  todayWordCard: {
    backgroundColor: '#FFF8D6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordContent: {
    flex: 1,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  wordMeaning: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  wordOrigin: {
    fontSize: 14,
    color: Colors.lightText,
  },
  wordImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  wordEmoji: {
    fontSize: 40,
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
  // Story item styles
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  storyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storyEmoji: {
    fontSize: 20,
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  storyDetails: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  continueButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Quiz item styles
  quizItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quizIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  quizInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quizInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quizInfoText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  startQuizButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  startQuizButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
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

export default StudentDashboardScreen; 