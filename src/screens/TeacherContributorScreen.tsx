import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  useWindowDimensions,
  Image,
  Modal
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Header from '../components/layout/Header';

type RootStackParamList = {
  TeacherDashboard: undefined;
  TeacherQuizManagement: undefined;
  TeacherContributor: undefined;
};

// Sample contribution data
const sampleContributions = [
  {
    id: '1',
    title: 'Cerita Rakyat Berau: Asal Usul Gunung Tabur',
    language: 'Bahasa Berau',
    category: 'Cerita',
    status: 'Diterima',
    submittedAt: '2024-05-15',
    hasAudio: true,
    hasImage: true
  },
  {
    id: '2',
    title: 'Kosakata Harian Bahasa Kutai',
    language: 'Bahasa Kutai',
    category: 'Kosakata',
    status: 'Ditinjau',
    submittedAt: '2024-06-01',
    hasAudio: true,
    hasImage: false
  },
  {
    id: '3',
    title: 'Lagu Tradisional Paser: Tumbang Apui',
    language: 'Bahasa Paser',
    category: 'Lagu',
    status: 'Ditolak',
    submittedAt: '2024-05-22',
    hasAudio: true,
    hasImage: true
  }
];

// Language options
const languageOptions = [
  'Bahasa Berau', 'Bahasa Kutai', 'Bahasa Paser', 'Bahasa Tidung', 
  'Bahasa Dayak Kenyah', 'Bahasa Dayak Benuaq', 'Bahasa Dayak Bahau', 'Lainnya'
];

// Category options
const categoryOptions = [
  'Cerita', 'Kosakata', 'Lagu', 'Peribahasa', 'Percakapan', 'Lainnya'
];

