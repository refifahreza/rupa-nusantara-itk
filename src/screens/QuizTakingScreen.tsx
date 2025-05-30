import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
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

type RootStackParamList = {
  Quiz: undefined;
  QuizTaking: { quiz: Quiz };
};

type QuizTakingScreenRouteProp = RouteProp<RootStackParamList, 'QuizTaking'>;

const QuizTakingScreen = () => {
  const route = useRoute<QuizTakingScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { quiz } = route.params;
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Calculate total time in seconds (1 minute per question)
  const totalTime = quiz.questions.length * 60;
  
  // Start timer
  useEffect(() => {
    if (quizCompleted || !isTimerRunning) return;
    
    const timerInterval = setInterval(() => {
      setTimer(prevTime => {
        if (prevTime >= totalTime) {
          clearInterval(timerInterval);
          setIsTimerRunning(false);
          Alert.alert(
            'Waktu Habis',
            'Waktu Anda untuk mengerjakan kuis telah habis.',
            [
              { text: 'Lihat Hasil', onPress: () => setQuizCompleted(true) }
            ]
          );
          return totalTime;
        }
        return prevTime + 1;
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [quizCompleted, isTimerRunning, totalTime]);
  
  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!quizCompleted) {
        Alert.alert(
          'Keluar dari Kuis',
          'Apakah Anda yakin ingin keluar? Progres tidak akan disimpan.',
          [
            { text: 'Batal', style: 'cancel', onPress: () => {} },
            { text: 'Keluar', style: 'destructive', onPress: () => navigation.goBack() }
          ]
        );
        return true;
      }
      return false;
    });
    
    return () => backHandler.remove();
  }, [navigation, quizCompleted]);
  
  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOptionObj = currentQuestion.options.find(option => option.id === optionId);
    
    if (selectedOptionObj?.isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      setIsTimerRunning(false);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimer(0);
    setIsTimerRunning(true);
  };
  
  const exitQuiz = () => {
    navigation.goBack();
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getCompletionBadge = () => {
    const percentage = (score / quiz.questions.length) * 100;
    
    if (percentage >= 90) {
      return { icon: '🏆', label: 'Mahir', color: '#4CAF50', text: 'Selamat! Anda menguasai materi dengan sangat baik!' };
    } else if (percentage >= 70) {
      return { icon: '🥇', label: 'Hebat', color: '#2196F3', text: 'Bagus! Anda memiliki pemahaman yang baik!' };
    } else if (percentage >= 50) {
      return { icon: '🥈', label: 'Cukup', color: '#FF9800', text: 'Lumayan! Terus tingkatkan pemahaman Anda!' };
    } else {
      return { icon: '🔄', label: 'Berlatih Lagi', color: '#F44336', text: 'Jangan menyerah! Coba lagi untuk meningkatkan pemahaman!' };
    }
  };
  
  if (quizCompleted) {
    // Quiz Result Screen
    const badge = getCompletionBadge();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <Layout>
        <ScrollView style={styles.container}>
          <View style={[
            styles.resultContainer, 
            isDesktop && { maxWidth: 700, alignSelf: 'center', width: '100%' }
          ]}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.resultTitle}>Kuis Selesai!</Text>
            
            <View style={[styles.badgeContainer, { backgroundColor: badge.color + '20' }]}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={[styles.badgeLabel, { color: badge.color }]}>{badge.label}</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scorePercentage}>{percentage}%</Text>
                <Text style={styles.scoreText}>
                  {score} / {quiz.questions.length}
                </Text>
              </View>
            </View>
            
            <View style={styles.resultMessage}>
              <Text style={styles.resultMessageText}>{badge.text}</Text>
            </View>
            
            <View style={styles.resultStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={24} color={Colors.lightText} />
                <Text style={styles.statLabel}>Waktu</Text>
                <Text style={styles.statValue}>{formatTime(timer)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={24} color={Colors.lightText} />
                <Text style={styles.statLabel}>Benar</Text>
                <Text style={styles.statValue}>{score}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="close-circle-outline" size={24} color={Colors.lightText} />
                <Text style={styles.statLabel}>Salah</Text>
                <Text style={styles.statValue}>{quiz.questions.length - score}</Text>
              </View>
            </View>
            
            <View style={styles.resultActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.restartButton]} 
                onPress={restartQuiz}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.restartButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.exitButton]} 
                onPress={exitQuiz}
              >
                <Ionicons name="list-outline" size={20} color={Colors.text} />
                <Text style={styles.exitButtonText}>Kembali ke Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    );
  }
  
  // Quiz Question Screen
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={[
          styles.quizContent,
          isDesktop && { maxWidth: 800, alignSelf: 'center', width: '100%' }
        ]}>
          <View style={styles.quizHeader}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  Alert.alert(
                    'Keluar dari Kuis',
                    'Apakah Anda yakin ingin keluar? Progres tidak akan disimpan.',
                    [
                      { text: 'Batal', style: 'cancel', onPress: () => {} },
                      { text: 'Keluar', style: 'destructive', onPress: exitQuiz }
                    ]
                  );
                }}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
              </TouchableOpacity>
              
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              
              <View style={styles.timerContainer}>
                <Ionicons name="time-outline" size={18} color={Colors.primary} />
                <Text style={styles.timerText}>{formatTime(totalTime - timer)}</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressIndicator,
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1} / {quiz.questions.length}
              </Text>
            </View>
          </View>
          
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Pertanyaan {currentQuestionIndex + 1}</Text>
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
                  <View style={[
                    styles.optionIndicator,
                    selectedOption === option.id && (option.isCorrect ? styles.correctIndicator : styles.incorrectIndicator),
                    isAnswered && option.isCorrect && styles.correctIndicator
                  ]}>
                    <Text style={styles.optionIndicatorText}>{option.id.toUpperCase()}</Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedOption === option.id && (option.isCorrect ? styles.correctOptionText : styles.incorrectOptionText),
                    isAnswered && option.isCorrect && styles.correctOptionText
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {isAnswered && (
              <View style={styles.explanationContainer}>
                <View style={styles.explanationHeader}>
                  <Ionicons 
                    name={selectedOption && currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
                      ? "checkmark-circle" 
                      : "close-circle"} 
                    size={28} 
                    color={selectedOption && currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
                      ? "#4CAF50" 
                      : "#F44336"} 
                  />
                  <Text style={[
                    styles.explanationHeaderText,
                    { color: selectedOption && currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
                      ? "#4CAF50" 
                      : "#F44336" }
                  ]}>
                    {selectedOption && currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
                      ? "Jawaban Benar!" 
                      : "Jawaban Salah"}
                  </Text>
                </View>
                
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
                
                <TouchableOpacity 
                  style={styles.nextButton} 
                  onPress={goToNextQuestion}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesai & Lihat Hasil'}
                  </Text>
                  <Ionicons 
                    name={currentQuestionIndex < quiz.questions.length - 1 ? "arrow-forward" : "checkmark-done"} 
                    size={20} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  quizContent: {
    padding: 16,
  },
  // Quiz Header
  quizHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 4,
  },
  quizTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    minWidth: 45,
    textAlign: 'right',
  },
  // Question
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 15,
    color: Colors.lightText,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
    lineHeight: 28,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  // Options
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  correctIndicator: {
    backgroundColor: '#4CAF50',
  },
  incorrectIndicator: {
    backgroundColor: '#F44336',
  },
  correctOptionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  incorrectOptionText: {
    color: '#C62828',
    fontWeight: 'bold',
  },
  // Explanation
  explanationContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  explanationText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  // Results
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 20,
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 28,
    width: '100%',
    maxWidth: 320,
  },
  badgeIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  badgeLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scoreText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 4,
  },
  resultMessage: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
  },
  resultMessageText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 36,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.lightText,
    marginVertical: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  restartButton: {
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  restartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  exitButton: {
    backgroundColor: '#F5F5F5',
    marginLeft: 10,
  },
  exitButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default QuizTakingScreen; 