import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Platform,
  Dimensions,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../components/layout/Layout';
import Colors from '../constants/Colors';
import * as Speech from 'expo-speech';
import { useFocusEffect } from '@react-navigation/native';

// Define Story type
interface Story {
  id: string;
  title: string;
  region: string;
  thumbnail: any; // Changed from string to any to support require()
  summary: string;
  content: string;
  audio: string;
}

// Voice interface
interface VoiceOption {
  id: string;
  name: string;
  region?: string | null;
  quality: number;
}

// Screen size breakpoints
const SCREEN_BREAKPOINTS = {
  SMALL: 360,  // Small phones
  MEDIUM: 480, // Large phones
  LARGE: 768,  // Tablets
  XLARGE: 1024 // Desktop/large tablets
};

// Mock data for stories
const stories: Story[] = [
  {
    id: '1',
    title: 'Legenda Putri Junjung Buih',
    region: 'Banjarmasin',
    thumbnail: require('../../assets/images/LegendaPutriJunjungBuih.jpeg'),
    summary: 'Kisah tentang seorang putri yang lahir dari buih sungai dan menjadi ratu.',
    content: `Pada zaman dahulu kala, di sebuah kerajaan bernama Negara Dipa di Kalimantan, terjadi keajaiban. 
    
    Dari buih-buih sungai yang berwarna putih bersih, muncul seorang putri cantik jelita. Putri tersebut diberi nama Putri Junjung Buih. Kecantikannya tak tertandingi oleh siapapun di kerajaan.

    Seiring berjalannya waktu, Putri Junjung Buih tumbuh menjadi seorang gadis yang cerdas dan bijaksana. Kecantikan dan kebijaksanaannya membuat seluruh rakyat mencintainya. Ia kemudian dinobatkan menjadi ratu pertama Kerajaan Negara Dipa.

    Pemerintahan Putri Junjung Buih sangat adil dan makmur. Ia selalu mementingkan kesejahteraan rakyatnya di atas segalanya. Dibawah kepemimpinannya, Kerajaan Negara Dipa menjadi kerajaan yang makmur dan disegani oleh kerajaan-kerajaan lain.

    Hingga kini, kisah Putri Junjung Buih tetap menjadi legenda yang diceritakan turun-temurun oleh masyarakat Kalimantan Selatan.`,
    audio: 'putri_junjung_buih.mp3'
  },
  {
    id: '2',
    title: 'Asal Usul Sungai Mahakam',
    region: 'Kutai',
    thumbnail: require('../../assets/images/sungaimahakam.jpeg'),
    summary: 'Kisah tentang asal mula terbentuknya Sungai Mahakam yang terkenal.',
    content: `Dahulu kala, di pedalaman Kalimantan Timur hiduplah seorang pemuda bernama Mahakam. Ia adalah seorang pemuda yang sakti dan memiliki seekor naga peliharaan yang sangat besar.

    Suatu hari, sang naga menjadi sangat lapar dan mulai mengamuk. Ia merusak hutan dan perkampungan penduduk. Mahakam sangat sedih melihat kekacauan yang ditimbulkan oleh naganya.

    Dengan berat hati, Mahakam memutuskan untuk mengorbankan dirinya. Ia menancapkan sebuah keris pusaka ke tanah dan menusukkan dirinya dengan keris yang sama. Seketika itu, tubuhnya berubah menjadi air yang mengalir deras dari tempat keris ditancapkan.

    Air itu terus mengalir tak henti-hentinya, membentuk sebuah sungai besar yang mengular panjang. Sungai itu kemudian diberi nama Sungai Mahakam, untuk mengenang pengorbanan sang pemuda.

    Sungai Mahakam kini menjadi sungai terpanjang di Kalimantan Timur dan menjadi sumber kehidupan bagi masyarakat di sekitarnya.`,
    audio: 'sungai_mahakam.mp3'
  },
  {
    id: '3',
    title: 'Kisah Lembuswana',
    region: 'Kutai Kartanegara',
    thumbnail: require('../../assets/images/Lembuswana.jpeg'),
    summary: 'Cerita tentang hewan mitologi Lembuswana yang menjadi simbol Kutai Kartanegara.',
    content: `Lembuswana adalah makhluk mitologi dari Kerajaan Kutai Kartanegara yang dipercaya sebagai hewan pelindung kerajaan. Makhluk ini memiliki tubuh gabungan dari lima hewan yang berbeda.

    Lembuswana memiliki kepala gajah yang melambangkan kebijaksanaan, tubuh harimau yang melambangkan keberanian, sayap garuda yang melambangkan kekuasaan, ekor ular yang melambangkan kekekalan, dan kaki singa yang melambangkan kepemimpinan.

    Menurut kepercayaan masyarakat Kutai, Lembuswana muncul di Danau Lipan saat Kerajaan Kutai Kartanegara berdiri. Kemunculannya dianggap sebagai pertanda baik dan berkat dari para dewa.

    Raja Kutai kemudian menjadikan Lembuswana sebagai simbol kerajaan. Hingga saat ini, Lembuswana tetap menjadi lambang Kabupaten Kutai Kartanegara dan dianggap sebagai identitas budaya masyarakat Kutai.`,
    audio: 'lembuswana.mp3'
  },
  {
    id: '4',
    title: 'Kisah Pesut Mahakam',
    region: 'Mahakam',
    thumbnail: require('../../assets/images/pesutmahakam.jpeg'),
    summary: 'Legenda tentang asal mula Pesut, mamalia air tawar yang hidup di Sungai Mahakam.',
    content: `Dahulu kala, hiduplah seorang gadis cantik bernama Putri Junjung Buih di tepi Sungai Mahakam. Ia memiliki kekasih seorang pemuda tampan dari desa seberang.

    Suatu hari, sang pemuda berjanji akan menjemput Putri Junjung Buih dengan perahu untuk melamarnya. Namun, di tengah perjalanan, perahu sang pemuda terkena badai dan tenggelam.

    Putri Junjung Buih yang setia menunggu di tepi sungai, akhirnya memutuskan untuk mencari kekasihnya. Ia terjun ke dalam Sungai Mahakam dan berenang mencari sang kekasih hingga ke muara.

    Para dewa yang menyaksikan kesetiaan Putri Junjung Buih merasa tersentuh. Mereka kemudian mengubah Putri Junjung Buih menjadi seekor mamalia air tawar dengan kulit halus berwarna abu-abu. Mamalia itu kemudian dikenal sebagai Pesut Mahakam.

    Hingga kini, Pesut Mahakam tetap berenang di sepanjang Sungai Mahakam, seolah masih mencari kekasihnya yang hilang. Pesut Mahakam menjadi hewan endemik yang dilindungi dan dianggap sebagai hewan keramat oleh masyarakat sekitar.`,
    audio: 'pesut_mahakam.mp3'
  },
  {
    id: '5',
    title: 'Legenda Gunung Batu Dinding',
    region: 'Berau',
    thumbnail: require('../../assets/images/batudinding.jpeg'),
    summary: 'Kisah tentang terbentuknya Gunung Batu Dinding yang menjulang tinggi di Berau.',
    content: `Di pedalaman Kalimantan Timur, terdapat sebuah gunung batu yang menjulang tinggi dan berbentuk seperti dinding raksasa. Gunung tersebut dikenal dengan nama Gunung Batu Dinding dan memiliki sebuah kisah yang menarik.

    Konon pada zaman dahulu, terdapat dua kerajaan yang bertetangga dan saling bermusuhan. Kedua kerajaan tersebut selalu berperang memperebutkan wilayah dan kekuasaan.

    Seorang pangeran dari salah satu kerajaan jatuh cinta kepada putri dari kerajaan musuh. Mereka diam-diam menjalin hubungan dan berencana untuk melarikan diri bersama.

    Ketika rencana pelarian mereka terbongkar, kedua raja menjadi sangat murka. Mereka mengerahkan pasukan untuk mengejar sepasang kekasih tersebut.

    Dalam pelarian, pangeran dan putri berdoa kepada dewa agar mereka tidak dipisahkan. Dewa mengabulkan doa mereka dengan cara yang tidak terduga. Tiba-tiba muncul dinding batu yang sangat tinggi menghalangi pasukan kedua kerajaan.

    Pangeran dan putri berubah menjadi batu di puncak dinding tersebut, bersatu selamanya. Hingga kini, Gunung Batu Dinding menjadi saksi bisu kisah cinta terlarang yang abadi.`,
    audio: 'gunung_batu_dinding.mp3'
  },
  {
    id: '6',
    title: 'Asal Usul Danau Lipan',
    region: 'Tenggarong',
    thumbnail: require('../../assets/images/danaulipan.jpeg'),
    summary: 'Cerita tentang terbentuknya Danau Lipan yang terkenal dengan keindahannya di Tenggarong.',
    content: `Dahulu kala, di Kalimantan Timur terdapat sebuah desa yang sangat makmur. Penduduk desa hidup dengan damai dan sejahtera. Namun, kedamaian itu terusik ketika datang seorang saudagar kaya yang tamak.

    Saudagar tersebut memiliki istri yang cantik jelita bernama Lipan. Ia sangat mencintai istrinya dan memberikan apapun yang diinginkan sang istri.

    Suatu hari, saudagar tersebut mengadakan pesta besar di rumahnya. Ia mengundang seluruh penduduk desa. Di tengah pesta, datang seorang pengemis tua yang kelaparan. Pengemis tersebut meminta makanan, namun saudagar dan istrinya mengusir pengemis itu dengan kasar.

    Pengemis tua yang sebenarnya adalah seorang dewa yang menyamar, menjadi marah. Ia mengutuk saudagar, istrinya, dan seluruh tamu pesta. Tiba-tiba bumi bergetar hebat, tanah amblas, dan air menyembur dari dalam bumi. Dalam sekejap, rumah saudagar dan seluruh tamu tenggelam.

    Tempat tersebut kemudian berubah menjadi sebuah danau yang indah. Danau itu diberi nama Danau Lipan, untuk mengingatkan orang-orang agar tidak bersikap tamak dan selalu berbagi kepada sesama.

    Hingga kini, Danau Lipan tetap menjadi salah satu tempat yang indah dan sering dikunjungi oleh wisatawan. Konon, pada malam-malam tertentu, penduduk sekitar masih bisa mendengar tangisan Lipan dari dalam danau.`,
    audio: 'danau_lipan.mp3'
  },
];

