import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import Layout from '../components/layout/Layout';
import Colors from '../constants/Colors';

// Type definitions for translations
type PhraseMapping = {
  [phrase: string]: string;
};

type TranslationMap = {
  [langPair: string]: PhraseMapping;
};

// Mock data for languages
const languages = [
  { id: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'kt', name: 'Bahasa Kutai', flag: '🏞️' },
  { id: 'bn', name: 'Bahasa Banjar', flag: '🌊' },
  { id: 'dy', name: 'Bahasa Dayak', flag: '🌴' },
];

export default function TranslateScreen() {
  const [sourceLanguage, setSourceLanguage] = useState('id');
  const [targetLanguage, setTargetLanguage] = useState('kt');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Mock translation function
  const translateText = () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock translation result
      const translations: TranslationMap = {
        'id-kt': {
          'Selamat pagi': 'Selamat pagi kitak',
          'Terima kasih': 'Makasih banar',
          'Apa kabar?': 'Endak pian?',
          'Saya lapar': 'Aku lapar',
          'Rumah': 'Rumah',
          'Makan': 'Makan',
        },
        'id-bn': {
          'Selamat pagi': 'Selamat pagi pian',
          'Terima kasih': 'Terima kasih banar',
          'Apa kabar?': 'Kayapa kabar?',
          'Saya lapar': 'Ulun lapar',
          'Rumah': 'Rumah',
          'Makan': 'Makan',
        },
        'id-dy': {
          'Selamat pagi': 'Selamat enjau',
          'Terima kasih': 'Terima kasih beribu',
          'Apa kabar?': 'Onok ngai?',
          'Saya lapar': 'Aaku oroy',
          'Rumah': 'Blai',
          'Makan': 'Kuman',
        },
      };
      
      const key = `${sourceLanguage}-${targetLanguage}`;
      const reverseKey = `${targetLanguage}-${sourceLanguage}`;
      
      if (translations[key] && translations[key][inputText]) {
        setTranslatedText(translations[key][inputText]);
      } else if (translations[reverseKey] && Object.values(translations[reverseKey]).includes(inputText)) {
        // Find key by value for reverse translation
        const entry = Object.entries(translations[reverseKey]).find(([_, val]) => val === inputText);
        if (entry) {
          setTranslatedText(entry[0]);
        } else {
          setTranslatedText('(Terjemahan tidak ditemukan)');
        }
      } else {
        setTranslatedText('(Terjemahan tidak ditemukan)');
      }
      
      setIsTranslating(false);
    }, 500);
  };
  
  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };
  
  const playAudio = (text: string) => {
    // Mock function for playing audio
    alert(`Playing audio: "${text}"`);
  };
  
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terjemahan Bahasa</Text>
          <Text style={styles.headerSubtitle}>
            Terjemahkan dari Bahasa Indonesia ke bahasa daerah Kalimantan Timur
          </Text>
        </View>
        
        <View style={styles.languageSelector}>
          <View style={styles.languageButton}>
            <Text style={styles.languageButtonText}>
              {languages.find(l => l.id === sourceLanguage)?.flag} {' '}
              {languages.find(l => l.id === sourceLanguage)?.name}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Text style={styles.swapButtonText}>🔄</Text>
          </TouchableOpacity>
          
          <View style={styles.languageButton}>
            <Text style={styles.languageButtonText}>
              {languages.find(l => l.id === targetLanguage)?.flag} {' '}
              {languages.find(l => l.id === targetLanguage)?.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik teks untuk diterjemahkan..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.translateButton, !inputText.trim() && styles.disabledButton]} 
            onPress={translateText}
            disabled={!inputText.trim() || isTranslating}
          >
            <Text style={styles.translateButtonText}>
              {isTranslating ? 'Menerjemahkan...' : 'Terjemahkan'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {translatedText ? (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                Hasil Terjemahan ({languages.find(l => l.id === targetLanguage)?.name})
              </Text>
              <TouchableOpacity 
                style={styles.audioButton}
                onPress={() => playAudio(translatedText)}
              >
                <Text style={styles.audioButtonText}>🔊</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.resultText}>{translatedText}</Text>
          </View>
        ) : null}
        
        <View style={styles.recentTranslations}>
          <Text style={styles.recentTitle}>Terjemahan Populer:</Text>
          
          {['Selamat pagi', 'Terima kasih', 'Apa kabar?', 'Saya lapar'].map((phrase, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentItem}
              onPress={() => {
                setInputText(phrase);
                translateText();
              }}
            >
              <Text style={styles.recentItemText}>{phrase}</Text>
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
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  languageButton: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageButtonText: {
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  swapButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  translateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  translateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 14,
    color: Colors.lightText,
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  resultText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
  },
  recentTranslations: {
    marginBottom: 32,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
  },
  recentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentItemText: {
    color: Colors.text,
  },
}); 