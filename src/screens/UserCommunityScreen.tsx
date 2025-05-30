import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

// Mock data for contributors
const mockContributors = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Guru Bahasa Indonesia',
    institution: 'SMA Negeri 1 Samarinda',
    contributions: 78,
    languages: ['Indonesia'],
    lastActive: '2 jam yang lalu',
    status: 'active',
    credibilityScore: 95
  },
  {
    id: '2',
    name: 'Dewi Kusuma',
    role: 'Guru Bahasa Kutai',
    institution: 'SMA Negeri 3 Tenggarong',
    contributions: 52,
    languages: ['Kutai'],
    lastActive: '1 hari yang lalu',
    status: 'active',
    credibilityScore: 88
  },
  {
    id: '3',
    name: 'Ahmad Rizal',
    role: 'Peneliti Bahasa',
    institution: 'Universitas Mulawarman',
    contributions: 120,
    languages: ['Kutai', 'Banjar'],
    lastActive: '3 hari yang lalu',
    status: 'active',
    credibilityScore: 97
  },
  {
    id: '4',
    name: 'Yanti Maharani',
    role: 'Budayawan',
    institution: 'Komunitas Budaya Banjar',
    contributions: 35,
    languages: ['Banjar'],
    lastActive: '1 minggu yang lalu',
    status: 'active',
    credibilityScore: 90
  },
  {
    id: '5',
    name: 'Taufik Hidayat',
    role: 'Guru Bahasa Dayak',
    institution: 'SMA Negeri 1 Palangkaraya',
    contributions: 28,
    languages: ['Dayak'],
    lastActive: '2 minggu yang lalu',
    status: 'inactive',
    credibilityScore: 85
  }
];

type Contributor = {
  id: string;
  name: string;
  role: string;
  institution: string;
  contributions: number;
  languages: string[];
  lastActive: string;
  status: string;
  credibilityScore: number;
};

