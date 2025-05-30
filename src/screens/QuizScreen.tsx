import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  TextInput,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../components/layout/Layout';
import Colors from '../constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// Define Quiz types
interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  image?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: QuizQuestion[];
}

type RootStackParamList = {
  QuizTaking: { quiz: Quiz };
};

// Mock data for quizzes
const quizzes: Quiz[] = [
  {
    id: '1',
    title: 'Bahasa Daerah',
    description: 'Uji pengetahuan tentang bahasa daerah Kalimantan Timur',
    icon: '🔤',
    questions: [
      {
        id: '1',
        question: 'Apa arti kata "Endak pian?" dalam bahasa Kutai?',
        options: [
          { id: 'a', text: 'Apa kabar?', isCorrect: true },
          { id: 'b', text: 'Mau kemana?', isCorrect: false },
          { id: 'c', text: 'Sudah makan?', isCorrect: false },
          { id: 'd', text: 'Siapa nama kamu?', isCorrect: false },
        ],
        explanation: '"Endak pian?" adalah ungkapan dalam bahasa Kutai yang berarti "Apa kabar?" atau "Bagaimana kabarmu?"'
      },
      {
        id: '2',
        question: 'Apa arti kata "Kuman" dalam bahasa Dayak?',
        options: [
          { id: 'a', text: 'Tidur', isCorrect: false },
          { id: 'b', text: 'Makan', isCorrect: true },
          { id: 'c', text: 'Mandi', isCorrect: false },
          { id: 'd', text: 'Berjalan', isCorrect: false },
        ],
        explanation: '"Kuman" dalam bahasa Dayak berarti "Makan"'
      },
      {
        id: '3',
        question: 'Bahasa apa yang menggunakan kata "Ulun" untuk mengatakan "Saya"?',
        options: [
          { id: 'a', text: 'Bahasa Kutai', isCorrect: false },
          { id: 'b', text: 'Bahasa Dayak Kenyah', isCorrect: false },
          { id: 'c', text: 'Bahasa Banjar', isCorrect: true },
          { id: 'd', text: 'Bahasa Tidung', isCorrect: false },
        ],
        explanation: '"Ulun" adalah kata ganti orang pertama (saya/aku) dalam bahasa Banjar'
      },
    ]
  },
  {
    id: '2',
    title: 'Budaya & Tradisi',
    description: 'Tebak budaya dan tradisi Kalimantan Timur',
    icon: '🎭',
    questions: [
      {
        id: '1',
        question: 'Apa nama upacara adat tahunan Kesultanan Kutai Kartanegara?',
        options: [
          { id: 'a', text: 'Erau', isCorrect: true },
          { id: 'b', text: 'Gawai', isCorrect: false },
          { id: 'c', text: 'Laluba', isCorrect: false },
          { id: 'd', text: 'Tepung Tawar', isCorrect: false },
        ],
        explanation: 'Erau adalah upacara adat tahunan Kesultanan Kutai Kartanegara untuk memperingati penobatan raja atau sultan'
      },
      {
        id: '2',
        question: 'Hewan mitologi apakah yang menjadi lambang Kutai Kartanegara?',
        options: [
          { id: 'a', text: 'Naga', isCorrect: false },
          { id: 'b', text: 'Burung Enggang', isCorrect: false },
          { id: 'c', text: 'Lembuswana', isCorrect: true },
          { id: 'd', text: 'Harimau', isCorrect: false },
        ],
        explanation: 'Lembuswana adalah hewan mitologi yang memiliki gabungan dari lima hewan berbeda dan menjadi lambang Kutai Kartanegara'
      },
      {
        id: '3',
        question: 'Apa nama tarian tradisional Dayak yang menggunakan bambu panjang?',
        options: [
          { id: 'a', text: 'Tari Gantar', isCorrect: true },
          { id: 'b', text: 'Tari Kancet Ledo', isCorrect: false },
          { id: 'c', text: 'Tari Enggang', isCorrect: false },
          { id: 'd', text: 'Tari Hudoq', isCorrect: false },
        ],
        explanation: 'Tari Gantar adalah tarian tradisional suku Dayak yang menggunakan bambu panjang sebagai properti utama'
      },
    ]
  },
  {
    id: '3',
    title: 'Tempat & Geografi',
    description: 'Tebak lokasi dan tempat terkenal di Kalimantan Timur',
    icon: '🗺️',
    questions: [
      {
        id: '1',
        question: 'Danau dengan dua lapisan air (tawar dan asin) di Kalimantan Timur adalah...',
        options: [
          { id: 'a', text: 'Danau Semayang', isCorrect: false },
          { id: 'b', text: 'Danau Sentarum', isCorrect: false },
          { id: 'c', text: 'Danau Melintang', isCorrect: false },
          { id: 'd', text: 'Danau Labuan Cermin', isCorrect: true },
        ],
        explanation: 'Danau Labuan Cermin di Kabupaten Berau memiliki fenomena dua lapisan air, tawar di permukaan dan asin di bagian bawah'
      },
      {
        id: '2',
        question: 'Sungai terpanjang di Kalimantan Timur adalah...',
        options: [
          { id: 'a', text: 'Sungai Mahakam', isCorrect: true },
          { id: 'b', text: 'Sungai Kapuas', isCorrect: false },
          { id: 'c', text: 'Sungai Barito', isCorrect: false },
          { id: 'd', text: 'Sungai Berau', isCorrect: false },
        ],
        explanation: 'Sungai Mahakam adalah sungai terpanjang di Kalimantan Timur dengan panjang sekitar 980 km'
      },
      {
        id: '3',
        question: 'Pulau dengan terumbu karang yang indah di Kabupaten Berau adalah...',
        options: [
          { id: 'a', text: 'Pulau Kumala', isCorrect: false },
          { id: 'b', text: 'Pulau Derawan', isCorrect: true },
          { id: 'c', text: 'Pulau Beras Basah', isCorrect: false },
          { id: 'd', text: 'Pulau Lemukutan', isCorrect: false },
        ],
        explanation: 'Pulau Derawan terkenal dengan keindahan terumbu karang dan sebagai habitat penyu hijau dan penyu sisik'
      },
    ]
  },
];

