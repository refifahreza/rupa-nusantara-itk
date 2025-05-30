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
  useWindowDimensions,
  Image
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

// Mock data for languages
const mockLanguages = [
  {
    id: '1',
    name: 'Indonesia',
    region: 'Nasional',
    speakers: 270000000,
    status: 'safe',
    vitality: 5,
    lastUpdated: '25 Juni 2023',
    vocabularyCount: 100000,
    documentation: 'Lengkap',
    hasAudio: true,
    hasMap: true
  },
  {
    id: '2',
    name: 'Kutai',
    region: 'Kalimantan Timur',
    speakers: 380000,
    status: 'vulnerable',
    vitality: 3,
    lastUpdated: '15 Juni 2023',
    vocabularyCount: 1850,
    documentation: 'Sebagian',
    hasAudio: true,
    hasMap: true
  },
  {
    id: '3',
    name: 'Banjar',
    region: 'Kalimantan Selatan',
    speakers: 3500000,
    status: 'vulnerable',
    vitality: 3,
    lastUpdated: '10 Juni 2023',
    vocabularyCount: 2450,
    documentation: 'Sebagian',
    hasAudio: true,
    hasMap: false
  },
  {
    id: '4',
    name: 'Dayak',
    region: 'Kalimantan',
    speakers: 3000000,
    status: 'vulnerable',
    vitality: 3,
    lastUpdated: '5 Juni 2023',
    vocabularyCount: 2100,
    documentation: 'Sebagian',
    hasAudio: false,
    hasMap: true
  }
];

// Define status colors
const statusColors = {
  'safe': '#4CAF50',
  'vulnerable': '#FFC107',
  'definitely endangered': '#FF9800',
  'severely endangered': '#F44336',
  'critically endangered': '#D32F2F',
  'extinct': '#757575'
};

type Language = {
  id: string;
  name: string;
  region: string;
  speakers: number;
  status: string;
  vitality: number;
  lastUpdated: string;
  vocabularyCount: number;
  documentation: string;
  hasAudio: boolean;
  hasMap: boolean;
};