interface UserCommunityScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const UserCommunityScreen = ({ navigation }: UserCommunityScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'teachers', 'researchers', 'community'
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Filter contributors based on search query and active tab
  const filteredContributors = mockContributors.filter(contributor => {
    const matchesSearch = 
      contributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contributor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contributor.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'teachers' && contributor.role.includes('Guru')) return true;
    if (activeTab === 'researchers' && contributor.role.includes('Peneliti')) return true;
    if (activeTab === 'community' && contributor.role.includes('Budayawan')) return true;
    
    return false;
  });

  // Contributor item renderer
  const renderContributorItem = ({ item }: { item: Contributor }) => (
    <TouchableOpacity 
      style={[
        styles.contributorItem,
        selectedContributor?.id === item.id && styles.selectedContributorItem
      ]}
      onPress={() => setSelectedContributor(item)}
    >
      <View style={styles.contributorHeader}>
        <View style={styles.contributorAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.contributorInfo}>
          <Text style={styles.contributorName}>{item.name}</Text>
          <Text style={styles.contributorRole}>{item.role}</Text>
          <Text style={styles.contributorInstitution}>{item.institution}</Text>
        </View>
        <View style={[
          styles.statusIndicator,
          item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
        ]} />
      </View>
      <View style={styles.contributorStats}>
        <View style={styles.statItem}>
          <Ionicons name="document-text-outline" size={14} color={Colors.lightText} />
          <Text style={styles.statText}>{item.contributions} kontribusi</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={14} color={Colors.lightText} />
          <Text style={styles.statText}>{item.lastActive}</Text>
        </View>
      </View>
      <View style={styles.languagesContainer}>
        {item.languages.map((language, index) => (
          <View key={index} style={styles.languageBadge}>
            <Text style={styles.languageText}>{language}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  // Custom navigation items for Language Office
  const navItems = [
    { title: 'Dashboard', route: 'LanguageOfficeDashboard', isActive: false, icon: 'dashboard' },
    { title: 'Validasi Konten', route: 'ContentValidation', isActive: false, icon: 'check-circle' },
    { title: 'Manajemen Bahasa', route: 'LanguageManagement', isActive: false, icon: 'language' },
    { title: 'Pengguna & Komunitas', route: 'UserCommunity', isActive: true, icon: 'people' },
    { title: 'Ekspor & Laporan', route: 'ReportsExport', isActive: false, icon: 'description' }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Pengguna & Komunitas" 
        showNotifications={true}
        showNavigation={true}
        activeNavItem="UserCommunity"
        customNavItems={navItems}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            activeTab === 'all' && styles.activeTabItem
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'all' && styles.activeTabText
          ]}>
            Semua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            activeTab === 'teachers' && styles.activeTabItem
          ]}
          onPress={() => setActiveTab('teachers')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'teachers' && styles.activeTabText
          ]}>
            Guru
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            activeTab === 'researchers' && styles.activeTabItem
          ]}
          onPress={() => setActiveTab('researchers')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'researchers' && styles.activeTabText
          ]}>
            Peneliti
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            activeTab === 'community' && styles.activeTabItem
          ]}
          onPress={() => setActiveTab('community')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'community' && styles.activeTabText
          ]}>
            Komunitas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.lightText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kontributor..."
          placeholderTextColor={Colors.lightText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.inviteButton}>
          <Ionicons name="person-add" size={20} color={Colors.primary} />
          <Text style={styles.inviteButtonText}>Undang</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isDesktop && selectedContributor ? (
          <View style={styles.desktopLayout}>
            <View style={styles.contributorsList}>
              <FlatList
                data={filteredContributors}
                renderItem={renderContributorItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
              />
            </View>
            <View style={styles.contributorDetail}>
              <View style={styles.detailHeader}>
                <View style={styles.detailAvatarLarge}>
                  <Text style={styles.avatarTextLarge}>{selectedContributor.name.charAt(0)}</Text>
                </View>
                <View style={styles.detailHeaderInfo}>
                  <Text style={styles.detailName}>{selectedContributor.name}</Text>
                  <Text style={styles.detailRole}>{selectedContributor.role}</Text>
                  <Text style={styles.detailInstitution}>{selectedContributor.institution}</Text>
                  <View style={styles.credibilityContainer}>
                    <Text style={styles.credibilityText}>Kredibilitas: </Text>
                    <View style={styles.credibilityBar}>
                      <View 
                        style={[
                          styles.credibilityFill,
                          { width: `${selectedContributor.credibilityScore}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.credibilityScore}>{selectedContributor.credibilityScore}%</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Kirim Pesan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Edit Profil</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    selectedContributor.status === 'active' ? styles.deactivateButton : styles.activateButton
                  ]}
                >
                  <Ionicons 
                    name={selectedContributor.status === 'active' ? "close-circle-outline" : "checkmark-circle-outline"} 
                    size={20} 
                    color={selectedContributor.status === 'active' ? "#F44336" : "#4CAF50"} 
                  />
                  <Text 
                    style={[
                      styles.actionButtonText,
                      selectedContributor.status === 'active' ? styles.deactivateText : styles.activateText
                    ]}
                  >
                    {selectedContributor.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.contributionSection}>
                <Text style={styles.sectionTitle}>Ringkasan Kontribusi</Text>
                <View style={styles.contributionSummary}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{selectedContributor.contributions}</Text>
                    <Text style={styles.summaryLabel}>Total Kontribusi</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{selectedContributor.languages.length}</Text>
                    <Text style={styles.summaryLabel}>Bahasa</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{selectedContributor.lastActive}</Text>
                    <Text style={styles.summaryLabel}>Terakhir Aktif</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.contributionListSection}>
                <Text style={styles.sectionTitle}>Kontribusi Terbaru</Text>
                <View style={styles.emptyContributions}>
                  <Ionicons name="document-text-outline" size={64} color="#CCC" />
                  <Text style={styles.emptyText}>
                    Daftar kontribusi terbaru akan ditampilkan di sini
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredContributors}
            renderItem={renderContributorItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
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
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  inviteButtonText: {
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
  contributorsList: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    backgroundColor: 'white',
  },
  contributorDetail: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  listContainer: {
    padding: 16,
  },
  contributorItem: {
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
  selectedContributorItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  contributorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contributorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contributorInfo: {
    flex: 1,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  contributorRole: {
    fontSize: 14,
    color: Colors.text,
  },
  contributorInstitution: {
    fontSize: 12,
    color: Colors.lightText,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeStatus: {
    backgroundColor: '#4CAF50',
  },
  inactiveStatus: {
    backgroundColor: '#9E9E9E',
  },
  contributorStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  languageText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  detailHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  detailAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  avatarTextLarge: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  detailHeaderInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  detailRole: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  detailInstitution: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 8,
  },
  credibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credibilityText: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 8,
  },
  credibilityBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  credibilityFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  credibilityScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  deactivateButton: {
    backgroundColor: '#FFEBEE',
  },
  activateButton: {
    backgroundColor: '#E8F5E9',
  },
  deactivateText: {
    color: '#F44336',
  },
  activateText: {
    color: '#4CAF50',
  },
  contributionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  contributionSummary: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  contributionListSection: {
    flex: 1,
  },
  emptyContributions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default UserCommunityScreen; 