import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Image,
  Modal,
  TextInput,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { isAuthenticated, getCurrentUser, logoutUser } from '../utils/auth';

// Define navigation param types
type RootStackParamList = {
  Home: undefined;
  Translate: { word?: string };
  Stories: { storyId?: string };
  Explore: undefined;
  Quiz: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
};

// Add interfaces for search data types
interface WordItem {
  id: string;
  word: string;
  meaning: string;
  language: string;
  region: string;
}

interface StoryItem {
  id: string;
  title: string;
  region: string;
  readTime: string;
}

const features = [
  { id: 'translate', emoji: '🔤', title: 'Terjemahan', screen: 'Translate' },
  { id: 'stories', emoji: '📖', title: 'Cerita & Warisan', screen: 'Stories' },
  { id: 'explore', emoji: '🌏', title: 'Jelajah Daerah', screen: 'Explore' },
  { id: 'quiz', emoji: '✏️', title: 'Kuis Interaktif', screen: 'Quiz' },
];

// Sample data for search functionality
const searchSampleWords = [
  { id: '1', word: 'Betas', meaning: 'Orang', language: 'Berau', region: 'Kalimantan Timur' },
  { id: '2', word: 'Nuan', meaning: 'Kamu', language: 'Dayak', region: 'Kalimantan Barat' },
  { id: '3', word: 'Balangsar', meaning: 'Berantakan', language: 'Banjar', region: 'Kalimantan Selatan' },
  { id: '4', word: 'Bujur', meaning: 'Benar', language: 'Banjar', region: 'Kalimantan Selatan' },
  { id: '5', word: 'Tuaki', meaning: 'Sungai', language: 'Berau', region: 'Kalimantan Timur' },
];

const searchSampleStories = [
  { id: '1', title: 'Lahirnya Derawan', region: 'Kalimantan Timur', readTime: '5 menit' },
  { id: '2', title: 'Asal Usul Sungai Mahakam', region: 'Kalimantan Timur', readTime: '8 menit' },
  { id: '3', title: 'Legenda Gunung Kinabalu', region: 'Kalimantan Utara', readTime: '6 menit' },
  { id: '4', title: 'Putri Junjung Buih', region: 'Kalimantan Selatan', readTime: '7 menit' },
];

