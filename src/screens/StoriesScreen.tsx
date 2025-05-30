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

// Define Story type
interface Story {
  id: string;
  title: string;
  region: string;
  thumbnail: string;
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
    thumbnail: 'https://placehold.co/400x200/F57C00/FFF?text=Putri+Junjung+Buih',
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
    thumbnail: 'https://placehold.co/400x200/F57C00/FFF?text=Sungai+Mahakam',
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
    thumbnail: 'https://placehold.co/400x200/F57C00/FFF?text=Lembuswana',
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
    thumbnail: 'https://placehold.co/400x200/F57C00/FFF?text=Pesut+Mahakam',
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
    thumbnail: 'https://placehold.co/400x200/F57C00/FFF?text=Gunung+Batu+Dinding',
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
    thumbnail: 'https://placehold.co/400x200/F57C00/FFF?text=Danau+Lipan',
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
  if (fullName.toLowerCase().includes('ardi')) {
    return 'Ardi';
  } else if (fullName.toLowerCase().includes('gadis')) {
    return 'Gadis';
  }
  return fullName;
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
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  
  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      // This will run when the screen rotates or when the window size changes
      console.log('Screen dimensions changed:', window.width, window.height);
    });

    return () => subscription.remove();
  }, []);
  
  // Get available voices when component mounts
  useEffect(() => {
    const getVoices = async () => {
      try {
        setIsLoadingVoices(true);
        const voices = await Speech.getAvailableVoicesAsync();
        
        // Log semua suara yang tersedia untuk debugging
        console.log('Semua suara yang tersedia:', voices.map(v => ({
          id: v.identifier,
          name: v.name,
          lang: v.language
        })));
        
        // Filter hanya untuk Microsoft Ardi dan Microsoft Gadis
        const voiceOptions: VoiceOption[] = voices
          .filter(voice => {
            const voiceName = (voice.name || '').toLowerCase();
            return voiceName.includes('ardi') || voiceName.includes('gadis');
          })
          .map(voice => ({
            id: voice.identifier,
            name: voice.name || voice.identifier,
            region: voice.language === 'id-ID' ? 'Indonesia' : null,
            quality: voice.name?.toLowerCase().includes('gadis') ? 10 : 8
          }));
          
        // Log suara yang terpilih
        console.log('Suara yang tersedia setelah filter:', voiceOptions);
        
        setAvailableVoices(voiceOptions);
        
        // Select the best voice (preferring Gadis)
        if (voiceOptions.length > 0) {
          // Cari suara Gadis sebagai default
          const gadisVoice = voiceOptions.find(v => v.name.toLowerCase().includes('gadis'));
          setSelectedVoice(gadisVoice || voiceOptions[0]);
          console.log('Menggunakan suara:', selectedVoice?.name);
        } else {
          // Fallback jika tidak menemukan suara yang diinginkan
          console.log('Tidak menemukan suara Microsoft Ardi atau Gadis');
          setSelectedVoice({
            id: '',
            name: 'Suara Default',
            quality: 0
          });
        }
      } catch (error) {
        console.error('Error getting voices:', error);
        // Fallback jika terjadi error
        setSelectedVoice({
          id: '',
          name: 'Suara Default',
          quality: 0
        });
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
  
  // Function to play audio using Expo's Speech API with natural pauses
  const playAudio = async (text: string) => {
    // Hapus jeda SSML dan gunakan pendekatan pemisahan kalimat
    // Split teks menjadi kalimat-kalimat (berdasarkan tanda baca)
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Split menjadi paragraf
    const paragraphs = text.split('\n\n');
    
    // Mulai dari paragraf pertama
    let currentParagraphIndex = 0;
    
    const speakNextParagraph = () => {
      if (currentParagraphIndex < paragraphs.length) {
        const currentParagraph = paragraphs[currentParagraphIndex];
        
        const options: Speech.SpeechOptions = {
          language: 'id-ID',
          pitch: 1.0, // Normal pitch for natural sound
          rate: 0.90,  // Slightly slower for more natural sound
          onDone: () => {
            // Jeda antar paragraf
            setTimeout(() => {
              currentParagraphIndex++;
              if (currentParagraphIndex < paragraphs.length) {
                speakNextParagraph();
              } else {
                setIsPlaying(false);
              }
            }, 1000); // Jeda 1 detik antar paragraf
          },
          onStopped: () => {
            setIsPlaying(false);
          },
          onError: () => {
            setIsPlaying(false);
          }
        };
        
        // Add voice if we have one selected
        if (selectedVoice) {
          options.voice = selectedVoice.id;
          console.log('Menggunakan suara:', selectedVoice.name);
        }
        
        // Baca paragraf tanpa menambahkan tag SSML
        Speech.speak(currentParagraph, options);
      }
    };
    
    // Stop any existing speech
    await Speech.stop();
    
    setIsPlaying(true);
    speakNextParagraph();
  };
  
  // Function to stop audio
  const stopAudio = () => {
    Speech.stop();
    setIsPlaying(false);
  };
  
  if (selectedStory) {
    return (
      <Layout>
        <ScrollView style={styles.container}>
          <View style={[
            styles.comicPanel,
            isSmallScreen ? styles.comicPanelSmall : null,
            isDesktop ? styles.comicPanelDesktop : null
          ]}>
            <View style={[
              styles.storyHeader,
              isDesktop ? styles.storyHeaderDesktop : null
            ]}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  stopAudio();
                  setSelectedStory(null);
                }}
              >
                <Text style={styles.backButtonText}>← Kembali</Text>
              </TouchableOpacity>
              
              <Text style={[
                styles.storyTitle,
                isSmallScreen ? { fontSize: 24 } : null,
                isDesktop ? styles.storyTitleDesktop : null
              ]}>{selectedStory.title}</Text>
              <Text style={[
                styles.storyRegion,
                isDesktop ? styles.storyRegionDesktop : null
              ]}>{selectedStory.region}</Text>
            </View>
            
            <View style={isDesktop ? styles.desktopContentLayout : null}>
              <View style={isDesktop ? styles.desktopImageContainer : null}>
                <Image 
                  source={{ uri: selectedStory.thumbnail }}
                  style={[
                    styles.storyImage,
                    isSmallScreen ? { height: 180 } : null,
                    isDesktop ? styles.storyImageDesktop : null
                  ]}
                  resizeMode="cover"
                />
              </View>
              
              <View style={isDesktop ? styles.desktopContentContainer : null}>
                <View style={[
                  styles.audioPlayer,
                  isDesktop ? styles.audioPlayerDesktop : null
                ]}>
                  <TouchableOpacity 
                    style={[
                      styles.playButton,
                      isPlaying ? styles.stopButton : styles.playButton,
                      isDesktop ? styles.playButtonDesktop : null
                    ]}
                    onPress={() => {
                      if (isPlaying) {
                        stopAudio();
                      } else {
                        playAudio(selectedStory.content);
                      }
                    }}
                    disabled={isLoadingVoices}
                  >
                    {isLoadingVoices ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.playButtonText}>
                        {isPlaying ? '⏹️ Hentikan Narasi' : '🔊 Dengarkan Cerita'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  {selectedVoice && (
                    <Text style={styles.voiceInfo}>
                      Menggunakan suara: <Text style={styles.voiceName}>{formatVoiceName(selectedVoice.name)}</Text>
                      {selectedVoice.region && (
                        <Text style={styles.voiceRegion}> (Asal: {selectedVoice.region})</Text>
                      )}
                    </Text>
                  )}
                  
                  {/* Pilihan suara - tampilkan hanya ketika audio TIDAK diputar */}
                  {availableVoices.length > 1 && !isPlaying && (
                    <View style={[
                      styles.voiceSelector,
                      { marginTop: 16 }
                    ]}>
                      <Text style={styles.voiceSelectorLabel}>Pilih suara:</Text>
                      <View style={[
                        styles.voiceOptionsContainer,
                        { flexDirection: isDesktop ? 'row' : 'column' }
                      ]}>
                        {availableVoices.map((voice, index) => (
                          <TouchableOpacity 
                            key={voice.id} 
                            style={[
                              styles.voiceOption,
                              selectedVoice?.id === voice.id ? styles.selectedVoiceOption : null,
                              !isDesktop ? styles.voiceOptionMobile : null
                            ]}
                            onPress={() => {
                              setSelectedVoice(voice);
                              console.log('Mengganti ke suara:', formatVoiceName(voice.name), voice.region ? `(${voice.region})` : '');
                            }}
                          >
                            <Text 
                              style={[
                                styles.voiceOptionText,
                                selectedVoice?.id === voice.id ? styles.selectedVoiceOptionText : null
                              ]}
                            >
                              {formatVoiceName(voice.name)}
                            </Text>
                            {voice.region && (
                              <Text 
                                style={[
                                  styles.voiceRegionBadge,
                                  selectedVoice?.id === voice.id ? styles.selectedVoiceRegionBadge : null
                                ]}
                              >
                                {voice.region}
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
                
                <View style={[
                  styles.comicContentContainer,
                  isDesktop ? styles.comicContentContainerDesktop : null
                ]}>
                  {selectedStory.content.split('\n\n').map((paragraph, index) => (
                    <View key={index} style={[
                      styles.speechBubble,
                      isSmallScreen ? styles.speechBubbleSmall : null,
                      isDesktop ? styles.speechBubbleDesktop : null,
                      isDesktop && index % 2 !== 0 ? styles.speechBubbleDesktopAlternate : null
                    ]}>
                      <Text style={[
                        styles.storyContent,
                        isSmallScreen ? { fontSize: 14, lineHeight: 20 } : null,
                        isDesktop ? styles.storyContentDesktop : null
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
          <Text style={[
            styles.comicTitle,
            isSmallScreen && { fontSize: 28 }
          ]}>CERITA DAERAH</Text>
          <Text style={styles.headerSubtitle}>
            Jelajahi kekayaan cerita rakyat dari Kalimantan Timur
          </Text>
        </View>
        
        <View style={[
          styles.storiesList,
          isDesktop && styles.storiesListDesktop
        ]}>
          {stories.map((story, index) => (
            <View 
              key={story.id} 
              style={[
                styles.cardWrapper,
                { 
                  width: cardWidth, 
                  margin: cardMargin,
                  marginBottom: cardSpacing,
                  ...(isDesktop && { 
                    width: '33.33%',
                    paddingHorizontal: 10,
                  })
                },
                !isDesktop && styles.cardWrapperMobile
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.comicCard,
                  !isDesktop && styles.comicCardMobile,
                  isSmallScreen && styles.comicCardSmall
                ]}
                onPress={() => setSelectedStory(story)}
              >
                <View style={styles.comicCardInner}>
                  <Image 
                    source={{ uri: story.thumbnail }}
                    style={[
                      styles.comicThumbnail,
                      !isDesktop && styles.comicThumbnailMobile,
                      isSmallScreen && { height: 140 }
                    ]}
                    resizeMode="cover"
                  />
                  <View style={[
                    styles.storyInfo,
                    !isDesktop && styles.storyInfoMobile
                  ]}>
                    <Text 
                      style={[
                        styles.comicCardTitle,
                        !isDesktop && styles.comicCardTitleMobile,
                        isSmallScreen && { fontSize: 16 }
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {story.title}
                    </Text>
                    <View style={styles.regionBadge}>
                      <Text style={styles.storyCardRegion}>{story.region}</Text>
                    </View>
                    <View style={styles.summarySpeechBubble}>
                      <Text 
                        style={[
                          styles.storyCardSummary,
                          !isDesktop && styles.storyCardSummaryMobile,
                          isSmallScreen && { fontSize: 12, lineHeight: 16 }
                        ]}
                        numberOfLines={isSmallScreen ? 2 : 3}
                        ellipsizeMode="tail"
                      >
                        {story.summary}
                      </Text>
                    </View>
                    <View style={styles.readMoreBadge}>
                      <Text style={styles.readMoreText}>Baca selengkapnya →</Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  styles.comicCardShadow,
                  !isDesktop && styles.comicCardShadowMobile,
                  isSmallScreen && { top: 4, left: 4, right: -4, bottom: -4 }
                ]}></View>
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
    padding: 16,
    backgroundColor: '#FFFBF0',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  comicTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    fontFamily: Platform.OS === 'ios' ? 'Comic Sans MS' : 'sans-serif-condensed',
    letterSpacing: 2,
    transform: [{ rotate: '-1deg' }]
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  storiesList: {
    width: '100%',
  },
  storiesListDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  cardWrapper: {
    marginBottom: 25,
  },
  cardWrapperDesktop: {
    width: '32%',
    marginRight: '1%',
  },
  comicCard: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'visible',
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  comicCardInner: {
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  comicCardShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: '#000',
    borderRadius: 12,
    zIndex: -1,
  },
  comicThumbnail: {
    width: '100%',
    height: 180,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  storyInfo: {
    padding: 16,
  },
  comicCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Comic Sans MS' : 'sans-serif-condensed',
    textTransform: 'uppercase',
  },
  regionBadge: {
    backgroundColor: '#FFC107',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
    transform: [{ rotate: '-2deg' }],
  },
  storyCardRegion: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  summarySpeechBubble: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
  },
  storyCardSummary: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'sans-serif',
  },
  readMoreBadge: {
    backgroundColor: '#FF5722',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#000',
    transform: [{ rotate: '2deg' }],
  },
  readMoreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Story Detail Styles
  comicPanel: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#000',
    position: 'relative',
  },
  storyHeader: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 16,
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#000',
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Comic Sans MS' : 'sans-serif-condensed',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  storyRegion: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  storyImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#000',
  },
  audioPlayer: {
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  stopButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  comicContentContainer: {
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
  },
  storyContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'sans-serif',
  },
  voiceInfo: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  voiceName: {
    color: '#FF5722',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  voiceRegion: {
    color: '#666',
    fontStyle: 'italic',
  },
  voiceSelector: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  voiceSelectorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  voiceOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  voiceOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    minWidth: 150,
  },
  voiceOptionMobile: {
    marginVertical: 6,
    marginHorizontal: 0,
    width: '80%',
    minWidth: 200,
  },
  selectedVoiceOption: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FF5722',
  },
  voiceOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedVoiceOptionText: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  voiceRegionBadge: {
    fontSize: 10,
    color: '#000',
    backgroundColor: '#FFC107',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  selectedVoiceRegionBadge: {
    backgroundColor: '#FF5722',
    color: '#FFF',
    borderColor: '#000',
  },
  // Mobile-specific styles for cards
  cardWrapperMobile: {
    width: '100%',
    marginBottom: 35,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  comicCardMobile: {
    borderWidth: 2,
    marginHorizontal: 6,
    marginVertical: 8,
  },
  comicCardSmall: {
    borderWidth: 1,
    marginVertical: 10,
  },
  comicThumbnailMobile: {
    height: 160,
  },
  storyInfoMobile: {
    padding: 16,
  },
  comicCardTitleMobile: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 5,
  },
  storyCardSummaryMobile: {
    fontSize: 13,
    lineHeight: 18,
  },
  comicCardShadowMobile: {
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
  },
  // Small screen specific styles
  comicPanelSmall: {
    padding: 12,
    borderWidth: 2,
  },
  speechBubbleSmall: {
    padding: 12,
    borderWidth: 1,
  },
  comicPanelDesktop: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    padding: 30,
    borderWidth: 4,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  storyHeaderDesktop: {
    marginBottom: 30,
    position: 'relative',
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#FFC107',
    borderStyle: 'dashed',
  },
  storyTitleDesktop: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 87, 34, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
  },
  storyRegionDesktop: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#FF5722',
  },
  desktopContentLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  desktopImageContainer: {
    width: '38%',
  },
  desktopContentContainer: {
    width: '58%',
  },
  storyImageDesktop: {
    height: 350,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  audioPlayerDesktop: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F9F5E7',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  playButtonDesktop: {
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 3,
  },
  comicContentContainerDesktop: {
    marginTop: 20,
  },
  speechBubbleDesktop: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 3,
    position: 'relative',
    backgroundColor: '#FFF9C4',
    maxWidth: '95%',
    alignSelf: 'flex-start',
    transform: [{ rotate: '-1deg' }],
  },
  speechBubbleDesktopAlternate: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-end',
    transform: [{ rotate: '1deg' }],
  },
  storyContentDesktop: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
}); 