// Sample teacher-created quizzes (accessible via code)
const teacherQuizzes: {[key: string]: Quiz} = {
  'RPN1234': {
    id: 'code-RPN1234',
    title: 'Kuis Budaya Kaltim 1',
    description: 'Pengetahuan dasar tentang budaya Kalimantan Timur',
    icon: '🏮',
    questions: [
      {
        id: '1',
        question: 'Apa rumah adat suku Dayak?',
        options: [
          { id: 'a', text: 'Lamin', isCorrect: true },
          { id: 'b', text: 'Tongkonan', isCorrect: false },
          { id: 'c', text: 'Gadang', isCorrect: false },
          { id: 'd', text: 'Lopo', isCorrect: false },
        ],
        explanation: 'Rumah Lamin adalah rumah adat suku Dayak yang biasanya dihuni oleh beberapa keluarga'
      },
      {
        id: '2',
        question: 'Alat musik tradisional dari Kalimantan Timur yang berbentuk seperti gamelan adalah...',
        options: [
          { id: 'a', text: 'Sampe', isCorrect: false },
          { id: 'b', text: 'Kelentangan', isCorrect: true },
          { id: 'c', text: 'Sapek', isCorrect: false },
          { id: 'd', text: 'Kangkurang', isCorrect: false },
        ],
        explanation: 'Kelentangan adalah alat musik pukul tradisional dari Kalimantan Timur yang terbuat dari logam'
      },
      {
        id: '3',
        question: 'Apa nama pakaian adat pria dari suku Kutai?',
        options: [
          { id: 'a', text: 'Sapei Sapaq', isCorrect: false },
          { id: 'b', text: 'Baju Hade', isCorrect: true },
          { id: 'c', text: 'Baju Teluk Belanga', isCorrect: false },
          { id: 'd', text: 'Perang', isCorrect: false },
        ],
        explanation: 'Baju Hade adalah pakaian adat pria suku Kutai yang biasanya berwarna kuning atau hitam'
      },
    ]
  },
  'RPN5678': {
    id: 'code-RPN5678',
    title: 'Kuis Bahasa Daerah Berau',
    description: 'Kosakata dan ungkapan dalam bahasa Berau',
    icon: '🔠',
    questions: [
      {
        id: '1',
        question: 'Apa arti kata "Betas" dalam bahasa Berau?',
        options: [
          { id: 'a', text: 'Air', isCorrect: false },
          { id: 'b', text: 'Orang', isCorrect: true },
          { id: 'c', text: 'Rumah', isCorrect: false },
          { id: 'd', text: 'Makan', isCorrect: false },
        ],
        explanation: '"Betas" dalam bahasa Berau berarti "Orang"'
      },
      {
        id: '2',
        question: 'Bagaimana cara mengucapkan "Apa kabar?" dalam bahasa Berau?',
        options: [
          { id: 'a', text: 'Apakabar ikam?', isCorrect: false },
          { id: 'b', text: 'Baik-baik jak?', isCorrect: true },
          { id: 'c', text: 'Sehat-sehat kah?', isCorrect: false },
          { id: 'd', text: 'Endak pian?', isCorrect: false },
        ],
        explanation: '"Baik-baik jak?" adalah ungkapan dalam bahasa Berau yang berarti "Apa kabar?"'
      },
    ]
  }
};

