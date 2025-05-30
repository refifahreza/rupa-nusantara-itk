import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../components/layout/Layout';
import Colors from '../constants/Colors';

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

export default function QuizScreen() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };
  
  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);
    
    const currentQuestion = selectedQuiz?.questions[currentQuestionIndex];
    const selectedOptionObj = currentQuestion?.options.find(option => option.id === optionId);
    
    if (selectedOptionObj?.isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const goToNextQuestion = () => {
    if (!selectedQuiz) return;
    
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const restartQuiz = () => {
    if (!selectedQuiz) return;
    
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };
  
  const exitQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };
  
  if (selectedQuiz) {
    if (quizCompleted) {
      // Quiz Result Screen
      return (
        <Layout>
          <ScrollView style={styles.container}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Kuis Selesai!</Text>
              <Text style={styles.resultScore}>
                Skor Anda: {score}/{selectedQuiz.questions.length}
              </Text>
              
              <View style={styles.resultMessage}>
                {score === selectedQuiz.questions.length ? (
                  <Text style={styles.perfectScoreText}>Sempurna! Anda menguasai materi ini dengan baik!</Text>
                ) : score >= selectedQuiz.questions.length / 2 ? (
                  <Text style={styles.goodScoreText}>Bagus! Anda memiliki pengetahuan yang baik!</Text>
                ) : (
                  <Text style={styles.lowScoreText}>Terus belajar! Coba lagi untuk meningkatkan skor Anda!</Text>
                )}
              </View>
              
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
                  <Text style={styles.restartButtonText}>Coba Lagi</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.exitButton} onPress={exitQuiz}>
                  <Text style={styles.exitButtonText}>Kembali ke Daftar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Layout>
      );
    }
    
    // Quiz Question Screen
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    
    return (
      <Layout>
        <ScrollView style={styles.container}>
          <View style={styles.quizHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={exitQuiz}
            >
              <Text style={styles.backButtonText}>← Kembali</Text>
            </TouchableOpacity>
            
            <Text style={styles.quizTitle}>{selectedQuiz.title}</Text>
            <Text style={styles.questionCounter}>
              Pertanyaan {currentQuestionIndex + 1} dari {selectedQuiz.questions.length}
            </Text>
          </View>
          
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            {currentQuestion.image && (
              <Image 
                source={{ uri: currentQuestion.image }}
                style={styles.questionImage}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map(option => (
                <TouchableOpacity 
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedOption === option.id && (option.isCorrect ? styles.correctOption : styles.incorrectOption),
                    isAnswered && option.isCorrect && styles.correctOption
                  ]}
                  onPress={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === option.id && (option.isCorrect ? styles.correctOptionText : styles.incorrectOptionText),
                    isAnswered && option.isCorrect && styles.correctOptionText
                  ]}>
                    {option.id.toUpperCase()}. {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {isAnswered && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
                <TouchableOpacity style={styles.nextButton} onPress={goToNextQuestion}>
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </Layout>
    );
  }
  
  // Quiz List Screen
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kuis Interaktif</Text>
          <Text style={styles.headerSubtitle}>
            Uji pengetahuan Anda tentang budaya dan bahasa Kalimantan Timur
          </Text>
        </View>
        
        <View style={styles.quizList}>
          {quizzes.map(quiz => (
            <TouchableOpacity 
              key={quiz.id}
              style={styles.quizCard}
              onPress={() => startQuiz(quiz)}
            >
              <Text style={styles.quizIcon}>{quiz.icon}</Text>
              <View style={styles.quizInfo}>
                <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                <Text style={styles.quizCardDescription}>{quiz.description}</Text>
                <Text style={styles.quizCardQuestionCount}>
                  {quiz.questions.length} Pertanyaan
                </Text>
              </View>
              <Text style={styles.startQuizText}>Mulai →</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 16,
  },
  quizList: {
    marginBottom: 32,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  quizCardDescription: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 4,
  },
  quizCardQuestionCount: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  startQuizText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Quiz Question Styles
  quizHeader: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  questionCounter: {
    fontSize: 14,
    color: Colors.lightText,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  questionImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  correctOptionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  incorrectOptionText: {
    color: '#C62828',
    fontWeight: 'bold',
  },
  explanationContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Result Styles
  resultContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  resultScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  resultMessage: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  perfectScoreText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goodScoreText: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lowScoreText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  restartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  restartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exitButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: 8,
  },
  exitButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 