// Fungsi untuk memformat nama suara agar lebih pendek
const formatVoiceName = (fullName: string): string => {
  // Always return Gadis regardless of the actual voice
  return 'Suara Gadis (Wanita)';
};

export default function StoriesScreen() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { width, height } = useWindowDimensions(); // Responsive dimensions hook
  
  // Responsive screen size indicators
  const isSmallScreen = width <= SCREEN_BREAKPOINTS.SMALL;
  const isMediumScreen = width > SCREEN_BREAKPOINTS.SMALL && width <= SCREEN_BREAKPOINTS.MEDIUM;
  const isLargeScreen = width > SCREEN_BREAKPOINTS.MEDIUM && width <= SCREEN_BREAKPOINTS.LARGE;
  const isXLargeScreen = width > SCREEN_BREAKPOINTS.LARGE;
  const isDesktop = width > SCREEN_BREAKPOINTS.LARGE;
  
  // Responsive layout values
  const cardColumns = isXLargeScreen ? 3 : isLargeScreen ? 2 : 1;
  const cardWidth = isXLargeScreen ? '33.33%' : isLargeScreen ? '48%' : '100%';
  const cardMargin = isXLargeScreen ? '0%' : isLargeScreen ? '1%' : 0;
  const cardSpacing = 25; // New spacing value
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [pausedAtIndex, setPausedAtIndex] = useState(0);
  
  // Simple test function to check if speech works at all
  const testSpeech = () => {
    console.log('Testing basic speech...');
    Speech.speak('Tes satu dua tiga', {
      language: 'id-ID',
      onDone: () => console.log('Test speech completed'),
      onError: (error) => console.error('Test speech error:', error)
    });
  };
  
  // Function to stop audio
  const stopAudio = () => {
    console.log('Stopping audio');
    Speech.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParagraphIndex(0);
  };
  
  // Function to pause audio
  const pauseAudio = () => {
    console.log('Pausing audio');
    setPausedAtIndex(currentParagraphIndex);
    setIsPaused(true);
    setIsPlaying(false);
    Speech.stop();
  };
  
  // Stop audio when screen loses focus or unmounts
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused
      console.log('StoriesScreen is focused');
      
      // When screen loses focus or component unmounts
      return () => {
        console.log('StoriesScreen lost focus - pausing speech');
        if (isPlaying) {
          pauseAudio();
        }
      };
    }, [isPlaying, pauseAudio])
  );
  
  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      // This will run when the screen rotates or when the window size changes
      console.log('Screen dimensions changed:', window.width, window.height);
    });

    return () => subscription.remove();
  }, []);
  
  // Test speech functionality on component mount
  useEffect(() => {
    const testSpeech = async () => {
      try {
        console.log('Testing speech functionality...');
        // Check if speech is speaking (should be false initially)
        const isSpeaking = await Speech.isSpeakingAsync();
        console.log(`Speech.isSpeakingAsync() initial check: ${isSpeaking}`);
        
        // Test with a very simple speech
        console.log('Attempting to speak a test phrase silently');
        await Speech.speak('Test', { 
          volume: 0, // Silent test
          onDone: () => console.log('Test speech completed successfully'),
          onError: (error) => console.error('Test speech failed:', error)
        });
        
        console.log('Speech test initiated');
      } catch (error) {
        console.error('Error testing speech:', error);
      }
    };
    
    // Run the test after a short delay to ensure component is fully mounted
    setTimeout(testSpeech, 2000);
  }, []);
  
  // Get available voices when component mounts
  useEffect(() => {
    const getVoices = async () => {
      try {
        setIsLoadingVoices(true);
        console.log('Getting available voices...');
        
        // Add a longer delay to ensure the Speech API is fully initialized
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to get voices multiple times if first attempt fails
        let voices: Speech.Voice[] = [];
        let attempts = 0;
        const maxAttempts = 3;
        
        while (voices.length === 0 && attempts < maxAttempts) {
          attempts++;
          console.log(`Attempt ${attempts} to get voices`);
          
          try {
            voices = await Speech.getAvailableVoicesAsync();
            console.log(`Found ${voices.length} voices on attempt ${attempts}`);
          } catch (voiceError) {
            console.error(`Error getting voices on attempt ${attempts}:`, voiceError);
            // Wait before trying again
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        // Log all available voices for debugging
        if (voices.length > 0) {
          console.log('Sample voice:', JSON.stringify(voices[0], null, 2));
          console.log('All available voices:', voices.map(v => ({
            id: v.identifier,
            name: v.name || 'Unnamed',
            lang: v.language || 'Unknown'
          })));
        }
        
        // CRITICAL: Filter out ANY male voices
        const maleIdentifiers = ['ardi', 'male', 'laki', 'pria', 'man'];
        const femaleIdentifiers = ['gadis', 'female', 'wanita', 'woman', 'girl'];
        
        // Filter out known male voices first
        const filteredVoices = voices.filter(voice => {
          const name = (voice.name || '').toLowerCase();
          const id = (voice.identifier || '').toLowerCase();
          // Return false (filter out) if voice contains male identifier
          return !maleIdentifiers.some(term => name.includes(term) || id.includes(term));
        });
        
        console.log(`After filtering out male voices: ${filteredVoices.length} voices remain`);
        
        // Only look for Gadis or female voice
        let selectedGadisVoice: VoiceOption | null = null;
        
        // FORCED FEMALE VOICE APPROACH
        // 1. First try Microsoft Gadis specifically
        const microsoftGadis = filteredVoices.find(voice => {
          const name = (voice.name || '').toLowerCase();
          return (name.includes('microsoft') || name.includes('ms ')) && name.includes('gadis');
        });
        
        if (microsoftGadis) {
          console.log('Found Microsoft Gadis voice:', microsoftGadis.name);
          selectedGadisVoice = {
            id: microsoftGadis.identifier,
            name: 'Suara Gadis (Wanita)',
            region: 'Indonesia',
            quality: 10
          };
          // Show alert for debugging
          console.log('SUCCESS: Using Microsoft Gadis voice');
        } else {
          // 2. Try any Gadis voice
          const anyGadisVoice = filteredVoices.find(voice => {
            const name = (voice.name || '').toLowerCase();
            return name.includes('gadis');
          });
          
          if (anyGadisVoice) {
            console.log('Found Gadis voice:', anyGadisVoice.name);
            selectedGadisVoice = {
              id: anyGadisVoice.identifier,
              name: 'Suara Gadis (Wanita)',
              region: 'Indonesia',
              quality: 10
            };
            console.log('SUCCESS: Using Gadis voice');
          } else {
            // 3. Try any female voice
            const anyFemaleVoice = filteredVoices.find(voice => {
              const name = (voice.name || '').toLowerCase();
              return femaleIdentifiers.some(term => name.includes(term));
            });
            
            if (anyFemaleVoice) {
              console.log('Found female voice:', anyFemaleVoice.name);
              selectedGadisVoice = {
                id: anyFemaleVoice.identifier,
                name: 'Suara Gadis (Wanita)',
                region: 'Indonesia',
                quality: 8
              };
              console.log('SUCCESS: Using female voice');
            } else {
              // 4. If no female voice found, use empty ID to force high-pitched default
              console.log('NO FEMALE VOICE FOUND: Using high-pitched default');
              selectedGadisVoice = {
                id: '',  // IMPORTANT: Empty ID means system will use default voice with our high pitch
                name: 'Suara Gadis (Wanita)',
                region: 'Indonesia',
                quality: 5
              };
            }
          }
        }
        
        // Set the selected voice
        setSelectedVoice(selectedGadisVoice);
        console.log('Final voice selection:', selectedGadisVoice);
        
        // We don't need the voice options array anymore since we removed the selection UI
        setAvailableVoices([]);
        
      } catch (error) {
        console.error('Error in voice setup:', error);
        // Create an empty voice ID to use default with high pitch
        const fallbackVoice = {
          id: '',  // Empty ID means system will use default voice with our high pitch
          name: 'Suara Gadis (Wanita)',
          region: 'Indonesia',
          quality: 5
        };
        setSelectedVoice(fallbackVoice);
      } finally {
        setIsLoadingVoices(false);
      }
    };
    
    getVoices();
    
    // Cleanup function to stop speech when component unmounts
    return () => {
      Speech.stop();
    };
  }, []);
  
  // Check if speech is available on component mount
  useEffect(() => {
    const checkSpeechAvailability = async () => {
      const available = await Speech.isSpeakingAsync();
      if (available) {
        setIsPlaying(true);
      }
    };
    
    checkSpeechAvailability();
  }, []);
  
  // Function to play audio
  const playAudio = (text: string, startFromParagraph = 0) => {
    try {
      console.log('Starting playAudio from paragraph:', startFromParagraph);
      
      // Ensure text is not empty
      if (!text || text.trim() === '') {
        console.error('Empty text provided to playAudio');
        return;
      }
      
      // Split text into paragraphs
      const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
      console.log(`Text has ${paragraphs.length} paragraphs`);
      
      // Check if we have a valid paragraph to start from
      if (startFromParagraph >= paragraphs.length) {
        console.error('Invalid start paragraph index');
        return;
      }
      
      // Stop any existing speech
      Speech.stop();
      
      // Update states
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentParagraphIndex(startFromParagraph);
      
      // Just speak the current paragraph
      const currentParagraph = paragraphs[startFromParagraph];
      console.log(`Speaking paragraph ${startFromParagraph + 1}:`, currentParagraph.substring(0, 30) + '...');
      
      // Speech options
      const options: Speech.SpeechOptions = {
        language: 'id-ID',
        pitch: 1.5,
        rate: 0.85,
        onDone: () => {
          console.log(`Finished paragraph ${startFromParagraph + 1}`);
          // Move to next paragraph if we're still playing
          const nextIndex = startFromParagraph + 1;
          if (nextIndex < paragraphs.length) {
            setTimeout(() => {
              if (!isPaused) {
                setCurrentParagraphIndex(nextIndex);
                playAudio(text, nextIndex);
              }
            }, 1000);
          } else {
            // End of story
            console.log('Finished all paragraphs');
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentParagraphIndex(0);
          }
        },
        onStopped: () => {
          console.log('Speech stopped, isPaused:', isPaused);
        },
        onError: (error) => {
          console.error('Speech error:', error);
          setIsPlaying(false);
        }
      };
      
      // Add voice if we have a valid one
      if (selectedVoice && selectedVoice.id) {
        options.voice = selectedVoice.id;
      }
      
      // Speak the paragraph
      Speech.speak(currentParagraph, options);
      
    } catch (error) {
      console.error('Error in playAudio:', error);
      setIsPlaying(false);
      setIsPaused(false);
      alert('Maaf, terjadi kesalahan saat memainkan suara. Silakan coba lagi.');
    }
  };
  
  if (selectedStory) {
    return (
      <Layout>
        <ScrollView style={styles.container}>
          <View style={[
            styles.storyContainer,
            isDesktop && styles.storyContainerDesktop
          ]}>
            <View style={styles.storyHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  stopAudio();
                  setSelectedStory(null);
                }}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text style={styles.backButtonText}>Kembali</Text>
              </TouchableOpacity>
              
              <Text style={[
                styles.storyTitle,
                isDesktop && styles.storyTitleDesktop
              ]}>{selectedStory.title}</Text>
              <Text style={styles.storyRegion}>{selectedStory.region}</Text>
            </View>
            
            <View style={isDesktop ? styles.desktopContentLayout : null}>
              <View style={isDesktop ? styles.desktopImageContainer : null}>
                <Image 
                  source={selectedStory.thumbnail}
                  style={[
                    styles.storyImage,
                    isDesktop && styles.storyImageDesktop
                  ]}
                  resizeMode="cover"
                />
              </View>
              
              <View style={isDesktop ? styles.desktopContentContainer : null}>
                <View style={styles.audioPlayer}>
                  <TouchableOpacity 
                    style={[
                      styles.playButton,
                      isPlaying ? styles.stopButton : isPaused ? styles.resumeButton : styles.playButton
                    ]}
                    onPress={() => {
                      if (isPlaying) {
                        pauseAudio();
                      } else if (isPaused) {
                        // Resume from where we paused
                        playAudio(selectedStory.content, pausedAtIndex);
                      } else {
                        // Add a test button for debugging
                        if (__DEV__ && false) { // Set to true to enable test button
                          testSpeech();
                        } else {
                          // Start from beginning
                          playAudio(selectedStory.content, 0);
                        }
                      }
                    }}
                    disabled={isLoadingVoices}
                  >
                    {isLoadingVoices ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <View style={styles.playButtonContent}>
                        <Ionicons 
                          name={isPlaying ? "pause" : isPaused ? "play" : "volume-high"} 
                          size={isDesktop ? 24 : 20} 
                          color="#fff" 
                        />
                        <Text style={styles.playButtonText}>
                          {isPlaying ? 'Jeda Narasi' : isPaused ? 'Lanjutkan Narasi' : 'Dengarkan Cerita'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  {selectedVoice && (
                    <Text style={styles.voiceInfo}>
                      Menggunakan: <Text style={styles.voiceName}>{formatVoiceName(selectedVoice.name)}</Text>
                    </Text>
                  )}
                </View>
                
                <View style={styles.storyContentContainer}>
                  {selectedStory.content.split('\n\n').map((paragraph, index) => (
                    <View key={index} style={styles.paragraphContainer}>
                      <Text style={[
                        styles.storyContent,
                        isDesktop && styles.storyContentDesktop
                      ]}>{paragraph}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cerita Daerah</Text>
          <Text style={styles.headerSubtitle}>
            Jelajahi kekayaan cerita rakyat dari Kalimantan Timur
          </Text>
        </View>
        
        <View style={[
          styles.storiesList,
          isDesktop && styles.storiesListDesktop
        ]}>
          {stories.map((story) => (
            <View 
              key={story.id} 
              style={[
                styles.cardWrapper,
                { 
                  width: cardWidth, 
                  margin: cardMargin,
                  marginBottom: cardSpacing
                },
                isDesktop && styles.cardWrapperDesktop
              ]}
            >
              <TouchableOpacity 
                style={styles.storyCard}
                onPress={() => setSelectedStory(story)}
              >
                <Image 
                  source={story.thumbnail}
                  style={styles.storyThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.storyCardOverlay}>
                  <Text style={styles.storyCardTitle} numberOfLines={2}>
                    {story.title}
                  </Text>
                  <View style={styles.regionBadge}>
                    <Text style={styles.regionText}>{story.region}</Text>
                  </View>
                  <Text 
                    style={styles.storyCardSummary}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {story.summary}
                  </Text>
                  <View style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>Baca selengkapnya</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header styles
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    maxWidth: 600,
  },
  
  // Stories list
  storiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  storiesListDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    marginHorizontal: 8,
  },
  cardWrapperDesktop: {
    width: '31%',
    marginRight: '2%',
  },
  storyCard: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.buttonBackground,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 200,
  },
  storyThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  storyCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: '70%',
    justifyContent: 'flex-end',
  },
  storyCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  regionBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  regionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  storyCardSummary: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginRight: 6,
  },
  
  // Story detail styles
  storyContainer: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  storyContainerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    padding: 40,
  },
  storyHeader: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  storyTitleDesktop: {
    fontSize: 32,
  },
  storyRegion: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  storyImageDesktop: {
    height: 300,
  },
  
  // Desktop layout
  desktopContentLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desktopImageContainer: {
    width: '40%',
  },
  desktopContentContainer: {
    width: '56%',
  },
  
  // Audio player
  audioPlayer: {
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  playButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
  voiceInfo: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 12,
  },
  voiceName: {
    color: Colors.primary,
    fontWeight: '500',
  },
  storyContentContainer: {
    marginBottom: 20,
  },
  paragraphContainer: {
    marginBottom: 16,
  },
  storyContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  storyContentDesktop: {
    fontSize: 18,
    lineHeight: 28,
  },
}); 