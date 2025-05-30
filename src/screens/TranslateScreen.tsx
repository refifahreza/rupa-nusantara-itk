import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Animated,
  Dimensions,
  Pressable,
  ToastAndroid
} from 'react-native';
import Layout from '../components/layout/Layout';
import Colors  from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;

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

// HoverableComponent for web hover effects
const HoverableComponent = ({ 
  onPress, 
  onHoverIn, 
  onHoverOut, 
  style, 
  children 
}: { 
  onPress: () => void, 
  onHoverIn?: () => void, 
  onHoverOut?: () => void, 
  style?: any, 
  children: React.ReactNode 
}) => {
  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        style={style}
      >
        {children}
      </Pressable>
    );
  }
  
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
};

export default function TranslateScreen() {
  const [sourceLanguage, setSourceLanguage] = useState('id');
  const [targetLanguage, setTargetLanguage] = useState('kt');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(windowWidth >= 1024);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [hoveredRecent, setHoveredRecent] = useState<number | null>(null);
  const [hoveredSourceLang, setHoveredSourceLang] = useState<string | null>(null);
  const [hoveredTargetLang, setHoveredTargetLang] = useState<string | null>(null);
  const [showContextOptions, setShowContextOptions] = useState(false);
  const [ambiguousWord, setAmbiguousWord] = useState('');
  
  // Create animations
  const [headerFadeAnim] = useState(new Animated.Value(0));
  const [headerSlideAnim] = useState(new Animated.Value(50));
  const [languageFadeAnim] = useState(new Animated.Value(0));
  const [languageSlideAnim] = useState(new Animated.Value(30));
  const [inputFadeAnim] = useState(new Animated.Value(0));
  const [inputSlideAnim] = useState(new Animated.Value(30));
  const [resultFadeAnim] = useState(new Animated.Value(0));
  const [resultSlideAnim] = useState(new Animated.Value(30));
  const [recentFadeAnim] = useState(new Animated.Value(0));
  const [recentSlideAnim] = useState(new Animated.Value(30));
  
  // Update isDesktop state when window size changes
  useEffect(() => {
    const updateLayout = () => {
      setIsDesktop(Dimensions.get('window').width >= 1024);
    };

    Dimensions.addEventListener('change', updateLayout);
    
    // Start animations
    const animations = [
      // Header animation
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Language selector animation with delay
      Animated.timing(languageFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(languageSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      
      // Input animation with delay
      Animated.timing(inputFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(inputSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      
      // Recent translations animation with delay
      Animated.timing(recentFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(recentSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
    ];
    
    Animated.parallel(animations).start();
    
    return () => {
      // Clean up event listener when component unmounts
    };
  }, []);
  
  // Helper function to normalize text for translation
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .trim()
      .replace(/[.,?!;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize spaces
  };
  
  // Helper function to check if a word is ambiguous and needs context
  const isAmbiguousWord = (word: string): boolean => {
    // Currently only "bulan" is ambiguous in our dictionary
    return normalizeText(word) === 'bulan';
  };
  
  // Function to handle input text change
  const handleInputChange = (text: string) => {
    setInputText(text);
    
    // Check if the input is an ambiguous word that might need context
    if (isAmbiguousWord(text)) {
      setAmbiguousWord(text);
      setShowContextOptions(true);
    } else {
      setShowContextOptions(false);
    }
  };
  
  // Function to select context for ambiguous words
  const selectContext = (context: string) => {
    let contextualInput = inputText;
    
    if (context === 'time') {
      contextualInput = 'bulan_waktu';
    } else if (context === 'celestial') {
      contextualInput = 'bulan_benda';
    }
    
    // Directly use the specific key for translation
    setInputText(contextualInput);
    setShowContextOptions(false);
    
    // Start translation with the contextual input
    setTimeout(() => {
      translateText();
    }, 100);
  };
  
  // Mock translation function
  const translateText = () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Reset result animations
    resultFadeAnim.setValue(0);
    resultSlideAnim.setValue(30);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Create a normalized version of the translations
      const translations: TranslationMap = {
        'id-kt': { // bahasa kutai (kutai kartanegara)
          'selamat pagi': 'selamat pagi kitak',
          'selamat siang': 'selamat tengari',
          'selamat sore': 'selamat petang',
          'selamat malam': 'selamat malem',
          'terima kasih': 'makasih banar',
          'sama-sama': 'samua kitak',
          'apa kabar?': 'endak pian?',
          'baik-baik saja': 'enda baik',
          'siapa nama kamu?': 'sapa ngaran pian?',
          'nama saya __': 'ngaran aku __',
          'maaf': 'ampun',
          'permisi': 'tabik',
          'iya': 'aok',
          'tidak': 'kada',
          'saya lapar': 'aku lapar',
          'saya haus': 'aku haus',
          'makan': 'makan',
          'minum': 'nginum',
          'tidur': 'tidur',
          'rumah': 'rumah',
          'pergi': 'beres',
          'datang': 'teku',
          'beli': 'beli',
          'jual': 'jual',
          'mahal': 'mahal',
          'murah': 'murah',
          'berapa?': 'pira?',
          'sakit': 'sakik',
          'sehat': 'sehat',
          'kenyang': 'kenyang',
          'kamu': 'pian',
          'saya': 'aku',
          'dia': 'sida',
          'kami': 'kita',
          'mereka': 'sida',
          'di sini': 'di keni',
          'di sana': 'di kena',
          'kecil': 'dikit',
          'besar': 'besak',
          'panas': 'angat',
          'dingin': 'dingin',
          'cepat': 'cepat',
          'lambat': 'lambat',
          'bapak': 'apak',
          'ibu': 'mamak',
          'anak': 'anak',
          'kakek': 'tutung',
          'nenek': 'enek',
          'saudara': 'sudara',
          'paman': 'paman',
          'bibi': 'bibi',
          'kakak': 'kakak',
          'adik': 'adik',
          'air': 'aing',
          'api': 'api',
          'udara': 'udar',
          'tanah': 'tanah',
          'hujan': 'hujan',
          'matahari': 'mataari',
          'bulan_benda': 'bulan',
          'bintang': 'bintang',
          'langit': 'langit',
          'pohon': 'puhun',
          'bunga': 'bunga',
          'hutan': 'hutan',
          'sungai': 'sungai',
          'laut': 'laut',
          'gunung': 'gunung',
          'jalan': 'jalan',
          'kiri': 'kiwa',
          'kanan': 'kanan',
          'depan': 'depan',
          'belakang': 'belakang',
          'atas': 'atas',
          'bawah': 'bawah',
          'dekat': 'dikit',
          'jauh': 'jauh',
          'sekarang': 'sekarang',
          'kemarin': 'kelaman',
          'besok': 'besok',
          'hari': 'hari',
          'minggu': 'minggu',
          'bulan_waktu': 'bulan',
          'tahun': 'tahun',
          'satu': 'satu',
          'dua': 'dua',
          'tiga': 'tiga',
          'empat': 'ampat',
          'lima': 'lima',
          'enam': 'enam',
          'tujuh': 'tujuh',
          'delapan': 'lapan',
          'sembilan': 'sambilan',
          'sepuluh': 'puluh',
          'pergi ke pasar': 'beres ke pasar',
          'mau ke mana?': 'nak ke mana?',
          'sudah makan?': 'udah makan?',
          'belum': 'belom',
          'sudah': 'udah',
          'lapar sekali': 'lapar banar',
          'enak': 'enak',
          'tidak enak': 'kada enak',
          'boleh': 'bulih',
          'tidak boleh': 'kada bulih',
          'tunggu sebentar': 'tunggu kitak',
          'ayo pergi': 'ayuk beres',
          'pulang': 'pulang',
          'bekerja': 'karya',
          'istirahat': 'berandak',
          'tersenyum': 'nyenyak',
          'menangis': 'nangis',
          'tertawa': 'tawak',
          'duduk': 'duduk',
          'berdiri': 'bediri',
          'jalan kaki': 'jalat',
          'lari': 'lari',
          'baca': 'baca',
          'tulis': 'tulis',
          'dengar': 'dingar',
          'lihat': 'liat',
          'cium': 'cium',
          'rasa': 'rasa',
          'pikir': 'pikir',
          'tahu': 'tahu',
          'tidur nyenyak': 'tidur nyak'
        },
        'id-bn': { // bahasa banjar
          'selamat pagi': 'selamat pagi pian',
          'selamat siang': 'selamat siang pian',
          'selamat sore': 'selamat sore pian',
          'selamat malam': 'selamat malam pian',
          'terima kasih': 'terima kasih banar',
          'sama-sama': 'sama-sama',
          'apa kabar?': 'kayapa kabar?',
          'baik-baik saja': 'alhamdulillah baik',
          'siapa nama kamu?': 'sapa ngaran pian?',
          'nama saya __': 'ngaran ulun __',
          'maaf': 'maaf',
          'permisi': 'permisi',
          'iya': 'iya',
          'tidak': 'kada',
          'saya lapar': 'ulun lapar',
          'saya haus': 'ulun haus',
          'makan': 'makan',
          'minum': 'minum',
          'tidur': 'tidur',
          'rumah': 'rumah',
          'pergi': 'pigi',
          'datang': 'tatang',
          'beli': 'bali',
          'jual': 'jual',
          'mahal': 'mahal',
          'murah': 'murah',
          'berapa?': 'pirah?',
          'sakit': 'sakik',
          'sehat': 'sihad',
          'kenyang': 'kanyang',
          'kamu': 'pian',
          'saya': 'ulun',
          'dia': 'inya',
          'kami': 'kami',
          'mereka': 'inya',
          'di sini': 'di sini',
          'di sana': 'di sana',
          'kecil': 'halus',
          'besar': 'ganal',
          'panas': 'panis',
          'dingin': 'sedingin',
          'cepat': 'capat',
          'lambat': 'lambat',
          'bapak': 'ayah',
          'ibu': 'umi',
          'anak': 'anak',
          'kakek': 'tatang',
          'nenek': 'nini',
          'saudara': 'dangsanak',
          'paman': 'paman',
          'bibi': 'bibi',
          'kakak': 'kakak',
          'adik': 'ading',
          'air': 'banyu',
          'api': 'api',
          'udara': 'hawanya',
          'tanah': 'tanah',
          'hujan': 'hujan',
          'matahari': 'matahari',
          'bulan_benda': 'bulan',
          'bintang': 'bintang',
          'langit': 'langit',
          'pohon': 'puhun',
          'bunga': 'bungaan',
          'hutan': 'hutan',
          'sungai': 'sungai',
          'laut': 'laut',
          'gunung': 'gunung',
          'jalan': 'jalan',
          'kiri': 'kiwa',
          'kanan': 'kanan',
          'depan': 'hadapan',
          'belakang': 'balakang',
          'atas': 'atas',
          'bawah': 'bawah',
          'dekat': 'dikit',
          'jauh': 'jauh',
          'sekarang': 'sakira',
          'kemarin': 'kamarin',
          'besok': 'sumuk',
          'hari': 'hari',
          'minggu': 'minggu',
          'bulan_waktu': 'bulan',
          'tahun': 'tahun',
          'satu': 'asa',
          'dua': 'dua',
          'tiga': 'tiga',
          'empat': 'ampat',
          'lima': 'lima',
          'enam': 'anam',
          'tujuh': 'tujuh',
          'delapan': 'dalapan',
          'sembilan': 'sambilan',
          'sepuluh': 'puluh',
          'pergi ke pasar': 'pigi ka pasar',
          'mau ke mana?': 'handak ka mana?',
          'sudah makan?': 'udah makan?',
          'belum': 'kada',
          'sudah': 'udah',
          'lapar sekali': 'lapar parak',
          'enak': 'lazat',
          'tidak enak': 'kada lazat',
          'boleh': 'boleh',
          'tidak boleh': 'kada boleh',
          'tunggu sebentar': 'tunggu sadikit',
          'ayo pergi': 'ayuk pigi',
          'pulang': 'pulang',
          'bekerja': 'bakarya',
          'istirahat': 'baisirahat',
          'tersenyum': 'manyinyum',
          'menangis': 'manangis',
          'tertawa': 'tatawa',
          'duduk': 'duduk',
          'berdiri': 'dirik',
          'jalan kaki': 'jalan kaki',
          'lari': 'lari',
          'baca': 'baca',
          'tulis': 'tulis',
          'dengar': 'dangar',
          'lihat': 'liat',
          'cium': 'cium',
          'rasa': 'rasa',
          'pikir': 'pikir',
          'tahu': 'tahu',
          'tidur nyenyak': 'tidur nyak'
        },
        'id-dy': { // bahasa dayak ngaju
          'selamat pagi': 'selamat enjau',
          'selamat siang': 'selamat tengah hari',
          'selamat sore': 'selamat sore',
          'selamat malam': 'selamat malam',
          'terima kasih': 'terima kasih beribu',
          'sama-sama': 'sama-sama',
          'apa kabar?': 'onok ngai?',
          'baik-baik saja': 'onok ja',
          'siapa nama kamu?': 'sira ngaran ihek?',
          'nama saya __': 'ngaran aku __',
          'maaf': 'ampun',
          'permisi': 'tabik',
          'iya': 'ee',
          'tidak': 'kado',
          'saya lapar': 'aku oroy',
          'saya haus': 'aku haus',
          'makan': 'kuman',
          'minum': 'nok',
          'tidur': 'pulem',
          'rumah': 'blai',
          'pergi': 'lewu',
          'datang': 'tunju',
          'beli': 'beli',
          'jual': 'jual',
          'mahal': 'mahal',
          'murah': 'murah',
          'berapa?': 'pira?',
          'sakit': 'sakit',
          'sehat': 'sehat',
          'kenyang': 'kenyan',
          'kamu': 'ihek',
          'saya': 'aku',
          'dia': 'sira',
          'kami': 'itah',
          'mereka': 'sira',
          'di sini': 'di kene',
          'di sana': 'di keno',
          'kecil': 'kecik',
          'besar': 'gaga',
          'panas': 'anget',
          'dingin': 'dingin',
          'cepat': 'cepat',
          'lambat': 'lambat',
          'bapak': 'ama',
          'ibu': 'andin',
          'anak': 'anak',
          'kakek': 'aki',
          'nenek': 'nini',
          'saudara': 'pambak',
          'paman': 'paman',
          'bibi': 'bibi',
          'kakak': 'kakak',
          'adik': 'adik',
          'air': 'danum',
          'api': 'apui',
          'udara': 'hangei',
          'tanah': 'petak',
          'hujan': 'ujen',
          'matahari': 'matahao',
          'bulan_benda': 'bulau',
          'bintang': 'bintang',
          'langit': 'langit',
          'pohon': 'pangun',
          'bunga': 'bunga',
          'hutan': 'hutan',
          'sungai': 'sungai',
          'laut': 'laut',
          'gunung': 'bukit',
          'jalan': 'jalan',
          'kiri': 'kawi',
          'kanan': 'kanan',
          'depan': 'muru',
          'belakang': 'muri',
          'atas': 'atas',
          'bawah': 'bawah',
          'dekat': 'dekat',
          'jauh': 'jauh',
          'sekarang': 'tawui',
          'kemarin': 'kahi',
          'besok': 'sok',
          'hari': 'andau',
          'minggu': 'minggu',
          'bulan_waktu': 'bulau',
          'tahun': 'tahun',
          'satu': 'ije',
          'dua': 'due',
          'tiga': 'telo',
          'empat': 'epat',
          'lima': 'lime',
          'enam': 'onom',
          'tujuh': 'pitu',
          'delapan': 'balu',
          'sembilan': 'sangkei',
          'sepuluh': 'sepuloh',
          'pergi ke pasar': 'lewu ka pasar',
          'mau ke mana?': 'are ka jiro?',
          'sudah makan?': 'udah kuman?',
          'belum': 'kado',
          'sudah': 'udah',
          'lapar sekali': 'oroy tegep',
          'enak': 'enak',
          'tidak enak': 'kado enak',
          'boleh': 'boleh',
          'tidak boleh': 'kado boleh',
          'tunggu sebentar': 'tunggu ije',
          'ayo pergi': 'ayuk lewu',
          'pulang': 'pulang',
          'bekerja': 'kerja',
          'istirahat': 'istirahat',
          'tersenyum': 'manyinyum',
          'menangis': 'manangis',
          'tertawa': 'tatawa',
          'duduk': 'duduk',
          'berdiri': 'bediri',
          'jalan kaki': 'jalan kaki',
          'lari': 'lari',
          'baca': 'basa',
          'tulis': 'tulis',
          'dengar': 'tinga',
          'lihat': 'neda',
          'cium': 'cium',
          'rasa': 'rasa',
          'pikir': 'pikir',
          'tahu': 'tahu',
          'tidur nyenyak': 'pulem nyak'
        }
      };
      
      // Create a normalized version of the translations dictionary
      const normalizedTranslations: TranslationMap = {};
      
      // Normalize all dictionary keys for better matching
      Object.keys(translations).forEach(langPair => {
        normalizedTranslations[langPair] = {};
        Object.entries(translations[langPair]).forEach(([phrase, translation]) => {
          normalizedTranslations[langPair][normalizeText(phrase)] = translation;
        });
      });
      
      const key = `${sourceLanguage}-${targetLanguage}`;
      const reverseKey = `${targetLanguage}-${sourceLanguage}`;
      
      let resultText = '';
      
      // Check if this is a direct internal key (from context selection)
      const isInternalKey = inputText === 'bulan_waktu' || inputText === 'bulan_benda';
      
      if (isInternalKey && normalizedTranslations[key] && normalizedTranslations[key][inputText]) {
        // Direct translation of internal key
        resultText = normalizedTranslations[key][inputText];
      } else {
        // Process input text to handle special cases
        let processedInput = normalizeText(inputText);
        
        // Handle disambiguation for words like "bulan"
        if (processedInput === 'bulan') {
          // Try both versions, with context preference for celestial body
          const monthKey = `bulan_waktu`;
          const celestialKey = `bulan_benda`;
          
          if (normalizedTranslations[key] && normalizedTranslations[key][celestialKey]) {
            resultText = normalizedTranslations[key][celestialKey];
          } else if (normalizedTranslations[key] && normalizedTranslations[key][monthKey]) {
            resultText = normalizedTranslations[key][monthKey];
          }
        } else if (normalizedTranslations[key] && normalizedTranslations[key][processedInput]) {
          // Regular translation found
          resultText = normalizedTranslations[key][processedInput];
        } else if (normalizedTranslations[reverseKey]) {
          // Try reverse translation
          const entry = Object.entries(normalizedTranslations[reverseKey]).find(
            ([_, val]) => normalizeText(val) === processedInput
          );
          if (entry) {
            resultText = entry[0];
          }
        }
      }
      
      // If no translation found yet
      if (!resultText) {
        resultText = '(Terjemahan tidak ditemukan)';
      } else if (Platform.OS === 'android') {
        // Show toast on successful translation on Android
        ToastAndroid.show('Terjemahan berhasil!', ToastAndroid.SHORT);
      }
      
      setTranslatedText(resultText);
      setIsTranslating(false);
      
      // Animate result appearance
      Animated.parallel([
        Animated.timing(resultFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(resultSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  };
  
  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
    
    // Reset and trigger result animation if there is text
    if (inputText) {
      resultFadeAnim.setValue(0);
      resultSlideAnim.setValue(30);
      
      Animated.parallel([
        Animated.timing(resultFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(resultSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const selectLanguage = (langId: string, isSource: boolean) => {
    if (isSource) {
      if (langId === targetLanguage) {
        // If selecting the same language as target, swap them
        swapLanguages();
      } else {
        setSourceLanguage(langId);
      }
    } else {
      if (langId === sourceLanguage) {
        // If selecting the same language as source, swap them
        swapLanguages();
      } else {
        setTargetLanguage(langId);
      }
    }

    // Reset hover states
    setHoveredLanguage(null);
  };
  
  // Function to get popular phrases based on the current language pair
  const getPopularPhrases = (): string[] => {
    const basePopular = ['Selamat pagi', 'Terima kasih', 'Apa kabar?', 'Bulan'];
    
    // Add some language-specific popular phrases
    if (targetLanguage === 'kt') {
      return [...basePopular, 'Saya lapar', 'Makan'];
    } else if (targetLanguage === 'bn') {
      return [...basePopular, 'Saya lapar', 'Rumah'];
    } else if (targetLanguage === 'dy') {
      return [...basePopular, 'Makan', 'Tidur'];
    }
    
    return basePopular;
  };
  
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <Animated.View 
          style={[
            styles.header,
            { opacity: headerFadeAnim, transform: [{ translateY: headerSlideAnim }] }
          ]}
        >
          <Text style={[styles.headerTitle, isDesktop && styles.headerTitleDesktop]}>
            Terjemahan Bahasa
          </Text>
          <Text style={[styles.headerSubtitle, isDesktop && styles.headerSubtitleDesktop]}>
            Terjemahkan dari Bahasa Indonesia ke bahasa daerah Kalimantan Timur
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.languageContainer,
            isDesktop && styles.languageContainerDesktop,
            { opacity: languageFadeAnim, transform: [{ translateY: languageSlideAnim }] }
          ]}
        >
          <View style={[styles.languageSelector, isDesktop && styles.languageSelectorDesktop]}>
            <View style={[styles.languageColumn, isDesktop && styles.languageColumnDesktop]}>
              <Text style={styles.languageColumnTitle}>Dari:</Text>
              <View style={styles.languageOptions}>
                {languages.map(lang => (
                  <HoverableComponent
                    key={`source-${lang.id}`}
                    style={[
                      styles.languageOption,
                      sourceLanguage === lang.id && styles.selectedLanguageOption,
                      hoveredSourceLang === lang.id && styles.hoveredLanguageOption
                    ]}
                    onPress={() => selectLanguage(lang.id, true)}
                    onHoverIn={() => setHoveredSourceLang(lang.id)}
                    onHoverOut={() => setHoveredSourceLang(null)}
                  >
                    <Text style={[
                      styles.languageOptionText,
                      sourceLanguage === lang.id && styles.selectedLanguageOptionText
                    ]}>
                      {lang.flag} {lang.name}
                    </Text>
                  </HoverableComponent>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.swapButton, isDesktop && styles.swapButtonDesktop]} 
              onPress={swapLanguages}
            >
              <Ionicons name="swap-horizontal" size={isDesktop ? 24 : 20} color="#fff" />
            </TouchableOpacity>
            
            <View style={[styles.languageColumn, isDesktop && styles.languageColumnDesktop]}>
              <Text style={styles.languageColumnTitle}>Ke:</Text>
              <View style={styles.languageOptions}>
                {languages.map(lang => (
                  <HoverableComponent
                    key={`target-${lang.id}`}
                    style={[
                      styles.languageOption,
                      targetLanguage === lang.id && styles.selectedLanguageOption,
                      hoveredTargetLang === lang.id && styles.hoveredLanguageOption
                    ]}
                    onPress={() => selectLanguage(lang.id, false)}
                    onHoverIn={() => setHoveredTargetLang(lang.id)}
                    onHoverOut={() => setHoveredTargetLang(null)}
                  >
                    <Text style={[
                      styles.languageOptionText,
                      targetLanguage === lang.id && styles.selectedLanguageOptionText
                    ]}>
                      {lang.flag} {lang.name}
                    </Text>
                  </HoverableComponent>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.inputContainer,
            isDesktop && styles.inputContainerDesktop,
            { opacity: inputFadeAnim, transform: [{ translateY: inputSlideAnim }] }
          ]}
        >
          <View style={[styles.inputWrapper, isDesktop && styles.inputWrapperDesktop]}>
            <TextInput
              style={[styles.textInput, isDesktop && styles.textInputDesktop]}
              placeholder="Ketik teks untuk diterjemahkan..."
              value={inputText}
              onChangeText={handleInputChange}
              multiline
              textAlignVertical="top"
            />
            
            {showContextOptions && (
              <View style={styles.contextOptionsContainer}>
                <Text style={styles.contextTitle}>Pilih konteks untuk "{ambiguousWord}":</Text>
                <View style={styles.contextButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.contextButton}
                    onPress={() => selectContext('time')}
                  >
                    <Text style={styles.contextButtonText}>Bulan (Waktu)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.contextButton}
                    onPress={() => selectContext('celestial')}
                  >
                    <Text style={styles.contextButtonText}>Bulan (Benda Langit)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.contextButtonClose}
                    onPress={() => setShowContextOptions(false)}
                  >
                    <Text style={styles.contextButtonCloseText}>Batal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <TouchableOpacity 
              style={[
                styles.translateButton, 
                !inputText.trim() && styles.disabledButton,
                isDesktop && styles.translateButtonDesktop
              ]} 
              onPress={translateText}
              disabled={!inputText.trim() || isTranslating}
            >
              <Text style={styles.translateButtonText}>
                {isTranslating ? 'Menerjemahkan...' : 'Terjemahkan'}
              </Text>
              {!isTranslating && (
                <Ionicons 
                  name="arrow-forward" 
                  size={isDesktop ? 18 : 16} 
                  color="#fff" 
                  style={{ marginLeft: 8 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {translatedText ? (
          <Animated.View 
            style={[
              styles.resultContainer,
              isDesktop && styles.resultContainerDesktop,
              { opacity: resultFadeAnim, transform: [{ translateY: resultSlideAnim }] }
            ]}
          >
            <View style={styles.resultHeader}>
              <Text style={[styles.resultTitle, isDesktop && styles.resultTitleDesktop]}>
                Hasil Terjemahan ({languages.find(l => l.id === targetLanguage)?.name})
                {inputText === 'bulan_waktu' && " • Konteks: Waktu"}
                {inputText === 'bulan_benda' && " • Konteks: Benda Langit"}
              </Text>
            </View>
            
            <Text style={[styles.resultText, isDesktop && styles.resultTextDesktop]}>
              {inputText === 'bulan_waktu' ? 'bulan (waktu)' : 
               inputText === 'bulan_benda' ? 'bulan (benda langit)' : 
               inputText} → {translatedText}
            </Text>
          </Animated.View>
        ) : null}
        
        <Animated.View 
          style={[
            styles.recentTranslations,
            isDesktop && styles.recentTranslationsDesktop,
            { opacity: recentFadeAnim, transform: [{ translateY: recentSlideAnim }] }
          ]}
        >
          <Text style={[styles.recentTitle, isDesktop && styles.recentTitleDesktop]}>
            Terjemahan Populer:
          </Text>
          
          <View style={isDesktop && styles.recentItemsGridDesktop}>
            {getPopularPhrases().map((phrase, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: recentFadeAnim,
                  transform: [{ 
                    translateY: recentFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20 + (index * 5), 0]
                    })
                  }]
                }}
              >
                <HoverableComponent 
                  key={index} 
                  style={[
                    styles.recentItem,
                    isDesktop && styles.recentItemDesktop,
                    hoveredRecent === index && styles.recentItemHover
                  ]}
                  onPress={() => {
                    setInputText(phrase);
                    translateText();
                  }}
                  onHoverIn={() => setHoveredRecent(index)}
                  onHoverOut={() => setHoveredRecent(null)}
                >
                  {isDesktop ? (
                    <View style={{ alignItems: 'center', width: '100%' }}>
                      <Ionicons 
                        name="chatbubble-outline" 
                        size={20} 
                        color={Colors.primary} 
                        style={{ marginBottom: 8 }} 
                      />
                      <Text style={styles.recentItemTextDesktop}>
                        {phrase}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons 
                        name="chatbubble-outline" 
                        size={16} 
                        color={Colors.primary} 
                        style={{ marginRight: 8 }} 
                      />
                      <Text style={styles.recentItemText}>
                        {phrase}
                      </Text>
                    </>
                  )}
                </HoverableComponent>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
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
  headerTitleDesktop: {
    fontSize: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 20,
  },
  headerSubtitleDesktop: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 700,
    alignSelf: 'center',
  },
  
  // Language selector styles
  languageContainer: {
    marginBottom: 24,
    backgroundColor: Colors.lightBackground,
    borderRadius: 6,
    padding: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageContainerDesktop: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 6,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  languageSelectorDesktop: {
    padding: 10,
  },
  languageColumn: {
    flex: 1,
  },
  languageColumnDesktop: {
    padding: 10,
  },
  languageColumnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  languageOptions: {
    width: '100%',
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: Colors.buttonBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedLanguageOption: {
    backgroundColor: `${Colors.primary}20`,
    borderColor: Colors.primary,
  },
  hoveredLanguageOption: Platform.OS === 'web' ? {
    transform: [{ translateY: -2 }],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: `${Colors.primary}10`,
  } : {},
  languageOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedLanguageOptionText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: 'center',
  },
  swapButtonDesktop: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 20,
  },
  
  // Input container styles
  inputContainer: {
    marginBottom: 24,
  },
  inputContainerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputWrapperDesktop: {
    borderRadius: 6,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 16,
    height: 140,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.text,
  },
  textInputDesktop: {
    height: 180,
    padding: 20,
    fontSize: 18,
  },
  translateButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  translateButtonDesktop: {
    padding: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  translateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Result container styles
  resultContainer: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 6,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultContainerDesktop: {
    padding: 24,
    borderRadius: 6,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultTitle: {
    fontSize: 14,
    color: Colors.lightText,
    fontWeight: '500',
  },
  resultTitleDesktop: {
    fontSize: 16,
  },
  resultText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
    fontWeight: '500',
  },
  resultTextDesktop: {
    fontSize: 22,
    lineHeight: 32,
    padding: 10,
  },
  
  // Recent translations styles
  recentTranslations: {
    marginBottom: 32,
  },
  recentTranslationsDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    padding: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  recentTitleDesktop: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  recentItemsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginHorizontal: 0,
  },
  recentItem: {
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recentItemDesktop: {
    width: 150, 
    marginBottom: 40,
    padding: 25,
    borderRadius: 0,
    marginHorizontal: 2.5,
    minHeight: 120,
    justifyContent: 'center',
  },
  recentItemHover: Platform.OS === 'web' ? {
    transform: [{ translateY: -3 }],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#fff',
  } : {},
  recentItemText: {
    color: Colors.text,
    fontSize: 14,
  },
  recentItemTextDesktop: {
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  
  // Context selection styles
  contextOptionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contextTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    color: Colors.text,
  },
  contextButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  contextButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: `${Colors.primary}20`,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  contextButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  contextButtonClose: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contextButtonCloseText: {
    color: '#666',
  },
}); 