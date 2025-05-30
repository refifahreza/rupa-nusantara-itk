import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  GestureResponderEvent
} from 'react-native';
import Layout from '../components/layout/Layout';
import Colors from '../constants/Colors';

// Define types
interface AudioCategory {
  id: string;
  name: string;
  icon: string;
}

interface AudioClip {
  id: string;
  title: string;
  language: string;
  duration: string;
  category: string;
  description?: string;
  audioFile: string;
  speaker?: string;
}

// Mock data
const audioCategories: AudioCategory[] = [
  { id: '1', name: 'Kata Sehari-hari', icon: '🗣️' },
  { id: '2', name: 'Ungkapan Populer', icon: '💬' },
  { id: '3', name: 'Percakapan', icon: '👥' },
  { id: '4', name: 'Nyanyian Tradisional', icon: '🎵' },
];

const audioClips: AudioClip[] = [
  {
    id: '1',
    title: 'Salam dan Sapaan',
    language: 'Bahasa Kutai',
    duration: '1:25',
    category: '1',
    description: 'Kumpulan salam dan sapaan dalam bahasa Kutai yang sering digunakan sehari-hari.',
    audioFile: 'salam_kutai.mp3',
    speaker: 'H. Awang Farouk (75 tahun, Tenggarong)'
  },
  {
    id: '2',
    title: 'Angka dan Bilangan',
    language: 'Bahasa Banjar',
    duration: '2:10',
    category: '1',
    description: 'Cara menghitung dari satu sampai sepuluh dalam bahasa Banjar.',
    audioFile: 'angka_banjar.mp3',
    speaker: 'Hj. Siti Maimunah (68 tahun, Samarinda)'
  },
  {
    id: '3',
    title: 'Peribahasa Kearifan',
    language: 'Bahasa Dayak Kenyah',
    duration: '3:45',
    category: '2',
    description: 'Kumpulan peribahasa dan ungkapan bijak dalam bahasa Dayak Kenyah.',
    audioFile: 'peribahasa_kenyah.mp3',
    speaker: 'Ledjie Taq (80 tahun, Long Bangun)'
  },
  {
    id: '4',
    title: 'Belian - Nyanyian Pengobatan',
    language: 'Bahasa Dayak Benuaq',
    duration: '4:20',
    category: '4',
    description: 'Nyanyian pengobatan tradisional Belian yang digunakan dalam ritual penyembuhan.',
    audioFile: 'belian_benuaq.mp3',
    speaker: 'Petrus Ding (72 tahun, Damai)'
  },
  {
    id: '5',
    title: 'Percakapan di Pasar',
    language: 'Bahasa Kutai',
    duration: '2:35',
    category: '3',
    description: 'Percakapan antara penjual dan pembeli di pasar tradisional menggunakan bahasa Kutai.',
    audioFile: 'pasar_kutai.mp3',
    speaker: 'Aminah & Ruslan (65 & 70 tahun, Tenggarong)'
  },
  {
    id: '6',
    title: 'Lagu Tingkilan',
    language: 'Bahasa Kutai',
    duration: '3:15',
    category: '4',
    description: 'Nyanyian tradisional Tingkilan dari Kutai Kartanegara yang diiringi dengan alat musik gambus.',
    audioFile: 'tingkilan.mp3',
    speaker: 'Kelompok Seni Binakarya (Tenggarong)'
  },
];