const TeacherContributorScreen = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [includeImage, setIncludeImage] = useState(false);
  
  // Contributions list
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'history'
  const [contributions, setContributions] = useState(sampleContributions);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const handleUpload = () => {
    if (!title || !selectedLanguage || !selectedCategory) {
      // In a real app, show validation errors
      return;
    }
    
    // In a real app, this would upload to a server
    const newContribution = {
      id: (contributions.length + 1).toString(),
      title,
      language: selectedLanguage,
      category: selectedCategory,
      description,
      status: 'Ditinjau',
      submittedAt: new Date().toISOString().split('T')[0],
      hasAudio: includeAudio,
      hasImage: includeImage
    };
    
    setContributions([newContribution, ...contributions]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedLanguage('');
    setSelectedCategory('');
    setIncludeAudio(false);
    setIncludeImage(false);
    
    // Switch to history tab to show the new contribution
    setActiveTab('history');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Diterima':
        return '#4CAF50';
      case 'Ditinjau':
        return '#FF9800';
      case 'Ditolak':
        return '#F44336';
      default:
        return Colors.lightText;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Kontributor Bahasa"
        showNotifications={true}
      />
      
      <View style={styles.content}>
        {/* Header section */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.screenTitle}>Kontributor Bahasa</Text>
            <Text style={styles.screenSubtitle}>Unggah dan kelola kontribusi bahasa daerah</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upload' && styles.activeTab]}
            onPress={() => setActiveTab('upload')}
          >
            <Ionicons 
              name={activeTab === 'upload' ? "cloud-upload" : "cloud-upload-outline"} 
              size={20} 
              color={activeTab === 'upload' ? Colors.primary : Colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>
              Unggah Warisan Bahasa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Ionicons 
              name={activeTab === 'history' ? "time" : "time-outline"} 
              size={20} 
              color={activeTab === 'history' ? Colors.primary : Colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              Riwayat Kontribusi
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <ScrollView style={styles.mainContent}>
          {activeTab === 'upload' ? (
            <View style={styles.uploadContainer}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Unggah Warisan Bahasa</Text>
                <Text style={styles.formDescription}>
                  Bagikan pengetahuan bahasa daerah Anda untuk melestarikan warisan budaya nusantara.
                  Semua kontribusi akan ditinjau oleh tim kami sebelum dipublikasikan.
                </Text>
                
                {/* Title Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Judul</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Contoh: Cerita Rakyat Berau, Kosakata Bahasa Dayak"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
                
                {/* Language Selection */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bahasa</Text>
                  <TouchableOpacity 
                    style={styles.dropdownContainer}
                    onPress={() => setShowLanguageOptions(!showLanguageOptions)}
                  >
                    <Text style={[styles.dropdownText, !selectedLanguage && styles.placeholderText]}>
                      {selectedLanguage || "Pilih bahasa daerah"}
                    </Text>
                    <Ionicons 
                      name={showLanguageOptions ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={Colors.lightText} 
                    />
                  </TouchableOpacity>
                  
                  <Modal
                    visible={showLanguageOptions}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowLanguageOptions(false)}
                  >
                    <TouchableOpacity 
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setShowLanguageOptions(false)}
                    >
                      <View style={[styles.dropdownOptionsModal, {top: 320}]}>
                        <ScrollView>
                          {languageOptions.map((language, index) => (
                            <TouchableOpacity 
                              key={index} 
                              style={styles.optionItem}
                              onPress={() => {
                                setSelectedLanguage(language);
                                setShowLanguageOptions(false);
                              }}
                            >
                              <Text style={[
                                styles.optionText,
                                selectedLanguage === language && styles.selectedOptionText
                              ]}>
                                {language}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
                
                {/* Category Selection */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Kategori</Text>
                  <TouchableOpacity 
                    style={styles.dropdownContainer}
                    onPress={() => setShowCategoryOptions(!showCategoryOptions)}
                  >
                    <Text style={[styles.dropdownText, !selectedCategory && styles.placeholderText]}>
                      {selectedCategory || "Pilih kategori"}
                    </Text>
                    <Ionicons 
                      name={showCategoryOptions ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={Colors.lightText} 
                    />
                  </TouchableOpacity>
                  
                  <Modal
                    visible={showCategoryOptions}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCategoryOptions(false)}
                  >
                    <TouchableOpacity 
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setShowCategoryOptions(false)}
                    >
                      <View style={[styles.dropdownOptionsModal, {top: 420}]}>
                        <ScrollView>
                          {categoryOptions.map((category, index) => (
                            <TouchableOpacity 
                              key={index} 
                              style={styles.optionItem}
                              onPress={() => {
                                setSelectedCategory(category);
                                setShowCategoryOptions(false);
                              }}
                            >
                              <Text style={[
                                styles.optionText,
                                selectedCategory === category && styles.selectedOptionText
                              ]}>
                                {category}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
                
                {/* Description Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Deskripsi</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Tambahkan deskripsi atau konten teks di sini"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
                
                {/* Media Options */}
                <View style={styles.mediaOptionsContainer}>
                  <View style={styles.mediaOption}>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={includeAudio}
                        onValueChange={setIncludeAudio}
                        trackColor={{ false: '#E0E0E0', true: Colors.primary + '50' }}
                        thumbColor={includeAudio ? Colors.primary : '#F5F5F5'}
                      />
                      <Text style={styles.switchLabel}>Tambahkan Audio</Text>
                    </View>
                    
                    {includeAudio && (
                      <TouchableOpacity style={styles.uploadButton}>
                        <Ionicons name="mic-outline" size={20} color="white" />
                        <Text style={styles.uploadButtonText}>Rekam Audio</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <View style={styles.mediaOption}>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={includeImage}
                        onValueChange={setIncludeImage}
                        trackColor={{ false: '#E0E0E0', true: Colors.primary + '50' }}
                        thumbColor={includeImage ? Colors.primary : '#F5F5F5'}
                      />
                      <Text style={styles.switchLabel}>Tambahkan Gambar</Text>
                    </View>
                    
                    {includeImage && (
                      <TouchableOpacity style={styles.uploadButton}>
                        <Ionicons name="image-outline" size={20} color="white" />
                        <Text style={styles.uploadButtonText}>Pilih Gambar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                {/* Submit Button */}
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleUpload}
                >
                  <Text style={styles.submitButtonText}>Unggah Kontribusi</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.historyContainer}>
              {contributions.length > 0 ? (
                contributions.map(contribution => (
                  <View key={contribution.id} style={styles.contributionCard}>
                    <View style={styles.contributionHeader}>
                      <View>
                        <Text style={styles.contributionTitle}>{contribution.title}</Text>
                        <View style={styles.contributionMeta}>
                          <Text style={styles.metaText}>{contribution.language}</Text>
                          <Text style={styles.metaText}>•</Text>
                          <Text style={styles.metaText}>{contribution.category}</Text>
                        </View>
                      </View>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: getStatusColor(contribution.status) + '20' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(contribution.status) }
                        ]}>
                          {contribution.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.contributionDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color={Colors.lightText} />
                        <Text style={styles.detailText}>Diunggah: {contribution.submittedAt}</Text>
                      </View>
                      
                      <View style={styles.mediaIndicators}>
                        {contribution.hasAudio && (
                          <View style={styles.mediaIndicator}>
                            <Ionicons name="musical-note" size={16} color={Colors.primary} />
                            <Text style={styles.mediaIndicatorText}>Audio</Text>
                          </View>
                        )}
                        
                        {contribution.hasImage && (
                          <View style={styles.mediaIndicator}>
                            <Ionicons name="image" size={16} color={Colors.primary} />
                            <Text style={styles.mediaIndicatorText}>Gambar</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.contributionActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="create-outline" size={18} color={Colors.primary} />
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="eye-outline" size={18} color={Colors.primary} />
                        <Text style={styles.actionButtonText}>Lihat</Text>
                      </TouchableOpacity>
                      
                      {contribution.status === 'Ditinjau' && (
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                          <Ionicons name="trash-outline" size={18} color="#F44336" />
                          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Hapus</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={64} color={Colors.primary + '40'} />
                  <Text style={styles.emptyStateTitle}>Belum Ada Kontribusi</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Mulai berkontribusi untuk melestarikan bahasa daerah dengan mengunggah konten.
                  </Text>
                </View>
              )}
            </View>
          )}
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
  },
  headerSection: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  screenSubtitle: {
    fontSize: 15,
    color: Colors.lightText,
    marginTop: 4,
  },
  // Tab styles
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 8,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
  },
  // Upload Tab
  uploadContainer: {
    padding: 16,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  dropdownContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.lightText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownOptionsModal: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    maxHeight: 300,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  mediaOptionsContainer: {
    marginBottom: 24,
  },
  mediaOption: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 48,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // History Tab
  historyContainer: {
    padding: 16,
  },
  contributionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  contributionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: Colors.lightText,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  contributionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.lightText,
    marginLeft: 6,
  },
  mediaIndicators: {
    flexDirection: 'row',
  },
  mediaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  mediaIndicatorText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  contributionActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  deleteButton: {
    marginLeft: 'auto',
    marginRight: 0,
  },
  deleteButtonText: {
    color: '#F44336',
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: Colors.lightText,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});

export default TeacherContributorScreen; 