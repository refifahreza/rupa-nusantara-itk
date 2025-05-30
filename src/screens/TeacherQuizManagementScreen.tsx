import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  useWindowDimensions,
  FlatList
} from 'react-native';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Header from '../components/layout/Header';

type RootStackParamList = {
  TeacherDashboard: undefined;
  TeacherQuizManagement: undefined;
  TeacherContributor: undefined;
  CreateQuiz: undefined;
  QuizDetails: { quizCode: string };
};

// Ensure the global type is available
declare global {
  var createdQuizzes: any[];
}

// Sample quiz data
const sampleQuizzes = [
  {
    code: 'RPN1234',
    title: 'Kuis Budaya Kaltim 1',
    description: 'Pengetahuan dasar tentang budaya Kalimantan Timur',
    createdAt: '2024-06-01',
    questionsCount: 10,
    completedBy: 15,
    averageScore: 78
  },
  {
    code: 'RPN5678',
    title: 'Kuis Bahasa Daerah Berau',
    description: 'Kosakata dan ungkapan dalam bahasa Berau',
    createdAt: '2024-05-25',
    questionsCount: 8,
    completedBy: 23,
    averageScore: 65
  },
  {
    code: 'RPN9012',
    title: 'Kuis Seni Tradisional',
    description: 'Mengenal seni dan kerajinan khas Kalimantan Timur',
    createdAt: '2024-05-15',
    questionsCount: 12,
    completedBy: 18,
    averageScore: 82
  }
];

// Sample student results
const sampleResults = [
  { quizCode: 'RPN1234', studentId: '1', studentName: 'Andi Putra', score: 90, completedAt: '2024-06-02' },
  { quizCode: 'RPN1234', studentId: '2', studentName: 'Budi Santoso', score: 75, completedAt: '2024-06-02' },
  { quizCode: 'RPN1234', studentId: '3', studentName: 'Cindy Larasati', score: 95, completedAt: '2024-06-03' },
  { quizCode: 'RPN5678', studentId: '1', studentName: 'Andi Putra', score: 80, completedAt: '2024-05-26' },
  { quizCode: 'RPN5678', studentId: '4', studentName: 'Deni Wijaya', score: 65, completedAt: '2024-05-27' },
  { quizCode: 'RPN9012', studentId: '2', studentName: 'Budi Santoso', score: 70, completedAt: '2024-05-16' },
  { quizCode: 'RPN9012', studentId: '3', studentName: 'Cindy Larasati', score: 100, completedAt: '2024-05-17' },
];

const TeacherQuizManagementScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('manage'); // 'create', 'manage', 'reports'
  const [selectedQuizCode, setSelectedQuizCode] = useState<string | null>(null);
  const [allQuizzes, setAllQuizzes] = useState([...sampleQuizzes]);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // Load quizzes when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Load any newly created quizzes
      loadCreatedQuizzes();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Load quizzes created in the CreateQuizScreen
  const loadCreatedQuizzes = () => {
    if (global.createdQuizzes && global.createdQuizzes.length > 0) {
      // Process the created quizzes to match the format expected by the UI
      const newQuizzes = global.createdQuizzes.map(quiz => ({
        code: quiz.code,
        title: quiz.title,
        description: quiz.description,
        createdAt: quiz.createdAt,
        questionsCount: quiz.questions ? quiz.questions.length : 0,
        completedBy: 0, // New quizzes have no completions yet
        averageScore: 0 // New quizzes have no scores yet
      }));
      
      // Update the quizzes state with both sample and created quizzes
      // Remove duplicates by checking quiz codes
      const existingCodes = new Set(allQuizzes.map(q => q.code));
      const uniqueNewQuizzes = newQuizzes.filter(q => !existingCodes.has(q.code));
      
      if (uniqueNewQuizzes.length > 0) {
        setAllQuizzes(prevQuizzes => [...prevQuizzes, ...uniqueNewQuizzes]);
      }
    }
  };

  // Filter quizzes based on search query
  const filteredQuizzes = searchQuery 
    ? allQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allQuizzes;

  // Get results for a specific quiz
  const getQuizResults = (quizCode: string) => {
    return sampleResults.filter(result => result.quizCode === quizCode);
  };

  // Filter all results based on search query
  const filteredResults = searchQuery
    ? sampleResults.filter(result =>
        result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.quizCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleResults;

  const handleCreateQuiz = () => {
    navigation.navigate('CreateQuiz');
  };

  const handleViewQuizDetails = (quizCode: string) => {
    navigation.navigate('QuizDetails', { quizCode });
  };

  const toggleQuizSelection = (quizCode: string) => {
    if (selectedQuizCode === quizCode) {
      setSelectedQuizCode(null);
    } else {
      setSelectedQuizCode(quizCode);
    }
  };
  
  const generateQuizCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let code = 'RPN';
    
    // Add 4 random characters
    for (let i = 0; i < 4; i++) {
      if (Math.random() > 0.5) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
      } else {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
    }
    
    return code;
  };

  // Render a quiz card
  const renderQuizCard = (quiz: any) => {
    const isSelected = selectedQuizCode === quiz.code;
    const results = getQuizResults(quiz.code);
    
    return (
      <View style={[styles.quizCard, isSelected && styles.selectedCard]} key={quiz.code}>
        <TouchableOpacity 
          style={styles.quizCardHeader}
          onPress={() => toggleQuizSelection(quiz.code)}
        >
          <View style={styles.quizIconContainer}>
            <Ionicons name="help-circle-outline" size={28} color={Colors.primary} />
          </View>
          <View style={styles.quizInfo}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizDescription}>{quiz.description}</Text>
            <View style={styles.quizMetaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="key-outline" size={14} color={Colors.lightText} />
                <Text style={styles.metaText}>Kode: {quiz.code}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color={Colors.lightText} />
                <Text style={styles.metaText}>Dibuat: {quiz.createdAt}</Text>
              </View>
            </View>
          </View>
          <View style={styles.quizStats}>
            <View style={styles.statCircle}>
              <Text style={styles.statNumber}>{quiz.completedBy}</Text>
              <Text style={styles.statLabel}>Peserta</Text>
            </View>
            <View style={styles.statCircle}>
              <Text style={styles.statNumber}>{quiz.averageScore}</Text>
              <Text style={styles.statLabel}>Rata-rata</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {isSelected && (
          <View style={styles.quizDetailsSection}>
            <View style={styles.sectionDivider} />
            
            <View style={styles.quizActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="copy-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Salin Kode</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                <Text style={[styles.actionButtonText, { color: "#FF3B30" }]}>Hapus</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.sectionDivider} />
            
            <Text style={styles.sectionTitle}>Hasil Siswa</Text>
            
            {results.length > 0 ? (
              <View style={styles.resultsTable}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>Nama Siswa</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Skor</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Tanggal</Text>
                </View>
                
                {results.map((result) => (
                  <View key={`${result.quizCode}-${result.studentId}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{result.studentName}</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{result.score}</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{result.completedAt}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noResultsText}>Belum ada siswa yang mengerjakan kuis ini</Text>
            )}
            
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewQuizDetails(quiz.code)}
            >
              <Text style={styles.viewDetailsText}>Lihat Detail Lengkap</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render a result row
  const renderResultRow = (result: any) => {
    const quiz = allQuizzes.find(q => q.code === result.quizCode);
    
    return (
      <View style={styles.resultRow} key={`${result.quizCode}-${result.studentId}`}>
        <View style={styles.resultContent}>
          <Text style={styles.resultStudentName}>{result.studentName}</Text>
          <View style={styles.resultQuizInfo}>
            <Text style={styles.resultQuizTitle}>{quiz?.title}</Text>
            <Text style={styles.resultQuizCode}>Kode: {result.quizCode}</Text>
          </View>
        </View>
        
        <View style={styles.resultScore}>
          <View style={[
            styles.scoreCircle,
            result.score >= 80 ? styles.highScore :
            result.score >= 60 ? styles.mediumScore :
            styles.lowScore
          ]}>
            <Text style={styles.scoreText}>{result.score}</Text>
          </View>
          <Text style={styles.resultDate}>{result.completedAt}</Text>
        </View>
      </View>
    );
  };
  
  // Create Quiz Tab Content
  const renderCreateQuizTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.createQuizCard}>
          <Text style={styles.createQuizTitle}>Buat Kuis Baru</Text>
          <Text style={styles.createQuizDescription}>
            Buat kuis dengan pertanyaan pilihan ganda, audio, dan teks untuk menguji 
            pengetahuan siswa tentang bahasa dan budaya nusantara.
          </Text>
          
          <View style={styles.createQuizFeatures}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="help-circle-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.featureTitle}>Pilihan Ganda</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="mic-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.featureTitle}>Audio</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="document-text-outline" size={24} color="#FF9800" />
              </View>
              <Text style={styles.featureTitle}>Teks</Text>
            </View>
          </View>
          
          <View style={styles.codeGeneratorContainer}>
            <Text style={styles.codeGeneratorTitle}>Kode Kuis Dibuat Otomatis</Text>
            <View style={styles.generatedCodeContainer}>
              <Text style={styles.generatedCodeText}>{generateQuizCode()}</Text>
              <TouchableOpacity style={styles.refreshCodeButton}>
                <Ionicons name="refresh" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.codeHelperText}>
              Kode unik 6 digit akan diberikan ke kuis Anda. Bagikan kode ini kepada siswa agar mereka dapat mengakses kuis.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.startCreatingButton}
            onPress={handleCreateQuiz}
          >
            <Text style={styles.startCreatingButtonText}>Mulai Membuat Kuis</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Manage Quiz Tab Content
  const renderManageQuizTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.lightText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kuis..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>
        
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map(quiz => renderQuizCard(quiz))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="help-circle-outline" size={64} color={Colors.primary + '40'} />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? "Tidak ada kuis yang ditemukan" : "Belum ada kuis"}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? "Coba gunakan kata kunci yang berbeda" 
                : "Buat kuis pertama Anda dengan menekan tombol 'Buat Kuis'"
              }
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Reports Tab Content
  const renderReportsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.lightText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari hasil berdasarkan nama siswa..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>
        
        {filteredResults.length > 0 ? (
          <View>
            <View style={styles.reportActions}>
              <TouchableOpacity style={styles.reportActionButton}>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
                <Text style={styles.reportActionText}>Download Laporan</Text>
              </TouchableOpacity>
            </View>
            
            {filteredResults.map(result => renderResultRow(result))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.primary + '40'} />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? "Tidak ada hasil yang ditemukan" : "Belum ada hasil kuis"}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? "Coba gunakan kata kunci yang berbeda" 
                : "Hasil akan muncul setelah siswa mengerjakan kuis"
              }
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Manajemen Kuis"
        showNotifications={true}
      />
      
      <View style={styles.content}>
        {/* Header section */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.screenTitle}>Manajemen Kuis</Text>
            <Text style={styles.screenSubtitle}>Buat dan kelola kuis untuk siswa</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'create' && styles.activeTab]}
            onPress={() => setActiveTab('create')}
          >
            <Ionicons 
              name={activeTab === 'create' ? "add-circle" : "add-circle-outline"} 
              size={20} 
              color={activeTab === 'create' ? Colors.primary : Colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
              Buat Kuis
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'manage' && styles.activeTab]}
            onPress={() => setActiveTab('manage')}
          >
            <Ionicons 
              name={activeTab === 'manage' ? "list" : "list-outline"} 
              size={20} 
              color={activeTab === 'manage' ? Colors.primary : Colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'manage' && styles.activeTabText]}>
              Kelola Kuis
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
            onPress={() => setActiveTab('reports')}
          >
            <Ionicons 
              name={activeTab === 'reports' ? "document-text" : "document-text-outline"} 
              size={20} 
              color={activeTab === 'reports' ? Colors.primary : Colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
              Laporan
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <ScrollView style={styles.mainContent}>
          {activeTab === 'create' && renderCreateQuizTab()}
          {activeTab === 'manage' && renderManageQuizTab()}
          {activeTab === 'reports' && renderReportsTab()}
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
  tabContent: {
    padding: 16,
  },
  // Create Quiz Tab
  createQuizCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  createQuizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  createQuizDescription: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 24,
  },
  createQuizFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  featureItem: {
    alignItems: 'center',
    width: '30%',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  codeGeneratorContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  codeGeneratorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  generatedCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  generatedCodeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  refreshCodeButton: {
    padding: 8,
  },
  codeHelperText: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 20,
  },
  startCreatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startCreatingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  // Existing styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.text,
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  quizCardHeader: {
    flexDirection: 'row',
    padding: 20,
  },
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  quizDescription: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  quizMetaInfo: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: Colors.lightText,
    marginLeft: 6,
  },
  quizStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.lightText,
  },
  quizDetailsSection: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  quizActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 15,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  resultsTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCell: {
    fontSize: 15,
    color: Colors.text,
  },
  noResultsText: {
    fontSize: 15,
    color: Colors.lightText,
    textAlign: 'center',
    padding: 24,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  viewDetailsText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: 'bold',
    marginRight: 6,
  },
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
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultStudentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  resultQuizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resultQuizTitle: {
    fontSize: 15,
    color: Colors.text,
    marginRight: 10,
  },
  resultQuizCode: {
    fontSize: 13,
    color: Colors.lightText,
  },
  resultScore: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  highScore: {
    backgroundColor: '#E8F5E9',
  },
  mediumScore: {
    backgroundColor: '#FFF8E1',
  },
  lowScore: {
    backgroundColor: '#FFEBEE',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  resultDate: {
    fontSize: 13,
    color: Colors.lightText,
  },
  // Report actions
  reportActions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reportActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reportActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
  },
});

export default TeacherQuizManagementScreen; 