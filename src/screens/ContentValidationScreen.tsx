import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
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

// Mock data for content awaiting validation
const mockContentItems = [
  {
    id: '1',
    type: 'vocabulary',
    language: 'Kutai',
    title: 'Kosakata Baru: Lingkungan',
    contributor: 'Guru Bahasa Kutai',
    date: '14 Juli 2023',
    count: 24,
    status: 'pending'
  },
  {
    id: '2',
    type: 'story',
    language: 'Banjar',
    title: 'Cerita Rakyat: Patih Lambung Mangkurat',
    contributor: 'Komunitas Budaya Banjar',
    date: '12 Juli 2023',
    count: 1,
    status: 'pending'
  },
  {
    id: '3',
    type: 'audio',
    language: 'Dayak',
    title: 'Rekaman Audio: Frasa Sehari-hari',
    contributor: 'Guru Bahasa Dayak',
    date: '8 Juli 2023',
    count: 5,
    status: 'pending'
  },
  {
    id: '4',
    type: 'vocabulary',
    language: 'Kutai',
    title: 'Kosakata Baru: Upacara Adat',
    contributor: 'Komunitas Budaya Kutai',
    date: '5 Juli 2023',
    count: 18,
    status: 'pending'
  },
  {
    id: '5',
    type: 'story',
    language: 'Banjar',
    title: 'Cerita Rakyat: Batu Benawa',
    contributor: 'Guru Bahasa Banjar',
    date: '3 Juli 2023',
    count: 1,
    status: 'pending'
  }
];

// Mock vocabulary items for selected content
const mockVocabularyItems = [
  {
    id: '1',
    original: 'pohon',
    translation: 'puhun',
    description: 'Tumbuhan yang berbatang keras dan besar',
    example: 'Puhun asem iku gedhe banget',
    category: 'Lingkungan',
    validated: false
  },
  {
    id: '2',
    original: 'sungai',
    translation: 'sungai',
    description: 'Aliran air yang besar',
    example: 'Sungai iku biasane ana iwake',
    category: 'Lingkungan',
    validated: false
  },
  {
    id: '3',
    original: 'gunung',
    translation: 'bukit',
    description: 'Bukit yang sangat besar dan tinggi',
    example: 'Bukit Raya adalah gunung di Kalimantan',
    category: 'Lingkungan',
    validated: false
  },
  {
    id: '4',
    original: 'laut',
    translation: 'laut',
    description: 'Kumpulan air asin yang luas',
    example: 'Wong nelayan golek iwak nang laut',
    category: 'Lingkungan',
    validated: false
  }
];

type ContentItem = {
  id: string;
  type: string;
  language: string;
  title: string;
  contributor: string;
  date: string;
  count: number;
  status: string;
};

type VocabularyItem = {
  id: string;
  original: string;
  translation: string;
  description: string;
  example: string;
  category: string;
  validated: boolean;
};