export default function QuizScreen() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizCode, setQuizCode] = useState('');
  const [quizCodeError, setQuizCodeError] = useState('');
  const [viewMode, setViewMode] = useState<'browse' | 'enterCode'>('browse');
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;
  
  const startQuiz = (quiz: Quiz) => {
    navigation.navigate('QuizTaking', { quiz });
  };
  
  const handleCodeSubmit = () => {
    if (!quizCode.trim()) {
      setQuizCodeError('Harap masukkan kode kuis');
      return;
    }
    
    // Check if the code exists in the teacherQuizzes
    const quiz = teacherQuizzes[quizCode];
    if (quiz) {
      setQuizCodeError('');
      // Start the quiz with the found quiz data
      startQuiz(quiz);
    } else {
      setQuizCodeError('Kode kuis tidak valid. Periksa kembali dan coba lagi.');
    }
  };
  
  const renderCodeEntry = () => {
    return (
      <View style={styles.codeEntryContainer}>
        <View style={styles.codeHeaderSection}>
          <View style={styles.codeIconContainer}>
            <Ionicons name="key-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.codeTitle}>Masukkan Kode Kuis</Text>
          <Text style={styles.codeSubtitle}>
            Masukkan kode kuis yang diberikan oleh guru Anda untuk mengakses kuis
          </Text>
        </View>
        
        <View style={[styles.codeInputSection, isDesktop && { maxWidth: 500, alignSelf: 'center', width: '100%' }]}>
          <TextInput
            style={styles.codeInput}
            placeholder="Contoh: RPN1234"
            value={quizCode}
            onChangeText={(text) => {
              setQuizCode(text.toUpperCase());
              setQuizCodeError('');
            }}
            autoCapitalize="characters"
            maxLength={7}
          />
          
          {quizCodeError ? (
            <Text style={styles.errorText}>{quizCodeError}</Text>
          ) : null}
          
          <TouchableOpacity 
            style={styles.submitCodeButton}
            onPress={handleCodeSubmit}
          >
            <Text style={styles.submitCodeButtonText}>Mulai Kuis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchViewButton}
            onPress={() => setViewMode('browse')}
          >
            <Text style={styles.switchViewButtonText}>Jelajahi Kuis Tersedia</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderQuizList = () => {
    return (
      <View style={[styles.container, isDesktop && { maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kuis Tersedia</Text>
          <TouchableOpacity 
            style={styles.codeButton}
            onPress={() => setViewMode('enterCode')}
          >
            <Ionicons name="key-outline" size={20} color="white" />
            <Text style={styles.codeButtonText}>Masukkan Kode Kuis</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subHeader}>
          Uji pengetahuan Anda tentang budaya dan bahasa Kalimantan Timur
        </Text>
        
        <View style={isDesktop || isTablet ? styles.quizGridContainer : undefined}>
          {quizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={[styles.quizCard, (isDesktop || isTablet) && styles.quizCardGrid]}
              onPress={() => startQuiz(quiz)}
            >
              <View style={styles.quizIconContainer}>
                <Text style={styles.quizIcon}>{quiz.icon}</Text>
              </View>
              <View style={styles.quizInfo}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizDescription}>{quiz.description}</Text>
                <View style={styles.quizMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="help-circle-outline" size={14} color={Colors.lightText} />
                    <Text style={styles.metaText}>{quiz.questions.length} Pertanyaan</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.lightText} />
                    <Text style={styles.metaText}>{quiz.questions.length * 1} Menit</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.primary} style={styles.quizArrow} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.recentlyCompletedSection}>
          <Text style={styles.sectionTitle}>Kuis Terakhir Diselesaikan</Text>
          <View style={styles.emptyState}>
            <Ionicons name="checkbox-outline" size={48} color={Colors.primary + '40'} />
            <Text style={styles.emptyStateText}>Belum ada kuis yang diselesaikan</Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <Layout>
      <ScrollView style={styles.scrollContainer}>
        {viewMode === 'enterCode' ? renderCodeEntry() : renderQuizList()}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  codeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  subHeader: {
    fontSize: 15,
    color: Colors.lightText,
    marginBottom: 24,
    maxWidth: 600,
  },
  quizGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  quizCardGrid: {
    width: '48%',
    marginBottom: 20,
  },
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quizIcon: {
    fontSize: 28,
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
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  quizMeta: {
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
  quizArrow: {
    marginLeft: 8,
  },
  recentlyCompletedSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.lightText,
    marginTop: 12,
    textAlign: 'center',
  },
  // Code entry styles
  codeEntryContainer: {
    padding: 24,
  },
  codeHeaderSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  codeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  codeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  codeSubtitle: {
    fontSize: 15,
    color: Colors.lightText,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
    maxWidth: 500,
  },
  codeInputSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  codeInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitCodeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitCodeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  switchViewButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchViewButtonText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Quiz styles
  resultContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  resultMessage: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 32,
  },
  perfectScoreText: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  goodScoreText: {
    fontSize: 16,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lowScoreText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
}); 