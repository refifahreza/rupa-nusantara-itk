import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Header from '../components/layout/Header';

type RootStackParamList = {
  TeacherDashboard: undefined;
  TeacherQuizManagement: undefined;
  TeacherContributor: undefined;
  CreateQuiz: undefined;
};

type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  hasAudio: boolean;
  hasImage: boolean;
};

// Declare a type for the global object to include our custom property
declare global {
  var createdQuizzes: any[];
}

// Create a global variable to store created quizzes
if (!global.createdQuizzes) {
  global.createdQuizzes = [];
}

const CreateQuizScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      hasAudio: false,
      hasImage: false
    }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      hasAudio: false,
      hasImage: false
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    } else {
      Alert.alert('Error', 'Quiz must have at least one question.');
    }
  };
  
  const handleUpdateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };
  
  const handleUpdateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };
  
  const handleSetCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };
  
  const handleSaveQuiz = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Quiz title is required.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Quiz description is required.');
      return;
    }
    
    // Check if all questions have text and options
    const invalidQuestions = questions.filter(
      q => !q.text.trim() || q.options.some(opt => !opt.trim())
    );
    
    if (invalidQuestions.length > 0) {
      Alert.alert('Error', 'All questions must have text and all options filled.');
      return;
    }
    
    // Generate a unique quiz code
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
    
    // Create the quiz object
    const newQuiz = {
      code: generateQuizCode(),
      title,
      description,
      questions,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // In a real app, this would save to a database
    // For now, we'll store in global state
    if (!global.createdQuizzes) {
      global.createdQuizzes = [];
    }
    
    global.createdQuizzes.push(newQuiz);
    
    setIsSaving(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Success',
        'Quiz has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TeacherQuizManagement')
          }
        ]
      );
    }, 1500);
  };
  
  const renderQuestionForm = (question: Question, index: number) => {
    return (
      <View key={question.id} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Pertanyaan {index + 1}</Text>
          {questions.length > 1 && (
            <TouchableOpacity onPress={() => handleRemoveQuestion(index)}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teks Pertanyaan</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Masukkan pertanyaan di sini..."
            value={question.text}
            onChangeText={(text) => handleUpdateQuestion(index, 'text', text)}
            multiline
          />
        </View>
        
        <View style={styles.mediaOptionsContainer}>
          <View style={styles.mediaOption}>
            <View style={styles.switchContainer}>
              <Switch
                value={question.hasAudio}
                onValueChange={(value) => handleUpdateQuestion(index, 'hasAudio', value)}
                trackColor={{ false: '#E0E0E0', true: Colors.primary + '50' }}
                thumbColor={question.hasAudio ? Colors.primary : '#F5F5F5'}
              />
              <Text style={styles.switchLabel}>Tambahkan Audio</Text>
            </View>
            
            {question.hasAudio && (
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="mic-outline" size={20} color="white" />
                <Text style={styles.uploadButtonText}>Rekam Audio</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.mediaOption}>
            <View style={styles.switchContainer}>
              <Switch
                value={question.hasImage}
                onValueChange={(value) => handleUpdateQuestion(index, 'hasImage', value)}
                trackColor={{ false: '#E0E0E0', true: Colors.primary + '50' }}
                thumbColor={question.hasImage ? Colors.primary : '#F5F5F5'}
              />
              <Text style={styles.switchLabel}>Tambahkan Gambar</Text>
            </View>
            
            {question.hasImage && (
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="image-outline" size={20} color="white" />
                <Text style={styles.uploadButtonText}>Pilih Gambar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Pilihan Jawaban</Text>
        
        {question.options.map((option, optionIndex) => (
          <View key={optionIndex} style={styles.optionContainer}>
            <TouchableOpacity 
              style={[
                styles.radioButton, 
                question.correctOption === optionIndex && styles.radioButtonSelected
              ]}
              onPress={() => handleSetCorrectOption(index, optionIndex)}
            >
              {question.correctOption === optionIndex && (
                <View style={styles.radioButtonInner} />
              )}
            </TouchableOpacity>
            
            <TextInput
              style={styles.optionInput}
              placeholder={`Pilihan ${optionIndex + 1}`}
              value={option}
              onChangeText={(text) => handleUpdateOption(index, optionIndex, text)}
            />
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Buat Kuis"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showNotifications={true}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Buat Kuis Baru</Text>
          <Text style={styles.screenSubtitle}>Buat kuis dengan pertanyaan pilihan ganda, audio, dan gambar</Text>
        </View>
        
        <View style={styles.formSection}>
          {currentStep === 1 ? (
            <View style={styles.stepContainer}>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepCircle, styles.activeStep]}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
              </View>
              
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Informasi Dasar</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Judul Kuis</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan judul kuis..."
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Deskripsi</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Jelaskan tentang kuis ini..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.nextButton}
                  onPress={() => setCurrentStep(2)}
                >
                  <Text style={styles.nextButtonText}>Lanjut ke Pertanyaan</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.stepContainer}>
              <View style={styles.stepIndicator}>
                <TouchableOpacity 
                  style={[styles.stepCircle, styles.completedStep]}
                  onPress={() => setCurrentStep(1)}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                </TouchableOpacity>
                <View style={[styles.stepLine, styles.completedStepLine]} />
                <View style={[styles.stepCircle, styles.activeStep]}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
              </View>
              
              <View style={styles.questionsContainer}>
                {questions.map((question, index) => renderQuestionForm(question, index))}
                
                <TouchableOpacity 
                  style={styles.addQuestionButton}
                  onPress={handleAddQuestion}
                >
                  <Ionicons name="add-circle" size={20} color={Colors.primary} />
                  <Text style={styles.addQuestionText}>Tambah Pertanyaan</Text>
                </TouchableOpacity>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setCurrentStep(1)}
                    disabled={isSaving}
                  >
                    <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                    <Text style={styles.backButtonText}>Kembali</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.saveButton, isSaving && styles.disabledButton]}
                    onPress={handleSaveQuiz}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Text style={styles.saveButtonText}>Simpan Kuis</Text>
                        <Ionicons name="save-outline" size={20} color="white" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {isSaving && (
                <Text style={styles.savingText}>Menyimpan kuis, mohon tunggu...</Text>
              )}
            </View>
          )}
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
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  stepContainer: {
    width: '100%',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.lightText,
  },
  activeStep: {
    backgroundColor: Colors.primary,
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  stepLine: {
    height: 2,
    width: 60,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  },
  completedStepLine: {
    backgroundColor: '#4CAF50',
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
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
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
    minHeight: 100,
    paddingTop: 12,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  questionsContainer: {
    width: '100%',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  mediaOptionsContainer: {
    marginTop: 16,
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 24,
  },
  addQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: Colors.primary + '80',
  },
  savingText: {
    textAlign: 'center',
    marginTop: 16,
    color: Colors.lightText,
    fontSize: 14,
  },
});

export default CreateQuizScreen; 