interface ContentValidationScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const ContentValidationScreen = ({ navigation }: ContentValidationScreenProps) => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>(mockVocabularyItems);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Function to handle content item selection
  const handleContentSelect = (item: ContentItem) => {
    setSelectedContent(item);
  };

  // Function to handle item validation
  const handleValidateItem = (id: string) => {
    setVocabularyItems(
      vocabularyItems.map(item => 
        item.id === id ? { ...item, validated: !item.validated } : item
      )
    );
  };

  // Function to handle batch validation
  const handleBatchValidation = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setVocabularyItems(
        vocabularyItems.map(item => ({ ...item, validated: true }))
      );
    } else {
      // Reset selection
      setSelectedContent(null);
      setVocabularyItems(mockVocabularyItems);
    }
  };

  // Content item renderer
  const renderContentItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity 
      style={[
        styles.contentItem,
        selectedContent?.id === item.id && styles.selectedContentItem
      ]}
      onPress={() => handleContentSelect(item)}
    >
      <View style={styles.contentTypeIcon}>
        {item.type === 'vocabulary' && (
          <Ionicons name="book" size={24} color={Colors.primary} />
        )}
        {item.type === 'story' && (
          <Ionicons name="document-text" size={24} color="#4CAF50" />
        )}
        {item.type === 'audio' && (
          <Ionicons name="mic" size={24} color="#FF9800" />
        )}
      </View>
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.contentMeta}>
          {item.language} • {item.contributor} • {item.date}
        </Text>
        <View style={styles.contentStats}>
          <Text style={styles.contentCount}>{item.count} item</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'pending' ? styles.pendingBadge : styles.completedBadge
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'pending' ? 'Menunggu' : 'Selesai'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Vocabulary item renderer
  const renderVocabularyItem = ({ item }: { item: VocabularyItem }) => (
    <View style={styles.vocabularyItem}>
      <View style={styles.vocabularyHeader}>
        <View style={styles.vocabularyTerms}>
          <Text style={styles.vocabularyOriginal}>{item.original}</Text>
          <Text style={styles.vocabularyArrow}>→</Text>
          <Text style={styles.vocabularyTranslation}>{item.translation}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.validationButton,
            item.validated ? styles.validatedButton : styles.notValidatedButton
          ]}
          onPress={() => handleValidateItem(item.id)}
        >
          {item.validated ? (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={24} color="#999" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.vocabularyDetails}>
        <Text style={styles.vocabularyLabel}>Deskripsi:</Text>
        <Text style={styles.vocabularyDescription}>{item.description}</Text>
      </View>
      <View style={styles.vocabularyDetails}>
        <Text style={styles.vocabularyLabel}>Contoh:</Text>
        <Text style={styles.vocabularyExample}>{item.example}</Text>
      </View>
      <View style={styles.vocabularyCategory}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
    </View>
  );

  // Custom navigation items for Language Office
  const navItems = [
    { title: 'Dashboard', route: 'LanguageOfficeDashboard', isActive: false, icon: 'dashboard' },
    { title: 'Validasi Konten', route: 'ContentValidation', isActive: true, icon: 'check-circle' },
    { title: 'Manajemen Bahasa', route: 'LanguageManagement', isActive: false, icon: 'language' },
    { title: 'Pengguna & Komunitas', route: 'UserCommunity', isActive: false, icon: 'people' },
    { title: 'Ekspor & Laporan', route: 'ReportsExport', isActive: false, icon: 'description' }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Validasi Konten" 
        showNotifications={true}
        showNavigation={true}
        activeNavItem="ContentValidation"
        customNavItems={navItems}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            selectedTab === 'pending' && styles.activeTabItem
          ]}
          onPress={() => setSelectedTab('pending')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'pending' && styles.activeTabText
          ]}>
            Menunggu Validasi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            selectedTab === 'completed' && styles.activeTabItem
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'completed' && styles.activeTabText
          ]}>
            Sudah Divalidasi
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.lightText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari konten..."
          placeholderTextColor={Colors.lightText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={Colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isDesktop ? (
          <View style={styles.desktopLayout}>
            <View style={styles.contentList}>
              <FlatList
                data={mockContentItems}
                renderItem={renderContentItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
              />
            </View>
            <View style={styles.contentDetail}>
              {selectedContent ? (
                <>
                  <View style={styles.detailHeader}>
                    <View>
                      <Text style={styles.detailTitle}>{selectedContent.title}</Text>
                      <Text style={styles.detailMeta}>
                        Bahasa {selectedContent.language} • {selectedContent.count} item
                      </Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleBatchValidation('reject')}
                      >
                        <Text style={styles.actionButtonText}>Tolak</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleBatchValidation('approve')}
                      >
                        <Text style={styles.actionButtonText}>Terima Semua</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <FlatList
                    data={vocabularyItems}
                    renderItem={renderVocabularyItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                  />
                </>
              ) : (
                <View style={styles.noSelectionContainer}>
                  <Ionicons name="document-text-outline" size={64} color="#CCC" />
                  <Text style={styles.noSelectionText}>
                    Pilih konten dari daftar untuk melihat detail dan melakukan validasi
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <>
            {!selectedContent ? (
              <FlatList
                data={mockContentItems}
                renderItem={renderContentItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <>
                <View style={styles.detailHeader}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setSelectedContent(null)}
                  >
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.detailTitle}>{selectedContent.title}</Text>
                    <Text style={styles.detailMeta}>
                      Bahasa {selectedContent.language} • {selectedContent.count} item
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleBatchValidation('reject')}
                  >
                    <Text style={styles.actionButtonText}>Tolak</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleBatchValidation('approve')}
                  >
                    <Text style={styles.actionButtonText}>Terima Semua</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={vocabularyItems}
                  renderItem={renderVocabularyItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.listContainer}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  filterText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  contentList: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    backgroundColor: 'white',
  },
  contentDetail: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 16,
  },
  contentItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedContentItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  contentTypeIcon: {
    marginRight: 16,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  contentMeta: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 8,
  },
  contentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentCount: {
    fontSize: 12,
    color: Colors.lightText,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noSelectionText: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    marginRight: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  detailMeta: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#FFEBEE',
  },
  approveButton: {
    backgroundColor: '#E8F5E9',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  vocabularyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  vocabularyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vocabularyTerms: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vocabularyOriginal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  vocabularyArrow: {
    fontSize: 18,
    color: Colors.lightText,
    marginHorizontal: 8,
  },
  vocabularyTranslation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  validationButton: {
    padding: 4,
  },
  validatedButton: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  notValidatedButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  vocabularyDetails: {
    marginBottom: 8,
  },
  vocabularyLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 2,
  },
  vocabularyDescription: {
    fontSize: 14,
    color: Colors.text,
  },
  vocabularyExample: {
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
  },
  vocabularyCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default ContentValidationScreen; 