export default function VoiceScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Filter audio clips by category if selected
  const filteredAudioClips = selectedCategory 
    ? audioClips.filter(clip => clip.category === selectedCategory)
    : audioClips;
  
  const togglePlayAudio = (clip: AudioClip) => {
    if (selectedAudio && selectedAudio.id === clip.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedAudio(clip);
      setIsPlaying(true);
    }
    
    // In a real app, this would play the actual audio file
    alert(`${isPlaying ? 'Paused' : 'Playing'}: ${clip.title}`);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };
  
  const downloadAudio = (clip: AudioClip) => {
    // In a real app, this would download the audio file
    alert(`Downloading: ${clip.title}`);
  };
  
  const startRecording = () => {
    // In a real app, this would start recording
    alert('Memulai rekaman suara...');
  };
  
  if (selectedAudio) {
    return (
      <Layout>
        <ScrollView style={styles.container}>
          <View style={styles.audioHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedAudio(null)}
            >
              <Text style={styles.backButtonText}>← Kembali</Text>
            </TouchableOpacity>
            
            <Text style={styles.audioDetailTitle}>{selectedAudio.title}</Text>
            <Text style={styles.audioDetailLanguage}>{selectedAudio.language}</Text>
          </View>
          
          <View style={styles.audioPlayerCard}>
            <View style={styles.audioPlayerIconContainer}>
              <TouchableOpacity
                style={styles.audioPlayerButton}
                onPress={(e: GestureResponderEvent) => {
                  e.stopPropagation();
                  togglePlayAudio(selectedAudio);
                }}
              >
                <Text style={styles.audioPlayerButtonIcon}>
                  {isPlaying ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.audioPlayerInfo}>
              <View style={styles.audioPlayerControls}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: isPlaying ? '70%' : '0%' }]}></View>
                </View>
                <Text style={styles.audioDuration}>{selectedAudio.duration}</Text>
              </View>
              
              <View style={styles.audioPlayerActions}>
                <TouchableOpacity style={styles.audioActionButton}>
                  <Text style={styles.audioActionButtonIcon}>🔁</Text>
                  <Text style={styles.audioActionButtonText}>Ulangi</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.audioActionButton}
                  onPress={(e: GestureResponderEvent) => {
                    e.stopPropagation();
                    downloadAudio(selectedAudio);
                  }}
                >
                  <Text style={styles.audioActionButtonIcon}>⬇️</Text>
                  <Text style={styles.audioActionButtonText}>Unduh</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.audioActionButton}>
                  <Text style={styles.audioActionButtonIcon}>📋</Text>
                  <Text style={styles.audioActionButtonText}>Transkrip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {selectedAudio.description && (
            <View style={styles.audioDescriptionContainer}>
              <Text style={styles.audioDescriptionTitle}>Deskripsi:</Text>
              <Text style={styles.audioDescriptionText}>{selectedAudio.description}</Text>
            </View>
          )}
          
          {selectedAudio.speaker && (
            <View style={styles.speakerContainer}>
              <Text style={styles.speakerTitle}>Penutur:</Text>
              <Text style={styles.speakerText}>{selectedAudio.speaker}</Text>
            </View>
          )}
          
          <Text style={styles.relatedTitle}>Audio Terkait</Text>
          
          {audioClips
            .filter(clip => clip.category === selectedAudio.category && clip.id !== selectedAudio.id)
            .slice(0, 2)
            .map(clip => (
              <TouchableOpacity 
                key={clip.id} 
                style={styles.audioCard}
                onPress={(e: GestureResponderEvent) => {
                  e.stopPropagation();
                  setSelectedAudio(clip);
                  setIsPlaying(true);
                }}
              >
                <View style={styles.audioIconContainer}>
                  <View style={styles.playAudioButton}>
                    <Text style={styles.playButtonText}>▶️</Text>
                  </View>
                </View>
                
                <View style={styles.audioInfo}>
                  <Text style={styles.audioTitle}>{clip.title}</Text>
                  <Text style={styles.audioLanguage}>{clip.language}</Text>
                  <Text style={styles.audioDuration}>{clip.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Warisan Suara</Text>
          <Text style={styles.headerSubtitle}>
            Kumpulan audio dari penutur asli bahasa daerah Kalimantan Timur
          </Text>
        </View>
        
        <View style={styles.categoryContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {audioCategories.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryPill,
                  selectedCategory === category.id && styles.selectedCategoryPill
                ]}
                onPress={(e: GestureResponderEvent) => {
                  e.stopPropagation();
                  handleCategorySelect(category.id);
                }}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryPillText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <Text style={styles.sectionTitle}>
          {selectedCategory 
            ? audioCategories.find((c: AudioCategory) => c.id === selectedCategory)?.name || ''
            : 'Semua Rekaman Audio'
          }
        </Text>
        
        {filteredAudioClips.map((clip: AudioClip) => (
          <TouchableOpacity 
            key={clip.id} 
            style={styles.audioCard}
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation();
              setSelectedAudio(clip);
            }} 
          >
            <View style={styles.audioIconContainer}>
              <TouchableOpacity 
                style={styles.playAudioButton}
                onPress={(e: GestureResponderEvent) => {
                  e.stopPropagation();
                  togglePlayAudio(clip);
                }}
              >
                <Text style={styles.playButtonText}>
                  {(selectedAudio as AudioClip | null)?.id === clip.id && isPlaying ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.audioInfo}>
              <Text style={styles.audioTitle}>{clip.title}</Text>
              <Text style={styles.audioLanguage}>{clip.language}</Text>
              <Text style={styles.audioDuration}>{clip.duration}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={(e: GestureResponderEvent) => {
                e.stopPropagation();
                downloadAudio(clip);
              }}
            >
              <Text style={styles.downloadButtonText}>⬇️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.recordButton}
          onPress={startRecording}
        >
          <Text style={styles.recordButtonIcon}>🎙</Text>
          <Text style={styles.recordButtonText}>Rekam Suara Saya</Text>
        </TouchableOpacity>
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
  categoryContainer: {
    marginBottom: 24,
  },
  categoryContent: {
    paddingRight: 16,
  },
  categoryPill: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryPill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryPillText: {
    color: Colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioIconContainer: {
    marginRight: 16,
  },
  playAudioButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 20,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  audioLanguage: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 12,
    color: Colors.lightText,
  },
  downloadButton: {
    padding: 8,
  },
  downloadButtonText: {
    fontSize: 20,
  },
  recordButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 16,
    marginBottom: 32,
  },
  recordButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Audio Detail Styles
  audioHeader: {
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
  audioDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  audioDetailLanguage: {
    fontSize: 16,
    color: Colors.primary,
  },
  audioPlayerCard: {
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
  audioPlayerIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  audioPlayerButton: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayerButtonIcon: {
    fontSize: 30,
  },
  audioPlayerInfo: {
    width: '100%',
  },
  audioPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  audioPlayerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  audioActionButton: {
    alignItems: 'center',
  },
  audioActionButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  audioActionButtonText: {
    fontSize: 12,
    color: Colors.text,
  },
  audioDescriptionContainer: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  audioDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  audioDescriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  speakerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  speakerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  speakerText: {
    fontSize: 14,
    color: Colors.text,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: Colors.text,
  },
}); 