interface LanguageManagementScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const LanguageManagementScreen = ({ navigation }: LanguageManagementScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'vocabulary', 'map'
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Filter languages based on search query
  const filteredLanguages = mockLanguages.filter(language => 
    language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    language.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get status color
  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#757575';
  };

  // Get vitality level text
  const getVitalityText = (level: number) => {
    switch(level) {
      case 5: return 'Aman';
      case 4: return 'Stabil';
      case 3: return 'Terancam';
      case 2: return 'Berisiko';
      case 1: return 'Kritis';
      case 0: return 'Punah';
      default: return 'Tidak diketahui';
    }
  };

  // Language item renderer
  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity 
      style={[
        styles.languageItem,
        selectedLanguage?.id === item.id && styles.selectedLanguageItem
      ]}
      onPress={() => setSelectedLanguage(item)}
    >
      <View style={styles.languageHeader}>
        <Text style={styles.languageName}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(item.status) }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.languageRegion}>{item.region}</Text>
      <View style={styles.languageStats}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={14} color={Colors.lightText} />
          <Text style={styles.statText}>{formatNumber(item.speakers)}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="book-outline" size={14} color={Colors.lightText} />
          <Text style={styles.statText}>{formatNumber(item.vocabularyCount)}</Text>
        </View>
        <View style={styles.languageIcons}>
          {item.hasAudio && (
            <Ionicons name="mic" size={14} color={Colors.primary} style={styles.featureIcon} />
          )}
          {item.hasMap && (
            <Ionicons name="map" size={14} color={Colors.primary} style={styles.featureIcon} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Custom navigation items for Language Office
  const navItems = [
    { title: 'Dashboard', route: 'LanguageOfficeDashboard', isActive: false, icon: 'dashboard' },
    { title: 'Validasi Konten', route: 'ContentValidation', isActive: false, icon: 'check-circle' },
    { title: 'Manajemen Bahasa', route: 'LanguageManagement', isActive: true, icon: 'language' },
    { title: 'Pengguna & Komunitas', route: 'UserCommunity', isActive: false, icon: 'people' },
    { title: 'Ekspor & Laporan', route: 'ReportsExport', isActive: false, icon: 'description' }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Manajemen Bahasa" 
        showNotifications={true}
        showNavigation={true}
        activeNavItem="LanguageManagement"
        customNavItems={navItems}
      />

      <View style={styles.content}>
        {isDesktop ? (
          <View style={styles.desktopLayout}>
            <View style={styles.sidebar}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.lightText} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari bahasa..."
                  placeholderTextColor={Colors.lightText}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Daftar Bahasa Daerah</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add-circle" size={20} color={Colors.primary} />
                  <Text style={styles.addButtonText}>Tambah</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={filteredLanguages}
                renderItem={renderLanguageItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
              />
            </View>
            
            <View style={styles.detailContainer}>
              {selectedLanguage ? (
                <>
                  <View style={styles.detailHeader}>
                    <View>
                      <Text style={styles.detailTitle}>Bahasa {selectedLanguage.name}</Text>
                      <Text style={styles.detailRegion}>{selectedLanguage.region}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="create-outline" size={20} color={Colors.primary} />
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="cloud-download-outline" size={20} color={Colors.primary} />
                        <Text style={styles.actionButtonText}>Ekspor</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.tabBar}>
                    <TouchableOpacity 
                      style={[
                        styles.tabItem, 
                        activeTab === 'info' && styles.activeTabItem
                      ]}
                      onPress={() => setActiveTab('info')}
                    >
                      <Text style={[
                        styles.tabText,
                        activeTab === 'info' && styles.activeTabText
                      ]}>
                        Informasi Umum
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.tabItem, 
                        activeTab === 'vocabulary' && styles.activeTabItem
                      ]}
                      onPress={() => setActiveTab('vocabulary')}
                    >
                      <Text style={[
                        styles.tabText,
                        activeTab === 'vocabulary' && styles.activeTabText
                      ]}>
                        Kosakata
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.tabItem, 
                        activeTab === 'map' && styles.activeTabItem
                      ]}
                      onPress={() => setActiveTab('map')}
                    >
                      <Text style={[
                        styles.tabText,
                        activeTab === 'map' && styles.activeTabText
                      ]}>
                        Peta Bahasa
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.detailContent}>
                    {activeTab === 'info' && (
                      <View style={styles.infoContainer}>
                        <View style={styles.statsRow}>
                          <View style={styles.statCard}>
                            <Text style={styles.statCardTitle}>Jumlah Penutur</Text>
                            <Text style={styles.statCardValue}>{formatNumber(selectedLanguage.speakers)}</Text>
                            <Text style={styles.statCardSubtitle}>orang</Text>
                          </View>
                          <View style={styles.statCard}>
                            <Text style={styles.statCardTitle}>Status UNESCO</Text>
                            <View style={[
                              styles.statusIndicator,
                              { backgroundColor: getStatusColor(selectedLanguage.status) }
                            ]} />
                            <Text style={styles.statCardValue}>{selectedLanguage.status}</Text>
                          </View>
                          <View style={styles.statCard}>
                            <Text style={styles.statCardTitle}>Tingkat Vitalitas</Text>
                            <Text style={styles.statCardValue}>{selectedLanguage.vitality}/5</Text>
                            <Text style={styles.statCardSubtitle}>{getVitalityText(selectedLanguage.vitality)}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.infoSection}>
                          <Text style={styles.sectionTitle}>Dokumentasi</Text>
                          <View style={styles.documentationContainer}>
                            <View style={styles.documentationItem}>
                              <Text style={styles.documentationLabel}>Tingkat Dokumentasi:</Text>
                              <Text style={styles.documentationValue}>{selectedLanguage.documentation}</Text>
                            </View>
                            <View style={styles.documentationItem}>
                              <Text style={styles.documentationLabel}>Jumlah Kosakata:</Text>
                              <Text style={styles.documentationValue}>{formatNumber(selectedLanguage.vocabularyCount)} kata</Text>
                            </View>
                            <View style={styles.documentationItem}>
                              <Text style={styles.documentationLabel}>Rekaman Audio:</Text>
                              <Text style={styles.documentationValue}>
                                {selectedLanguage.hasAudio ? 'Tersedia' : 'Belum tersedia'}
                              </Text>
                            </View>
                            <View style={styles.documentationItem}>
                              <Text style={styles.documentationLabel}>Peta Distribusi:</Text>
                              <Text style={styles.documentationValue}>
                                {selectedLanguage.hasMap ? 'Tersedia' : 'Belum tersedia'}
                              </Text>
                            </View>
                            <View style={styles.documentationItem}>
                              <Text style={styles.documentationLabel}>Terakhir Diperbarui:</Text>
                              <Text style={styles.documentationValue}>{selectedLanguage.lastUpdated}</Text>
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.infoSection}>
                          <Text style={styles.sectionTitle}>Tren Penggunaan Bahasa</Text>
                          <View style={styles.chartPlaceholder}>
                            <Text style={styles.chartPlaceholderText}>Grafik tren penggunaan bahasa akan ditampilkan di sini</Text>
                          </View>
                        </View>
                      </View>
                    )}
                    
                    {activeTab === 'vocabulary' && (
                      <View style={styles.vocabularyContainer}>
                        <View style={styles.vocabularyHeader}>
                          <Text style={styles.vocabularyTitle}>Kosakata Bahasa {selectedLanguage.name}</Text>
                          <View style={styles.vocabularyActions}>
                            <TouchableOpacity style={styles.vocabularyAction}>
                              <Ionicons name="cloud-upload-outline" size={18} color={Colors.primary} />
                              <Text style={styles.vocabularyActionText}>Import</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.vocabularyAction}>
                              <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
                              <Text style={styles.vocabularyActionText}>Tambah</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.vocabularyPlaceholder}>
                          <Text style={styles.vocabularyPlaceholderText}>
                            Daftar kosakata Bahasa {selectedLanguage.name} akan ditampilkan di sini
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {activeTab === 'map' && (
                      <View style={styles.mapContainer}>
                        <View style={styles.mapHeader}>
                          <Text style={styles.mapTitle}>Peta Distribusi Bahasa {selectedLanguage.name}</Text>
                          <TouchableOpacity style={styles.mapAction}>
                            <Ionicons name="create-outline" size={18} color={Colors.primary} />
                            <Text style={styles.mapActionText}>Edit Peta</Text>
                          </TouchableOpacity>
                        </View>
                        {selectedLanguage.hasMap ? (
                          <View style={styles.mapPlaceholder}>
                            <Text style={styles.mapPlaceholderText}>
                              Peta distribusi Bahasa {selectedLanguage.name} akan ditampilkan di sini
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.noMapContainer}>
                            <Ionicons name="map-outline" size={64} color="#CCC" />
                            <Text style={styles.noMapText}>
                              Peta distribusi untuk Bahasa {selectedLanguage.name} belum tersedia
                            </Text>
                            <TouchableOpacity style={styles.addMapButton}>
                              <Text style={styles.addMapButtonText}>Tambah Peta Baru</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </ScrollView>
                </>
              ) : (
                <View style={styles.noSelectionContainer}>
                  <Ionicons name="language-outline" size={64} color="#CCC" />
                  <Text style={styles.noSelectionText}>
                    Pilih bahasa dari daftar untuk melihat detail dan mengelola data bahasa
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <>
            {!selectedLanguage ? (
              <>
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={20} color={Colors.lightText} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Cari bahasa..."
                    placeholderTextColor={Colors.lightText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                
                <View style={styles.mobileSidebarHeader}>
                  <Text style={styles.sidebarTitle}>Daftar Bahasa Daerah</Text>
                  <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle" size={20} color={Colors.primary} />
                    <Text style={styles.addButtonText}>Tambah</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={filteredLanguages}
                  renderItem={renderLanguageItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.mobileListContainer}
                />
              </>
            ) : (
              <>
                <View style={styles.mobileDetailHeader}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setSelectedLanguage(null)}
                  >
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.detailTitle}>Bahasa {selectedLanguage.name}</Text>
                    <Text style={styles.detailRegion}>{selectedLanguage.region}</Text>
                  </View>
                </View>
                
                <View style={styles.tabBar}>
                  <TouchableOpacity 
                    style={[
                      styles.tabItem, 
                      activeTab === 'info' && styles.activeTabItem
                    ]}
                    onPress={() => setActiveTab('info')}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'info' && styles.activeTabText
                    ]}>
                      Info
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.tabItem, 
                      activeTab === 'vocabulary' && styles.activeTabItem
                    ]}
                    onPress={() => setActiveTab('vocabulary')}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'vocabulary' && styles.activeTabText
                    ]}>
                      Kosakata
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.tabItem, 
                      activeTab === 'map' && styles.activeTabItem
                    ]}
                    onPress={() => setActiveTab('map')}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'map' && styles.activeTabText
                    ]}>
                      Peta
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.mobileDetailContent}>
                  {activeTab === 'info' && (
                    <View style={styles.infoContainer}>
                      <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                          <Text style={styles.statCardTitle}>Jumlah Penutur</Text>
                          <Text style={styles.statCardValue}>{formatNumber(selectedLanguage.speakers)}</Text>
                          <Text style={styles.statCardSubtitle}>orang</Text>
                        </View>
                        <View style={styles.statCard}>
                          <Text style={styles.statCardTitle}>Status UNESCO</Text>
                          <View style={[
                            styles.statusIndicator,
                            { backgroundColor: getStatusColor(selectedLanguage.status) }
                          ]} />
                          <Text style={styles.statCardValue}>{selectedLanguage.status}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                          <Text style={styles.statCardTitle}>Tingkat Vitalitas</Text>
                          <Text style={styles.statCardValue}>{selectedLanguage.vitality}/5</Text>
                          <Text style={styles.statCardSubtitle}>{getVitalityText(selectedLanguage.vitality)}</Text>
                        </View>
                        <View style={styles.statCard}>
                          <Text style={styles.statCardTitle}>Dokumentasi</Text>
                          <Text style={styles.statCardValue}>{selectedLanguage.documentation}</Text>
                        </View>
                      </View>
                      
                      {/* Rest of mobile info tab similar to desktop but with adjusted layout */}
                    </View>
                  )}
                  
                  {/* Similar content for other tabs */}
                </ScrollView>
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
  content: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    backgroundColor: 'white',
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
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  mobileSidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  mobileListContainer: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  languageItem: {
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
  selectedLanguageItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  languageRegion: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 8,
  },
  languageStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  languageIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  featureIcon: {
    marginLeft: 8,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  mobileDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
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
  detailRegion: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionButtonText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tabItem: {
    paddingVertical: 12,
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
  detailContent: {
    flex: 1,
  },
  mobileDetailContent: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
  infoContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardTitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statCardSubtitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  documentationContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
  },
  documentationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  documentationLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  documentationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  vocabularyContainer: {
    padding: 16,
  },
  vocabularyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vocabularyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  vocabularyActions: {
    flexDirection: 'row',
  },
  vocabularyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  vocabularyActionText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  vocabularyPlaceholder: {
    height: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  vocabularyPlaceholderText: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
  },
  mapContainer: {
    padding: 16,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  mapAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapActionText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  mapPlaceholder: {
    height: 400,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
  },
  noMapContainer: {
    height: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noMapText: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addMapButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addMapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LanguageManagementScreen; 