const popularDestinations = [
  { id: '1', name: 'Derawan', location: 'Kalimantan Timur', emoji: '🏝️' },
  { id: '2', name: 'Candi Borobudur', location: 'Jawa Tengah', emoji: '🗿' },
  { id: '3', name: 'Raja Ampat', location: 'Papua Barat', emoji: '🌊' },
  { id: '4', name: 'Taman Nasional Komodo', location: 'NTT', emoji: '🦎' },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Add ScrollView refs for horizontal navigation
  const bahasaScrollRef = useRef<ScrollView>(null);
  const funFactsScrollRef = useRef<ScrollView>(null);
  const ceritaScrollRef = useRef<ScrollView>(null);

  // Search functionality states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [wordResults, setWordResults] = useState<WordItem[]>([]);
  const [storyResults, setStoryResults] = useState<StoryItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  // Desktop mode when width is larger than 768px
  const isDesktop = width > 768;
  // Tablet mode when width is between 481px and 768px
  const isTablet = width > 480 && width <= 768;

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
    
    if (authStatus) {
      setUserData(getCurrentUser());
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUserData(null);
    setAccountMenuVisible(false);
  };

  const navigateToProtectedFeature = (feature: string) => {
    if (isLoggedIn) {
      // Navigate to the feature
      navigation.navigate(feature as any);
    } else {
      // Show login prompt
      setShowLoginPrompt(true);
    }
  };

  // Login prompt modal state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Login Prompt Modal
  const LoginPromptModal = () => (
    <Modal
      visible={showLoginPrompt}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLoginPrompt(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowLoginPrompt(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.loginPromptContainer}>
        <View style={styles.loginPromptContent}>
          <Text style={styles.loginPromptTitle}>Masuk untuk Melanjutkan</Text>
          <Text style={styles.loginPromptDescription}>
            Anda perlu masuk atau mendaftar untuk mengakses fitur ini.
          </Text>
          
          <View style={styles.loginPromptButtons}>
            <TouchableOpacity 
              style={styles.loginPromptLoginButton}
              onPress={() => {
                setShowLoginPrompt(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.loginPromptLoginText}>Masuk</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginPromptRegisterButton}
              onPress={() => {
                setShowLoginPrompt(false);
                navigation.navigate('Register');
              }}
            >
              <Text style={styles.loginPromptRegisterText}>Daftar</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.loginPromptCloseButton}
            onPress={() => setShowLoginPrompt(false)}
          >
            <Text style={styles.loginPromptCloseText}>Nanti Saja</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Custom Search Input component to handle styling issues
  const CustomSearchInput = () => {
    const inputRef = useRef(null);

    // For web platform - removes focus outline when rendered
    useEffect(() => {
      if (Platform.OS === 'web' && inputRef.current) {
        // @ts-ignore - this is specifically for web
        inputRef.current.style.outline = 'none';
        // @ts-ignore
        inputRef.current.style.border = 'none';
      }
    }, []);

    return (
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder="Cari kosakata atau cerita"
        placeholderTextColor={Colors.lightText}
        value={searchQuery}
        onChangeText={handleSearch}
        underlineColorAndroid="transparent"
        blurOnSubmit={false}
        autoCorrect={false}
        spellCheck={false}
      />
    );
  };

  // Handle search functionality
  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setWordResults([]);
      setStoryResults([]);
      setSearchModalVisible(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = text.toLowerCase();

    // Filter words
    const filteredWords = searchSampleWords.filter(word =>
      word.word.toLowerCase().includes(query) ||
      word.meaning.toLowerCase().includes(query) ||
      word.language.toLowerCase().includes(query)
    );

    // Filter stories
    const filteredStories = searchSampleStories.filter(story =>
      story.title.toLowerCase().includes(query) ||
      story.region.toLowerCase().includes(query)
    );

    setWordResults(filteredWords);
    setStoryResults(filteredStories);

    // Only show modal if we have results or there's a search query
    setSearchModalVisible(text.trim().length > 0);

    // Animate search results
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Close search modal
  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  const renderNavItem = (title: string, isActive: boolean = false) => (
    <TouchableOpacity style={[styles.navItem, isActive && styles.activeNavItem]}>
      <Text style={[styles.navItemText, isActive && styles.activeNavItemText]}>{title}</Text>
    </TouchableOpacity>
  );

  // Account menu dropdown - modified to show logged in or guest options
  const AccountMenu = () => (
    <View style={styles.accountMenu}>
      {isLoggedIn ? (
        // Logged in user menu
        <>
          <View style={styles.accountMenuHeader}>
            <View style={styles.accountAvatar}>
              <Text style={styles.accountAvatarText}>
                {userData?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.accountName}>{userData?.name || 'User'}</Text>
              <Text style={styles.accountEmail}>{userData?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setAccountMenuVisible(false);
              if (userData?.role === 'teacher') {
                navigation.navigate('TeacherDashboard');
              } else {
                navigation.navigate('StudentDashboard');
              }
            }}
          >
            <Ionicons name="grid-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Profil Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Pengaturan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Tersimpan</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>Keluar</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Guest user menu
        <>
          <View style={styles.accountMenuHeader}>
            <View style={styles.accountAvatar}>
              <Ionicons name="person-outline" size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.accountName}>Tamu</Text>
              <Text style={styles.accountEmail}>Silakan masuk atau daftar</Text>
            </View>
          </View>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setAccountMenuVisible(false);
              navigation.navigate('Login');
            }}
          >
            <Ionicons name="log-in-outline" size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, { color: Colors.primary }]}>Masuk</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setAccountMenuVisible(false);
              navigation.navigate('Register');
            }}
          >
            <Ionicons name="person-add-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Daftar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  // Modified MobileMenu to match the style from StudentDashboardScreen
  const MobileMenu = () => (
    <View style={styles.mobileMenuContainer}>
      <TouchableOpacity
        style={styles.mobileMenuBackdrop}
        activeOpacity={1}
        onPress={() => setMobileMenuVisible(false)}
      />
      <View style={styles.mobileMenu}>
        <View style={styles.mobileMenuHeader}>
          <View style={styles.avatarContainer}>
            {isLoggedIn ? (
              <Text style={styles.avatarText}>{userData?.name?.charAt(0) || 'U'}</Text>
            ) : (
              <Ionicons name="person-outline" size={24} color={Colors.primary} />
            )}
          </View>
          <View>
            <Text style={styles.userName}>{isLoggedIn ? userData?.name || 'User' : 'Tamu'}</Text>
            <Text style={styles.userEmail}>
              {isLoggedIn ? userData?.email || 'user@example.com' : 'Silakan masuk atau daftar'}
            </Text>
          </View>
        </View>
        
        <View style={styles.menuDivider} />
        
        {isLoggedIn ? (
          // Logged in menu items
          <>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMobileMenuVisible(false);
                if (userData?.role === 'teacher') {
                  navigation.navigate('TeacherDashboard');
                } else {
                  navigation.navigate('StudentDashboard');
                }
              }}
            >
              <Ionicons name="grid-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setMobileMenuVisible(false)}
            >
              <Ionicons name="person-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Profil Saya</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setMobileMenuVisible(false)}
            >
              <Ionicons name="settings-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Pengaturan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setMobileMenuVisible(false)}
            >
              <Ionicons name="help-circle-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Bantuan</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                handleLogout();
                setMobileMenuVisible(false);
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>Keluar</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Guest menu items
          <>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMobileMenuVisible(false);
                navigation.navigate('Login');
              }}
            >
              <Ionicons name="log-in-outline" size={24} color={Colors.primary} />
              <Text style={[styles.menuItemText, { color: Colors.primary }]}>Masuk</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMobileMenuVisible(false);
                navigation.navigate('Register');
              }}
            >
              <Ionicons name="person-add-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Daftar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  // Search Results Modal Component
  const SearchModal = () => (
    <>
      <TouchableWithoutFeedback onPress={closeSearchModal}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.searchModalContainer}>
        <View style={styles.searchModalContent}>
          <View style={styles.searchModalHeader}>
            <Text style={styles.searchResultsTitle}>Hasil Pencarian</Text>
            <View style={styles.searchResultsActions}>
              <Text style={styles.searchResultsCount}>
                {wordResults.length + storyResults.length} ditemukan
              </Text>
              <TouchableOpacity
                onPress={closeSearchModal}
                style={styles.closeModalButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.searchResultsScroll}>
            {wordResults.length > 0 && (
              <View style={styles.searchResultSection}>
                <Text style={styles.searchResultSectionTitle}>KATA</Text>

                {wordResults.map(word => (
                  <TouchableOpacity
                    key={word.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      closeSearchModal();
                      navigation.navigate('Translate', { word: word.word });
                    }}
                  >
                    <View style={styles.searchResultIcon}>
                      <Text style={styles.searchResultEmoji}>🔤</Text>
                    </View>
                    <View style={styles.searchResultTextContainer}>
                      <Text style={styles.searchResultName}>
                        {word.word} - <Text style={styles.searchResultMeaning}>{word.meaning}</Text>
                      </Text>
                      <Text style={styles.searchResultDescription}>
                        {word.language} • {word.region}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {storyResults.length > 0 && (
              <View style={styles.searchResultSection}>
                <Text style={styles.searchResultSectionTitle}>CERITA</Text>

                {storyResults.map(story => (
                  <TouchableOpacity
                    key={story.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      closeSearchModal();
                      navigation.navigate('Stories', { storyId: story.id });
                    }}
                  >
                    <View style={styles.searchResultIcon}>
                      <Text style={styles.searchResultEmoji}>📖</Text>
                    </View>
                    <View style={styles.searchResultTextContainer}>
                      <Text style={styles.searchResultName}>{story.title}</Text>
                      <Text style={styles.searchResultDescription}>
                        {story.region} • {story.readTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {wordResults.length === 0 && storyResults.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={60} color={`${Colors.primary}60`} />
                <Text style={styles.noResultsText}>
                  Tidak ada hasil untuk "{searchQuery}"
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );

  // Add the additional refs near the top with the other refs
  const desktopBahasaScrollRef = useRef<ScrollView>(null);
  const desktopFunFactsScrollRef = useRef<ScrollView>(null);
  const desktopCeritaScrollRef = useRef<ScrollView>(null);

  return (
    <Layout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Use the new Header component only in mobile mode */}
        {!isDesktop && (
          <Header 
            showNavigation={false}
            activeNavItem="Home"
          />
        )}

        <View style={[
          styles.mainContainer,
          isDesktop && styles.desktopMainContainer,
          isTablet && styles.tabletMainContainer
        ]}>
          {/* Search Bar - Desktop moves to top */}
          {isDesktop && (
            <TouchableOpacity style={styles.desktopSearchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.grayText}>Cari kosakata atau cerita</Text>
            </TouchableOpacity>
          )}

          {/* Hero Banner for Desktop */}
          {isDesktop && (
            <View style={styles.heroBanner}>
              <View style={styles.heroBannerContent}>
                <Text style={styles.heroBannerTitle}>Jelajahi Kekayaan Budaya Nusantara</Text>
                <Text style={styles.heroBannerSubtitle}>
                  Temukan cerita, kosakata, dan warisan budaya dari berbagai daerah di Indonesia
                </Text>
                <TouchableOpacity style={styles.heroBannerButton}>
                  <Text style={styles.heroBannerButtonText}>Mulai Eksplorasi</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.heroBannerImageContainer}>
                <Text style={styles.heroBannerEmoji}>🏝️🌋🌊</Text>
              </View>
            </View>
          )}

          {/* Main Content */}
          {/* {!isDesktop && (
            <Text style={styles.greeting}>Hai, Ditai</Text>
          )} */}

          {/* Content Layout */}
          <View style={[
            styles.singleColumnLayout,
            isDesktop && styles.desktopContentWrapper
          ]}>
            <View style={styles.fullWidth}>
              {/* Mobile Search Bar */}
              {!isDesktop && (
                <View style={styles.searchBarContainer}>
                  {/* Contribution Banner */}
                  <View style={styles.contributionBanner}>
                    <View style={styles.contributionTextContainer}>
                      <Text style={styles.contributionTitle}>Mari berkontribusi untuk negeri</Text>
                      <Text style={styles.contributionSubtitle}>dengan menjaga bahasa daerah di <Text style={styles.contributionHighlight}>KALTIM</Text></Text>
                    </View>
                    <View style={styles.contributionImageContainer}>
                      <Image
                        source={require('../../assets/3d/3d-translate.png')} // Ilustrasi 3D kontribusi
                        style={styles.contributionImage}
                        resizeMode="contain"
                      />
                    </View>
                  </View>

                  {/* Search Bar */}
                  <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={Colors.primary} />
                    <CustomSearchInput />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        style={styles.clearSearchButton}
                        onPress={() => handleSearch('')}
                      >
                        <Ionicons name="close-circle" size={20} color={Colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* Kata Kata Hari Ini Section */}
              <View style={styles.section}>
                {isDesktop && (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Kata Kata Hari Ini</Text>
                    <View style={styles.navigationButtons}>
                      <TouchableOpacity style={styles.navButton}>
                        <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Word card */}
                <View style={styles.contentCard}>
                  <Text style={styles.subtitle}>Kata Kata Hari Ini</Text>

                  <View style={styles.wordCard}>
                    <View style={styles.wordContent}>
                      <Text style={styles.wordTitle}>Bujur Banar</Text>
                      <Text style={styles.wordMeaning}>Berarti: Benar Sekali</Text>
                      <Text style={styles.languageOrigin}>Bahasa Banjar, Kalimantan Selatan</Text>
                    </View>
                    <View style={styles.wordImageContainer}>
                      <Text style={styles.largeEmoji}>👍</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => navigation.navigate('Translate', { word: 'Bujur Banar' })}
                    >
                      <Text style={styles.nextButtonText}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Eksplorasi Bahasa Section - Visible on all devices */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Eksplorasi Bahasa</Text>
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity 
                      style={styles.navButton}
                      onPress={() => {
                        if (isDesktop ? desktopBahasaScrollRef.current : bahasaScrollRef.current) {
                          (isDesktop ? desktopBahasaScrollRef.current : bahasaScrollRef.current)?.scrollTo({ x: 0, animated: true });
                        }
                      }}
                    >
                      <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.navButton}
                      onPress={() => {
                        if (isDesktop ? desktopBahasaScrollRef.current : bahasaScrollRef.current) {
                          (isDesktop ? desktopBahasaScrollRef.current : bahasaScrollRef.current)?.scrollTo({ x: 500, animated: true });
                        }
                      }}
                    >
                      <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  ref={isDesktop ? desktopBahasaScrollRef : bahasaScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.priorityScrollContent}
                >
                  {/* Word Card 1 - Betas */}
                  <TouchableOpacity 
                    style={styles.wordCardItem}
                    onPress={() => navigation.navigate('Translate', { word: 'Betas' })}
                  >
                    <View style={styles.wordCardHeader}>
                      <Text style={styles.wordCardEmoji}>👫</Text>
                      <View style={styles.languageBadge}>
                        <Text style={styles.languageBadgeText}>Berau</Text>
                      </View>
                    </View>
                    <View style={styles.wordCardContent}>
                      <Text style={styles.wordCardTitle}>Betas</Text>
                      <Text style={styles.wordCardMeaning}>Orang</Text>
                      <View style={styles.wordCardLocation}>
                        <Ionicons name="location-outline" size={14} color={Colors.primary} />
                        <Text style={styles.wordCardLocationText}>Kalimantan Timur</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Word Card 2 - Nuan */}
                  <TouchableOpacity 
                    style={styles.wordCardItem}
                    onPress={() => navigation.navigate('Translate', { word: 'Nuan' })}
                  >
                    <View style={styles.wordCardHeader}>
                      <Text style={styles.wordCardEmoji}>👆</Text>
                      <View style={styles.languageBadge}>
                        <Text style={styles.languageBadgeText}>Dayak</Text>
                      </View>
                    </View>
                    <View style={styles.wordCardContent}>
                      <Text style={styles.wordCardTitle}>Nuan</Text>
                      <Text style={styles.wordCardMeaning}>Kamu</Text>
                      <View style={styles.wordCardLocation}>
                        <Ionicons name="location-outline" size={14} color={Colors.primary} />
                        <Text style={styles.wordCardLocationText}>Kalimantan Barat</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Word Card 3 - Bujur */}
                  <TouchableOpacity 
                    style={styles.wordCardItem}
                    onPress={() => navigation.navigate('Translate', { word: 'Bujur' })}
                  >
                    <View style={styles.wordCardHeader}>
                      <Text style={styles.wordCardEmoji}>👍</Text>
                      <View style={styles.languageBadge}>
                        <Text style={styles.languageBadgeText}>Banjar</Text>
                      </View>
                    </View>
                    <View style={styles.wordCardContent}>
                      <Text style={styles.wordCardTitle}>Bujur</Text>
                      <Text style={styles.wordCardMeaning}>Benar</Text>
                      <View style={styles.wordCardLocation}>
                        <Ionicons name="location-outline" size={14} color={Colors.primary} />
                        <Text style={styles.wordCardLocationText}>Kalimantan Selatan</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Fun Facts Kaltim Section - Visible on all devices */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Fun Facts Kaltim</Text>
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity 
                      style={styles.navButton}
                      onPress={() => {
                        if (isDesktop ? desktopFunFactsScrollRef.current : funFactsScrollRef.current) {
                          (isDesktop ? desktopFunFactsScrollRef.current : funFactsScrollRef.current)?.scrollTo({ x: 0, animated: true });
                        }
                      }}
                    >
                      <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.navButton}
                      onPress={() => {
                        if (isDesktop ? desktopFunFactsScrollRef.current : funFactsScrollRef.current) {
                          (isDesktop ? desktopFunFactsScrollRef.current : funFactsScrollRef.current)?.scrollTo({ x: 500, animated: true });
                        }
                      }}
                    >
                      <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  ref={isDesktop ? desktopFunFactsScrollRef : funFactsScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.priorityScrollContent}
                >
                  {/* Fun Fact 1 */}
                  <View style={styles.funFactCard}>
                    <View style={styles.funFactIconContainer}>
                      <Text style={styles.funFactIcon}>🕌</Text>
                    </View>
                    <Text style={styles.funFactText}>
                      Samarinda memiliki Masjid Islamic Center yang merupakan masjid terbesar kedua di Indonesia setelah Masjid Istiqlal
                    </Text>
                  </View>

                  {/* Fun Fact 2 */}
                  <View style={styles.funFactCard}>
                    <View style={styles.funFactIconContainer}>
                      <Text style={styles.funFactIcon}>🏞️</Text>
                    </View>
                    <Text style={styles.funFactText}>
                      Danau Labuan Cermin di Berau memiliki fenomena unik dimana airnya terdiri dari lapisan air tawar dan air asin
                    </Text>
                  </View>

                  {/* Fun Fact 3 */}
                  <View style={styles.funFactCard}>
                    <View style={styles.funFactIconContainer}>
                      <Text style={styles.funFactIcon}>👑</Text>
                    </View>
                    <Text style={styles.funFactText}>
                      Kutai Kartanegara adalah kerajaan tertua di Indonesia, berdiri sejak abad ke-4 Masehi
                    </Text>
                  </View>
                </ScrollView>
              </View>

              {/* Cerita Rakyat Section - Visible on all devices */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Cerita Rakyat</Text>
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity 
                      style={styles.navButton}
                      onPress={() => {
                        if (isDesktop ? desktopCeritaScrollRef.current : ceritaScrollRef.current) {
                          (isDesktop ? desktopCeritaScrollRef.current : ceritaScrollRef.current)?.scrollTo({ x: 0, animated: true });
                        }
                      }}
                    >
                      <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.navButton}
                      onPress={() => {
                        if (isDesktop ? desktopCeritaScrollRef.current : ceritaScrollRef.current) {
                          (isDesktop ? desktopCeritaScrollRef.current : ceritaScrollRef.current)?.scrollTo({ x: 500, animated: true });
                        }
                      }}
                    >
                      <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  ref={isDesktop ? desktopCeritaScrollRef : ceritaScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.priorityScrollContent}
                >
                  {/* Story Card 1 */}
                  <TouchableOpacity 
                    style={styles.storyCardItem}
                    onPress={() => navigation.navigate('Stories', { storyId: '1' })}
                  >
                    <View style={styles.storyCardImageContainer}>
                      <Text style={styles.storyCardEmoji}>🏝️</Text>
                    </View>
                    <View style={styles.storyCardContent}>
                      <Text style={styles.storyCardTitle}>Lahirnya Derawan</Text>
                      <View style={styles.storyCardMeta}>
                        <View style={styles.storyCardMetaItem}>
                          <Ionicons name="location-outline" size={14} color={Colors.primary} />
                          <Text style={styles.storyCardMetaText}>Kalimantan Timur</Text>
                        </View>
                        <View style={styles.storyCardMetaItem}>
                          <Ionicons name="time-outline" size={14} color={Colors.primary} />
                          <Text style={styles.storyCardMetaText}>5 menit</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.readButton}>
                        <Text style={styles.readButtonText}>Baca Cerita</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>

                  {/* Story Card 2 */}
                  <TouchableOpacity 
                    style={styles.storyCardItem}
                    onPress={() => navigation.navigate('Stories', { storyId: '2' })}
                  >
                    <View style={styles.storyCardImageContainer}>
                      <Text style={styles.storyCardEmoji}>🌊</Text>
                    </View>
                    <View style={styles.storyCardContent}>
                      <Text style={styles.storyCardTitle}>Asal Usul Sungai Mahakam</Text>
                      <View style={styles.storyCardMeta}>
                        <View style={styles.storyCardMetaItem}>
                          <Ionicons name="location-outline" size={14} color={Colors.primary} />
                          <Text style={styles.storyCardMetaText}>Kalimantan Timur</Text>
                        </View>
                        <View style={styles.storyCardMetaItem}>
                          <Ionicons name="time-outline" size={14} color={Colors.primary} />
                          <Text style={styles.storyCardMetaText}>8 menit</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.readButton}>
                        <Text style={styles.readButtonText}>Baca Cerita</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>

                  {/* Story Card 3 */}
                  <TouchableOpacity 
                    style={styles.storyCardItem}
                    onPress={() => navigation.navigate('Stories', { storyId: '4' })}
                  >
                    <View style={styles.storyCardImageContainer}>
                      <Text style={styles.storyCardEmoji}>👸</Text>
                    </View>
                    <View style={styles.storyCardContent}>
                      <Text style={styles.storyCardTitle}>Putri Junjung Buih</Text>
                      <View style={styles.storyCardMeta}>
                        <View style={styles.storyCardMetaItem}>
                          <Ionicons name="location-outline" size={14} color={Colors.primary} />
                          <Text style={styles.storyCardMetaText}>Kalimantan Selatan</Text>
                        </View>
                        <View style={styles.storyCardMetaItem}>
                          <Ionicons name="time-outline" size={14} color={Colors.primary} />
                          <Text style={styles.storyCardMetaText}>7 menit</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.readButton}>
                        <Text style={styles.readButtonText}>Baca Cerita</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={[
            styles.footer,
            isDesktop && styles.desktopFooter,
            isTablet && styles.tabletFooter
          ]}>
            {isDesktop ? (
              <>
                <View style={styles.footerColumns}>
                  <View style={styles.footerColumn}>
                    <Text style={styles.footerColumnTitle}>Tentang Kami</Text>
                    <Text style={styles.footerColumnLink}>Siapa Kami</Text>
                    <Text style={styles.footerColumnLink}>Kontak</Text>
                    <Text style={styles.footerColumnLink}>FAQ</Text>
                  </View>
                  <View style={styles.footerColumn}>
                    <Text style={styles.footerColumnTitle}>Kategori</Text>
                    <Text style={styles.footerColumnLink}>Cerita Rakyat</Text>
                    <Text style={styles.footerColumnLink}>Kamus Bahasa</Text>
                    <Text style={styles.footerColumnLink}>Budaya Daerah</Text>
                  </View>
                  <View style={styles.footerColumn}>
                    <Text style={styles.footerColumnTitle}>Dukung Kami</Text>
                    <Text style={styles.footerColumnLink}>Donasi</Text>
                    <Text style={styles.footerColumnLink}>Partnership</Text>
                    <Text style={styles.footerColumnLink}>Volunteer</Text>
                  </View>
                </View>
                <View style={styles.footerBottom}>
                  <Text style={styles.footerText}>
                    Versi 1.0.0 • Rupa Nusantara
                  </Text>
                  <Text style={styles.footerText}>
                    ©2023 Semua hak cipta dilindungi
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.footerText}>
                  Versi 1.0.0 • Rupa Nusantara
                </Text>
                <Text style={styles.footerText}>
                  ©2023 Semua hak cipta dilindungi
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Search Results Modal */}
      {searchModalVisible && <SearchModal />}
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 20, // Add extra padding for tab bar
  },
  mainContainer: {
    padding: 16,
  },
  desktopMainContainer: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  tabletMainContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 1000,
  },
  desktopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  navItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeNavItemText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 4,
  },
  headerButtonPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  headerButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  headerButtonTextPrimary: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Account button and menu
  accountButton: {
    marginLeft: 12,
    padding: 4,
  },
  accountMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 240,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
    zIndex: 1000,
  },
  accountMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  accountAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  accountEmail: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logo: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  // Hero Banner
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10', // 10% opacity
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    overflow: 'hidden',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroBannerContent: {
    flex: 1,
    paddingRight: 24,
  },
  heroBannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  heroBannerSubtitle: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: 24,
    lineHeight: 24,
  },
  heroBannerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroBannerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroBannerImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBannerEmoji: {
    fontSize: 80,
  },
  // Layout
  desktopContentWrapper: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  singleColumnLayout: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  columnLeft: {
    width: '45%',
    marginRight: '2.5%',
  },
  columnRight: {
    width: '45%',
    marginLeft: '2.5%',
  },
  tabletColumn: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
    marginTop: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  languageOrigin: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
    fontStyle: 'italic',
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
    color: Colors.text,
  },
  wordCard: {
    backgroundColor: '#FFF8D6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  wordContent: {
    flex: 1,
  },
  wordTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  wordMeaning: {
    fontSize: 14,
    color: Colors.lightText,
  },
  wordImageContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeEmoji: {
    fontSize: 40,
  },
  nextButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  desktopFeaturesContainer: {
    justifyContent: 'flex-start',
  },
  tabletFeaturesContainer: {
    justifyContent: 'space-around',
  },
  featureCard: {
    alignItems: 'center',
    width: '18%',
    marginBottom: 16,
  },
  desktopFeatureCard: {
    width: 'auto',
    marginRight: 24,
  },
  tabletFeatureCard: {
    width: '22%',
    marginRight: 0,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  blueBg: {
    backgroundColor: '#E3F2FD',
  },
  yellowBg: {
    backgroundColor: '#FFF8E1',
  },
  redBg: {
    backgroundColor: '#FFEBEE',
  },
  emoji: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text,
  },
  searchBarContainer: {
    marginBottom: 12,
    width: '100%',
  },
  contributionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  contributionTextContainer: {
    flex: 1,
    paddingRight: 8,
    zIndex: 1,
  },
  contributionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  contributionSubtitle: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  contributionHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  contributionImageContainer: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
  contributionImage: {
    width: '100%',
    height: '100%',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    padding: 8,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  clearSearchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
  },
  searchResultEmoji: {
    fontSize: 18,
  },
  searchModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    maxWidth: '80%',
    maxHeight: '80%',
    width: '100%',
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  searchResultsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultsCount: {
    fontSize: 14,
    color: Colors.text,
  },
  closeModalButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
  },
  searchResultsScroll: {
    flex: 1,
  },
  searchResultSection: {
    marginBottom: 24,
  },
  searchResultSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  searchResultTextContainer: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  searchResultMeaning: {
    fontSize: 14,
    color: Colors.lightText,
  },
  searchResultDescription: {
    fontSize: 12,
    color: Colors.lightText,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  desktopSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '62%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  footer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  desktopFooter: {
    marginTop: 40,
    paddingTop: 24,
  },
  tabletFooter: {
    marginTop: 32,
    paddingTop: 20,
  },
  footerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  footerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
  },
  footerColumnLink: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 8,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 4,
  },
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
    marginBottom: 12,
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
  mobileMenuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  grayText: {
    color: Colors.lightText,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
  },
  storyImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  storyIslandEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  storyPeopleEmoji: {
    fontSize: 44,
  },
  storyInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  storyInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  storyInfoIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  storyInfoText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  storyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  storyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Popular Destinations
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationImageContainer: {
    height: 120,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationEmoji: {
    fontSize: 50,
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  destinationLocation: {
    fontSize: 12,
    color: Colors.lightText,
  },
  
  // Login prompt modal styles
  loginPromptContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginPromptDescription: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginPromptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loginPromptLoginButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  loginPromptLoginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPromptRegisterButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  loginPromptRegisterText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPromptCloseButton: {
    padding: 12,
    alignItems: 'center',
  },
  loginPromptCloseText: {
    color: Colors.lightText,
    fontSize: 14,
  },
  
  // Avatar styles
  smallAvatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  priorityScrollContent: {
    // paddingLeft: 16,
    paddingRight: 8,
  },
  regionCard: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  regionImageContainer: {
    height: 130,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  regionImage: {
    width: '100%',
    height: '100%',
  },
  regionContent: {
    padding: 12,
  },
  regionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  regionDetails: {
    marginBottom: 12,
  },
  regionDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  regionDetailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  regionDetailText: {
    fontSize: 13,
    color: Colors.lightText,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 4,
  },
  
  // Word Card Styles
  wordCardItem: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordCardHeader: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  wordCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  languageBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  wordCardContent: {
    padding: 12,
  },
  wordCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  wordCardMeaning: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  wordCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCardLocationText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  
  // Fun Fact Styles
  funFactCard: {
    width: 230,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    padding: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 180,
  },
  funFactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  funFactIcon: {
    fontSize: 24,
  },
  funFactText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  
  // Story Card Styles
  storyCardItem: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  storyCardImageContainer: {
    height: 120,
    width: '100%',
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCardEmoji: {
    fontSize: 40,
  },
  storyCardContent: {
    padding: 12,
  },
  storyCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  storyCardMeta: {
    marginBottom: 12,
  },
  storyCardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyCardMetaText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  readButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  readButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // Add new styles for desktop layout
  desktopSubSection: {
    marginBottom: 20,
  },
  desktopSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  desktopSubSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  desktopRowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
}); 