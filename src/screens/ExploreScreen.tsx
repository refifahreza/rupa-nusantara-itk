import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
  Animated,
  ImageSourcePropType,
  Pressable,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Layout from "../components/layout/Layout";
import Colors from "../constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;

// Define PhotoItem type with aspect ratio
interface PhotoItem {
  url: any;
  type: 'landscape' | 'square' | 'portrait';
  caption?: string;
}

// Define Region type
interface Region {
  id: string;
  name: string;
  thumbnail: ImageSourcePropType;
  description: string;
  population: string;
  location: string;
  culture: CultureItem[];
  photos: PhotoItem[];
  funFacts: string[];
}

// Define CultureItem type
interface CultureItem {
  name: string;
  image: any;
  description: string;
}

// Load local images
const bontangImage = require('../../assets/images/bontang.jpg');
const iconImage = require('../../assets/icon.png');
const splashImage = require('../../assets/splash-icon.png');
const adaptiveIconImage = require('../../assets/adaptive-icon.png');
const faviconImage = require('../../assets/favicon.png');

// Function to get local image based on index (to reuse available images)
const getLocalImage = (index: number): any => {
  const images = [bontangImage, iconImage, splashImage, adaptiveIconImage, faviconImage];
  return images[index % images.length];
};

// Mock data for regions
const regions: Region[] = [
  {
    id: "1",
    name: "Kota Samarinda",
    thumbnail: getLocalImage(0),
    description:
      "Samarinda adalah ibu kota provinsi Kalimantan Timur, Indonesia. Kota ini memiliki luas wilayah 718 km² dengan populasi sekitar 812.597 jiwa. Samarinda terletak di tepi Sungai Mahakam dan dikenal sebagai kota dengan berbagai pusat kebudayaan dan perdagangan.",
    population: "812.597 jiwa (2019)",
    location: "Terletak di tepi Sungai Mahakam",
    culture: [
      {
        name: "Upacara Adat Erau",
        image: Platform.OS === 'web' ? getLocalImage(1) : getLocalImage(1),
        description: "Upacara adat yang dilaksanakan sebagai ungkapan rasa syukur masyarakat Kutai. Biasanya diadakan setiap tahun dengan berbagai prosesi dan tarian tradisional."
      },
      {
        name: "Tari Ronggeng Melayu",
        image: Platform.OS === 'web' ? getLocalImage(2) : getLocalImage(2),
        description: "Tarian tradisional yang menggambarkan kegembiraan masyarakat Melayu. Ditarikan dengan gerakan yang lemah gemulai diiringi musik tradisional Melayu."
      },
      {
        name: "Musik Tingkilan",
        image: Platform.OS === 'web' ? getLocalImage(3) : getLocalImage(3),
        description: "Musik tradisional dari Kalimantan Timur yang dimainkan dengan alat musik petik bernama gambus dan kendang. Sering digunakan untuk mengiringi tarian dan upacara adat."
      },
      {
        name: "Kerajinan Anyaman Rotan",
        image: Platform.OS === 'web' ? getLocalImage(4) : getLocalImage(4),
        description: "Kerajinan tangan khas Kalimantan yang terbuat dari rotan. Digunakan untuk membuat berbagai peralatan rumah tangga dan hiasan dengan teknik menganyam yang telah diwariskan turun-temurun."
      },
    ],
    photos: [
      {
        url: Platform.OS === 'web' ? getLocalImage(0) : getLocalImage(0),
        type: "landscape",
        caption: "Masjid Islamic Center Samarinda"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(1) : getLocalImage(1),
        type: "square",
        caption: "Sungai Mahakam"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(2) : getLocalImage(2),
        type: "portrait",
        caption: "Pasar Pagi Samarinda"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(3) : getLocalImage(3),
        type: "landscape",
        caption: "Taman Kota"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(4) : getLocalImage(4),
        type: "square",
        caption: "Festival Budaya Erau"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(0) : getLocalImage(0),
        type: "portrait",
        caption: "Kuliner Khas Samarinda"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(1) : getLocalImage(1),
        type: "landscape",
        caption: "Kerajinan Tradisional"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(2) : getLocalImage(2),
        type: "square",
        caption: "Tarian Adat"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(3) : getLocalImage(3),
        type: "portrait",
        caption: "Wisata Alam"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(4) : getLocalImage(4),
        type: "landscape",
        caption: "Transportasi Sungai"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(0) : getLocalImage(0),
        type: "square",
        caption: "Institusi Pendidikan"
      },
      {
        url: Platform.OS === 'web' ? getLocalImage(1) : getLocalImage(1),
        type: "portrait",
        caption: "Ekonomi Kreatif"
      },
    ],
    funFacts: [
      "Samarinda memiliki Masjid Islamic Center yang merupakan masjid terbesar kedua di Indonesia setelah Masjid Istiqlal",
      'Nama Samarinda berasal dari kata "sama" dan "rendah" yang berarti pemukiman yang sama rendahnya',
      'Kota ini dikenal dengan sebutan "Kota Tepian" karena letaknya di tepi Sungai Mahakam',
    ],
  },
  {
    id: "2",
    name: "Balikpapan",
    thumbnail: getLocalImage(1),
    description:
      "Balikpapan adalah kota terbesar kedua di Kalimantan Timur. Dikenal sebagai kota industri dan pelabuhan, Balikpapan juga menawarkan pantai-pantai indah dan hutan bakau yang masih terjaga.",
    population: "688.318 jiwa (2020)",
    location: "Terletak di pesisir timur Kalimantan",
    culture: [
      {
        name: "Festival Balikpapan",
        image: getLocalImage(2),
        description: "Festival tahunan yang menampilkan berbagai pertunjukan seni dan budaya dari seluruh Kalimantan Timur."
      },
      {
        name: "Tari Pesisir",
        image: getLocalImage(3),
        description: "Tarian yang menggambarkan kehidupan masyarakat pesisir dengan gerakan yang dinamis."
      }
    ],
    photos: [
      {
        url: getLocalImage(0),
        type: "landscape",
        caption: "Pantai Kemala"
      },
      {
        url: getLocalImage(4),
        type: "square",
        caption: "Hutan Mangrove"
      }
    ],
    funFacts: [
      "Balikpapan dijuluki sebagai 'Kota Minyak' karena sejarahnya sebagai pusat pengeboran minyak",
      "Balikpapan memiliki bandara internasional terbesar di Kalimantan Timur",
      "Kota ini dikenal memiliki tingkat kebersihan yang tinggi di Indonesia"
    ],
  },
  {
    id: "3",
    name: "Berau",
    thumbnail: getLocalImage(2),
    description:
      "Berau adalah kabupaten di Kalimantan Timur yang terkenal dengan kekayaan alamnya. Pulau Derawan dan Maratua yang berada di wilayah Berau dikenal sebagai destinasi wisata bahari kelas dunia.",
    population: "214.398 jiwa (2020)",
    location: "Terletak di bagian utara Kalimantan Timur",
    culture: [
      {
        name: "Tari Jepen",
        image: getLocalImage(0),
        description: "Tarian tradisional masyarakat pesisir Berau yang dipengaruhi budaya Melayu dan Arab."
      }
    ],
    photos: [
      {
        url: getLocalImage(1),
        type: "landscape",
        caption: "Pulau Derawan"
      },
      {
        url: getLocalImage(3),
        type: "portrait",
        caption: "Penyu Hijau"
      }
    ],
    funFacts: [
      "Berau memiliki habitat penyu hijau terbesar di Indonesia",
      "Danau Labuan Cermin di Berau memiliki fenomena unik dimana airnya terdiri dari lapisan air tawar dan air asin",
      "Berau adalah penghasil udang terbesar di Kalimantan Timur"
    ],
  },
  {
    id: "4",
    name: "Kutai Kartanegara",
    thumbnail: getLocalImage(3),
    description:
      "Kutai Kartanegara adalah kabupaten terluas di Kalimantan Timur dan merupakan wilayah bekas Kesultanan Kutai yang kaya akan sejarah dan budaya.",
    population: "725.293 jiwa (2020)",
    location: "Terletak di sekitar Sungai Mahakam",
    culture: [
      {
        name: "Upacara Belimbur",
        image: getLocalImage(4),
        description: "Ritual mandi bersama di Sungai Mahakam sebagai simbol pembersihan diri dari hal-hal negatif."
      }
    ],
    photos: [
      {
        url: getLocalImage(0),
        type: "square",
        caption: "Museum Mulawarman"
      }
    ],
    funFacts: [
      "Kutai Kartanegara adalah kerajaan tertua di Indonesia, berdiri sejak abad ke-4 Masehi",
      "Festival Erau yang terkenal diadakan di Tenggarong, ibukota Kutai Kartanegara",
      "Museum Mulawarman menyimpan koleksi benda-benda bersejarah dari Kesultanan Kutai"
    ],
  },
  {
    id: "5",
    name: "Bontang",
    thumbnail: bontangImage,
    description:
      "Bontang adalah kota industri di Kalimantan Timur yang terkenal dengan pabrik gas alam cair (LNG) terbesar di Indonesia. Meski demikian, Bontang juga memiliki keindahan alam seperti terumbu karang dan hutan mangrove.",
    population: "174.452 jiwa (2020)",
    location: "Terletak di pesisir timur Kalimantan",
    culture: [
      {
        name: "Pesta Laut",
        image: getLocalImage(1),
        description: "Perayaan tahunan nelayan Bontang sebagai ungkapan syukur atas hasil laut yang melimpah."
      }
    ],
    photos: [
      {
        url: getLocalImage(2),
        type: "landscape",
        caption: "Taman Nasional Kutai"
      }
    ],
    funFacts: [
      "Bontang memiliki pabrik LNG terbesar di dunia",
      "Kota ini memiliki tingkat pendapatan per kapita tertinggi di Kalimantan Timur",
      "Meski menjadi kota industri, Bontang memiliki terumbu karang yang masih terjaga dengan baik"
    ],
  },
  {
    id: "6",
    name: "Paser",
    thumbnail: getLocalImage(4),
    description:
      "Paser adalah kabupaten di Kalimantan Timur yang berbatasan langsung dengan Kalimantan Selatan. Daerah ini kaya akan pertanian dan perkebunan, serta memiliki pantai yang indah.",
    population: "273.967 jiwa (2020)",
    location: "Terletak di bagian selatan Kalimantan Timur",
    culture: [
      {
        name: "Tari Ronggeng Paser",
        image: getLocalImage(0),
        description: "Tarian khas masyarakat Paser yang biasanya ditampilkan pada acara penting dan perayaan."
      }
    ],
    photos: [
      {
        url: getLocalImage(3),
        type: "portrait",
        caption: "Pantai Tanah Merah"
      }
    ],
    funFacts: [
      "Paser memiliki tambang batubara terbesar di Kalimantan Timur",
      "Masyarakat Paser memiliki tradisi bercocok tanam padi dengan sistem perladangan berpindah",
      "Kabupaten ini merupakan daerah penghasil kelapa sawit terbesar di provinsi"
    ],
  }
];

// Helper function to create gallery columns
const createGalleryColumns = (photos: PhotoItem[], columnCount: number) => {
  const columns = Array.from({ length: columnCount }, () => [] as PhotoItem[]);
  
  photos.forEach((photo, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(photo);
  });
  
  return columns;
};

export default function ExploreScreen() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isDesktop, setIsDesktop] = useState(windowWidth >= 1024);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegions, setFilteredRegions] = useState(regions);
  const [isSearching, setIsSearching] = useState(false);
  
  // Add hover state for cards
  const [hoveredFeatured, setHoveredFeatured] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);
  
  // Create refs for all regions to track their positions
  const regionRefs = useRef<Array<any>>(new Array(regions.length).fill(null));
  const featuredRefs = useRef<Array<any>>(new Array(regions.length).fill(null));
  const categoryRefs = useRef<Array<any>>(new Array(6).fill(null));
  
  // Animation values for each card
  const [entryAnimations] = useState(() => 
    regions.map(() => new Animated.Value(0))
  );
  
  const [categoryAnimations] = useState(() => 
    Array(6).fill(0).map(() => new Animated.Value(0))
  );

  // Add these animation values in the component where other animations are defined
  const [cultureAnimFade] = useState(new Animated.Value(0));
  const [cultureAnimSlide] = useState(new Animated.Value(50));
  const [galleryAnimFade] = useState(new Animated.Value(0));
  const [galleryAnimSlide] = useState(new Animated.Value(50));

  // Tambahkan animasi untuk tab informasi
  const [infoAnimFade] = useState(new Animated.Value(0));
  const [infoAnimSlide] = useState(new Animated.Value(50));

  // Add search modal state
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [regionResults, setRegionResults] = useState<Region[]>([]);
  const [cultureResults, setCultureResults] = useState<{regionName: string, culture: CultureItem}[]>([]);

  // Add this effect to trigger animations when tabs change
  useEffect(() => {
    if (activeTab === "culture") {
      // Reset animation values
      cultureAnimFade.setValue(0);
      cultureAnimSlide.setValue(50);
      
      // Start animations
      Animated.parallel([
        Animated.timing(cultureAnimFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cultureAnimSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (activeTab === "gallery") {
      // Reset animation values
      galleryAnimFade.setValue(0);
      galleryAnimSlide.setValue(50);
      
      // Start animations
      Animated.parallel([
        Animated.timing(galleryAnimFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(galleryAnimSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (activeTab === "info") {
      // Reset nilai animasi
      infoAnimFade.setValue(0);
      infoAnimSlide.setValue(50);
      
      // Mulai animasi
      Animated.parallel([
        Animated.timing(infoAnimFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(infoAnimSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeTab]);

  // Update isDesktop state when window size changes
  useEffect(() => {
    const updateLayout = () => {
      setIsDesktop(Dimensions.get('window').width >= 1024);
    };

    Dimensions.addEventListener('change', updateLayout);
    
    // Animation on initial load
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Staggered animations for cards
      ...entryAnimations.map((anim, i) => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: 200 + i * 100,
          useNativeDriver: true,
        })
      ),
      // Staggered animations for category cards
      ...categoryAnimations.map((anim, i) => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: 400 + i * 80,
          useNativeDriver: true,
        })
      )
    ]).start();
    
    return () => {
      // Clean up event listener when component unmounts
    };
  }, []);

  // Update the search function to populate categorized results
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredRegions(regions);
      setRegionResults([]);
      setCultureResults([]);
      setSearchModalVisible(false);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const query = text.toLowerCase();
    
    // Filter regions
    const regionsFound = regions.filter(region => {
      return region.name.toLowerCase().includes(query) || 
             region.description.toLowerCase().includes(query);
    });
    
    // Filter cultures
    const culturesFound: {regionName: string, culture: CultureItem}[] = [];
    regions.forEach(region => {
      region.culture.forEach(cultureItem => {
        if (cultureItem.name.toLowerCase().includes(query) || 
            cultureItem.description.toLowerCase().includes(query)) {
          culturesFound.push({
            regionName: region.name,
            culture: cultureItem
          });
        }
      });
    });
    
    setRegionResults(regionsFound);
    setCultureResults(culturesFound);
    setFilteredRegions(regionsFound.length > 0 ? regionsFound : regions);
    
    // Only show modal if we have results or there's a search query
    setSearchModalVisible(text.trim().length > 0);
  };
  
  // Function to close the search modal
  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  // Modify the getModalTopPadding function to position the modal completely below the search input
  const getModalTopPadding = () => {
    // Calculate a much larger padding to ensure modal appears below the input
    // Account for hero section height + search bar position
    return isDesktop ? 350 : 240;
  };

  if (selectedRegion) {
    return (
      <Layout>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedRegion(null)}
            >
              <View style={styles.backButtonContainer}>
                <Ionicons name="arrow-back-circle" size={38} color={Colors.primary} />
              </View>
            </TouchableOpacity>

            <Text style={styles.title}>{selectedRegion.name}</Text>
          </View>

          <View style={[styles.heroImageContainer, isDesktop && styles.heroImageContainerDesktop]}>
            {selectedRegion.id === "5" ? (
              <Image
                source={bontangImage}
                style={[styles.heroImage, isDesktop && styles.heroImageDesktop]}
                resizeMode="cover"
              />
            ) : (
            <Image
                source={selectedRegion.thumbnail}
              style={styles.heroImage}
                {...(isDesktop && {style: styles.heroImageDesktop})}
              resizeMode="cover"
            />
            )}
          </View>

          <View style={[styles.tabBar, isDesktop && styles.tabBarDesktop]}>
            <TouchableOpacity
              style={[
                styles.tab, 
                activeTab === "info" ? styles.activeTab : styles.inactiveTab,
                isDesktop && styles.tabDesktop
              ]}
              onPress={() => setActiveTab("info")}
            >
              <Text style={activeTab === "info" ? styles.activeTabText : styles.tabText}>Informasi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab, 
                activeTab === "culture" ? styles.activeTab : styles.inactiveTab,
                isDesktop && styles.tabDesktop
              ]}
              onPress={() => setActiveTab("culture")}
            >
              <Text style={activeTab === "culture" ? styles.activeTabText : styles.tabText}>Budaya</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab, 
                activeTab === "gallery" ? styles.activeTab : styles.inactiveTab,
                isDesktop && styles.tabDesktop
              ]}
              onPress={() => setActiveTab("gallery")}
            >
              <Text style={activeTab === "gallery" ? styles.activeTabText : styles.tabText}>Galeri</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "info" && (
            <Animated.View 
              style={[
                styles.tabContent, 
                isDesktop && styles.tabContentDesktop,
                { opacity: infoAnimFade, transform: [{ translateY: infoAnimSlide }] }
              ]}
            >
              <Animated.View 
                style={[
                  styles.cardContainer, 
                  isDesktop && styles.cardContainerDesktop,
                  { 
                    opacity: infoAnimFade,
                    transform: [{ 
                      translateY: infoAnimFade.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }]
                  }
                ]}
              >
                <Animated.Text 
                  style={[
                    styles.description, 
                    isDesktop && styles.descriptionDesktop,
                    { 
                      opacity: infoAnimFade,
                      transform: [{ 
                        translateY: infoAnimFade.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }]
                    }
                  ]}
                >
                  {selectedRegion.description}
                </Animated.Text>

                <Animated.View 
                  style={[
                    styles.infoContainer, 
                    isDesktop && styles.infoContainerDesktop,
                    { 
                      opacity: infoAnimFade,
                      transform: [{ 
                        translateY: infoAnimFade.interpolate({
                          inputRange: [0, 1],
                          outputRange: [25, 0]
                        })
                      }]
                    }
                  ]}
                >
                {/* Populasi */}
                  <Animated.View 
                    style={[
                      styles.infoRow, 
                      isDesktop && styles.infoRowDesktop,
                      { 
                        opacity: infoAnimFade,
                        transform: [{ 
                          translateX: infoAnimFade.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-30, 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Ionicons name="people" size={isDesktop ? 24 : 20} color={Colors.primary} />
                  <Text style={styles.infoLabel}>Populasi: </Text>
                  <Text style={styles.infoValue}>{selectedRegion.population}</Text>
                  </Animated.View>

                {/* Lokasi */}
                  <Animated.View 
                    style={[
                      styles.infoRow, 
                      isDesktop && styles.infoRowDesktop,
                      { 
                        opacity: infoAnimFade,
                        transform: [{ 
                          translateX: infoAnimFade.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Ionicons name="location-outline" size={isDesktop ? 24 : 20} color={Colors.primary} />
                  <Text style={styles.infoLabel}>Lokasi: </Text>
                  <Text style={styles.infoValue}>{selectedRegion.location}</Text>
                  </Animated.View>
                </Animated.View>

                {/* Fakta Menarik */}
                <Animated.View 
                  style={[
                    styles.factsSection, 
                    isDesktop && styles.factsSectionDesktop,
                    { 
                      opacity: infoAnimFade,
                      transform: [{ 
                        translateY: infoAnimFade.interpolate({
                          inputRange: [0, 1],
                          outputRange: [40, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <Animated.Text 
                    style={[
                      styles.factsTitle, 
                      isDesktop && styles.factsTitleDesktop,
                      { 
                        opacity: infoAnimFade,
                        transform: [{ 
                          scale: infoAnimFade.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1]
                          })
                        }]
                      }
                    ]}
                  >
                    Fakta Menarik:
                  </Animated.Text>
                  <View style={isDesktop && styles.factsGridDesktop}>
                  {selectedRegion.funFacts.map((fact, index) => (
                      <Animated.View 
                        key={index} 
                        style={[
                          styles.factItem, 
                          isDesktop && styles.factItemDesktop,
                          { 
                            opacity: infoAnimFade,
                            transform: [{ 
                              translateY: infoAnimFade.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30 + (index * 15), 0]
                              })
                            }]
                          }
                        ]}
                      >
                        <Text style={[styles.factText, isDesktop && styles.factTextDesktop]}>• {fact}</Text>
                      </Animated.View>
                  ))}
                </View>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          )}

          {activeTab === "culture" && (
            <Animated.View 
              style={[
                styles.tabContent, 
                isDesktop && styles.tabContentDesktop,
                { opacity: cultureAnimFade, transform: [{ translateY: cultureAnimSlide }] }
              ]}
            >
              <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
                Budaya {selectedRegion.name}
              </Text>
              
              <View style={isDesktop && styles.cultureGridDesktop}>
              {selectedRegion.culture.map((item, index) => (
                  <Animated.View 
                    key={index} 
                    style={[
                      styles.cultureItem,
                      isDesktop 
                        ? styles.cultureItemDesktop 
                        : (index % 2 === 0 ? styles.cultureItemImageLeft : styles.cultureItemImageRight),
                      { 
                        opacity: cultureAnimFade, 
                        transform: [{ 
                          translateY: cultureAnimFade.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30 + (index * 10), 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Image 
                      source={item.image} 
                      style={[styles.cultureImage, isDesktop && styles.cultureImageDesktop]} 
                      resizeMode="cover"
                    />
                    <View style={[styles.cultureTextContainer, isDesktop && styles.cultureTextContainerDesktop]}>
                      <Text style={[styles.cultureName, isDesktop && styles.cultureNameDesktop]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.cultureDescription, isDesktop && styles.cultureDescriptionDesktop]}>
                        {item.description}
                  </Text>
                </View>
                  </Animated.View>
              ))}
            </View>
            </Animated.View>
          )}

          {activeTab === "gallery" && (
            <Animated.View 
              style={[
                styles.tabContent, 
                isDesktop && styles.tabContentDesktop,
                { opacity: galleryAnimFade, transform: [{ translateY: galleryAnimSlide }] }
              ]}
            >
              <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
                Galeri Foto
              </Text>
              <View style={[
                styles.galleryContainer, 
                isDesktop && styles.galleryContainerDesktop
              ]}>
                {createGalleryColumns(selectedRegion.photos, isDesktop ? 4 : 2).map((column, columnIndex) => (
                  <View key={columnIndex} style={styles.galleryColumn}>
                    {column.map((photo, photoIndex) => (
                      <Animated.View
                        key={photoIndex}
                        style={{
                          opacity: galleryAnimFade,
                          transform: [{ 
                            translateY: galleryAnimFade.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30 + ((columnIndex + photoIndex) * 15), 0]
                            })
                          }]
                        }}
                      >
                        <HoverableComponent
                          style={[
                            styles.galleryImageWrapper,
                            hoveredGallery === (columnIndex * 100 + photoIndex) && styles.galleryImageHover
                          ]}
                          onPress={() => {}}
                          onHoverIn={() => setHoveredGallery(columnIndex * 100 + photoIndex)}
                          onHoverOut={() => setHoveredGallery(null)}
                        >
                          <Image
                            source={photo.url}
                            style={[
                              styles.galleryImage,
                              photo.type === 'landscape' && styles.galleryImageLandscape,
                              photo.type === 'portrait' && styles.galleryImagePortrait,
                              photo.type === 'square' && styles.galleryImageSquare,
                            ]}
                            resizeMode="cover"
                          />
                          {photo.caption && (
                            <View style={styles.captionOverlay}>
                              <Text style={styles.captionText}>{photo.caption}</Text>
                            </View>
                          )}
                        </HoverableComponent>
                      </Animated.View>
                    ))}
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </Layout>
    );
  }

  // Initial landing page view
  return (
    <Layout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ImageBackground
          source={getLocalImage(0)}
          style={[styles.heroBackground, isDesktop && styles.heroBackgroundDesktop]}
          imageStyle={{ opacity: 0.85 }}
        >
          <View style={styles.heroOverlay}>
            <Animated.View 
              style={[
                styles.heroContent,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <Text style={styles.heroTitle}>Temukan Keindahan</Text>
              <Text style={styles.heroSubtitle}>Jelajahi Kalimantan Timur</Text>
              <View style={styles.heroSearchContainer}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color={Colors.primary} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Cari daerah atau budaya..."
                    placeholderTextColor="#8a8a8a"
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity 
                      style={styles.clearSearchButton}
                      onPress={() => handleSearch('')}
                    >
                      <Ionicons name="close-circle" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* Search Results Modal */}
        {searchModalVisible && (
          <>
            {/* Dim overlay behind the modal */}
            <TouchableWithoutFeedback onPress={closeSearchModal}>
              <View style={styles.dimOverlay} />
            </TouchableWithoutFeedback>
            
            {/* Modal content */}
            <View 
              style={[
                styles.searchModalContainer,
                { top: getModalTopPadding() }
              ]}
            >
              <View style={styles.searchModalContent}>
                <View style={styles.searchModalHeader}>
                  <Text style={styles.searchResultsTitle}>Hasil Pencarian</Text>
                  <View style={styles.searchResultsActions}>
                    <Text style={styles.searchResultsCount}>
                      {regionResults.length + cultureResults.length} ditemukan
                    </Text>
                    <TouchableOpacity 
                      onPress={closeSearchModal}
                      style={styles.closeModalButton}
                    >
                      <Ionicons name="close" size={24} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView 
                  style={styles.searchResultsScroll}
                  showsVerticalScrollIndicator={true}
                >
                  {regionResults.length > 0 && (
                    <View style={styles.searchResultSection}>
                      <Text style={styles.searchResultSectionTitle}>DAERAH</Text>
                      
                      {regionResults.map(region => (
                        <TouchableOpacity 
                          key={region.id} 
                          style={styles.searchResultItem}
                          onPress={() => {
                            setSelectedRegion(region);
                            setSearchModalVisible(false);
                          }}
                        >
                          <Image 
                            source={region.thumbnail} 
                            style={styles.searchResultImage} 
                            resizeMode="cover" 
                          />
                          <View style={styles.searchResultTextContainer}>
                            <Text style={styles.searchResultName}>{region.name}</Text>
                            <Text style={styles.searchResultDescription}>
                              {region.location} • {region.culture.length} budaya
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {cultureResults.length > 0 && (
                    <View style={styles.searchResultSection}>
                      <Text style={styles.searchResultSectionTitle}>BUDAYA</Text>
                      
                      {cultureResults.map((item, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.searchResultItem}
                          onPress={() => {
                            // Find the region that has this culture
                            const regionWithCulture = regions.find(r => 
                              r.name === item.regionName
                            );
                            if (regionWithCulture) {
                              setSelectedRegion(regionWithCulture);
                              setActiveTab("culture");
                              setSearchModalVisible(false);
                            }
                          }}
                        >
                          <Image 
                            source={item.culture.image} 
                            style={styles.searchResultImage} 
                            resizeMode="cover" 
                          />
                          <View style={styles.searchResultTextContainer}>
                            <Text style={styles.searchResultName}>{item.culture.name}</Text>
                            <Text style={styles.searchResultDescription}>
                              {item.regionName} • Budaya
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {regionResults.length === 0 && cultureResults.length === 0 && (
                    <View style={styles.noResultsInModal}>
                      <Ionicons name="search-outline" size={60} color={`${Colors.primary}60`} />
                      <Text style={styles.noResultsText}>
                        Tidak ada hasil untuk "{searchQuery}"
                      </Text>
                    </View>
                  )}
                </ScrollView>
                
                <TouchableOpacity 
                  style={styles.viewAllSearchResults}
                  onPress={() => {
                    setSearchModalVisible(false);
                  }}
                >
                  <Text style={styles.viewAllSearchResultsText}>
                    Lihat Semua Hasil Pencarian
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Main Content */}
        <View style={[styles.mainContent, isDesktop && styles.mainContentDesktop]}>
          {/* Search Results Section */}
          {isSearching && (
            <View style={styles.searchResultsSection}>
              <Text style={styles.sectionHeaderTitle}>
                Hasil Pencarian {filteredRegions.length > 0 ? `(${filteredRegions.length})` : ''}
              </Text>
              
              {filteredRegions.length > 0 ? (
                <View style={isDesktop ? styles.regionsGridDesktop : styles.regionsContainer}>
                  {filteredRegions.map((region, index) => (
                    <Animated.View 
                      key={region.id}
                      style={[
                        isDesktop ? styles.regionCardDesktop : styles.regionCard,
                        // Remove right margin for every third item (end of row) in desktop
                        isDesktop && (index + 1) % 3 === 0 ? { marginRight: 0 } : null,
                        hoveredRegion === region.id && styles.regionCardHover,
                      ]}
                    >
                      <HoverableComponent 
                        style={styles.cardTouchable}
                        onPress={() => setSelectedRegion(region)}
                        onHoverIn={() => setHoveredRegion(region.id)}
                        onHoverOut={() => setHoveredRegion(null)}
                      >
                        <View style={{width: '100%', height: '100%', backgroundColor: '#555'}}>
                          {region.id === "5" ? (
                            <Image 
                              source={bontangImage}
                              style={{width: '100%', height: '100%'}}
                              resizeMode="cover"
                            />
                          ) : (
                            <Image 
                              source={region.thumbnail} 
                              style={{width: '100%', height: '100%'}} 
                              resizeMode="cover" 
                            />
                          )}
                        </View>
                        <View style={isDesktop ? styles.regionOverlayDesktop : styles.regionOverlay}>
                          <Text style={isDesktop ? styles.regionNameDesktop : styles.regionName}>
                            {region.name}
                          </Text>
                          <View style={styles.exploreButton}>
                            <Text style={styles.exploreButtonText}>Jelajahi</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.textDark} />
                          </View>
                        </View>
                      </HoverableComponent>
                    </Animated.View>
                  ))}
                </View>
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={60} color={`${Colors.primary}60`} />
                  <Text style={styles.noResultsText}>
                    Tidak ada hasil untuk "{searchQuery}"
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Only show these sections if not searching or if there are search results */}
          {(!isSearching || filteredRegions.length > 0) && (
            <>
              {/* Featured Section */}
              <View style={styles.featuredSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderTitle}>Daerah Unggulan</Text>
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>Lihat Semua</Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScrollContent}
                >
                  {regions.map((region, index) => (
                    <Animated.View 
                      key={region.id}
                      ref={(el) => {
                        if (el) featuredRefs.current[index] = el;
                      }}
                      style={[
                        styles.featuredCard,
                        hoveredFeatured === region.id && styles.featuredCardHover,
                        {
                          opacity: entryAnimations[index],
                          transform: [
                            { scale: entryAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1]
                            })},
                            { translateY: entryAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0]
                            })}
                          ]
                        }
                      ]}
                    >
                      <HoverableComponent 
                        style={styles.cardTouchable}
                        onPress={() => setSelectedRegion(region)}
                        onHoverIn={() => setHoveredFeatured(region.id)}
                        onHoverOut={() => setHoveredFeatured(null)}
                      >
                        {region.id === "5" ? (
                          <Image 
                            source={bontangImage}
                            style={{width: '100%', height: 150}}
                            resizeMode="cover"
                          />
                        ) : (
                          <Image 
                            source={region.thumbnail} 
                            style={styles.featuredImage}
                          />
                        )}
                        <View style={styles.featuredContent}>
                          <Text style={styles.featuredTitle}>{region.name}</Text>
                          <View style={styles.featuredMeta}>
                            <View style={styles.metaItem}>
                              <Ionicons name="location-outline" size={14} color={Colors.primary} />
                              <Text style={styles.metaText}>Kalimantan Timur</Text>
                            </View>
                            <View style={styles.metaItem}>
                              <MaterialIcons name="category" size={14} color={Colors.primary} />
                              <Text style={styles.metaText}>{region.culture.length} Budaya</Text>
                            </View>
                          </View>
                        </View>
                      </HoverableComponent>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>

              {/* Categories Section */}
              <View style={styles.categoriesSection}>
                <Text style={styles.categoriesSectionTitle}>Jelajahi Berdasarkan Kategori</Text>
                <View style={[styles.categoriesGrid, isDesktop && styles.categoriesGridDesktop]}>
                  {['Tarian', 'Musik', 'Kerajinan', 'Kuliner', 'Festival', 'Arsitektur'].map((category, index) => (
                    <Animated.View 
                      key={index}
                      ref={(el) => {
                        if (el) categoryRefs.current[index] = el;
                      }}
                      style={[
                        styles.categoryCard, 
                        isDesktop && styles.categoryCardDesktop,
                        index % 2 === 0 && { backgroundColor: `${Colors.primary}20` },
                        hoveredCategory === index && styles.categoryCardHover,
                        {
                          opacity: categoryAnimations[index],
                          transform: [
                            { scale: categoryAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1]
                            })},
                            { translateY: categoryAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, 0]
                            })}
                          ]
                        }
                      ]}
                    >
                      <HoverableComponent 
                        style={styles.cardTouchable}
                        onPress={() => {}}
                        onHoverIn={() => setHoveredCategory(index)}
                        onHoverOut={() => setHoveredCategory(null)}
                      >
                        <View style={{alignItems: 'center', width: '100%'}}>
                          <View style={styles.categoryIcon}>
                            <Ionicons 
                              name={getCategoryIcon(category)} 
                              size={28} 
                              color={Colors.primary} 
                            />
                          </View>
                          <Text style={styles.categoryText}>{category}</Text>
                        </View>
                      </HoverableComponent>
                    </Animated.View>
                  ))}
                </View>
              </View>

              {/* All Regions Section - only show if not searching */}
              {!isSearching && (
                <View style={styles.allRegionsSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderTitle}>Semua Daerah</Text>
                  </View>
                  
                  {isDesktop ? (
                    <View style={styles.regionsGridDesktop}>
                      {regions.map((region, index) => (
                        <Animated.View 
                          key={region.id} 
                          ref={(el) => {
                            if (el) regionRefs.current[index] = el;
                          }}
                          style={[
                            styles.regionCardDesktop,
                            // Remove right margin for every third item (end of row)
                            (index + 1) % 3 === 0 ? { marginRight: 0 } : null,
                            hoveredRegion === region.id && styles.regionCardHover,
                            {
                              opacity: entryAnimations[index],
                              transform: [
                                { scale: entryAnimations[index].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1]
                                })},
                                { translateY: entryAnimations[index].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [100, 0]
                                })}
                              ]
                            }
                          ]}
                        >
                          <HoverableComponent 
                            style={styles.cardTouchable}
                            onPress={() => setSelectedRegion(region)}
                            onHoverIn={() => setHoveredRegion(region.id)}
                            onHoverOut={() => setHoveredRegion(null)}
                          >
                            <View style={{width: '100%', height: '100%', backgroundColor: '#555'}}>
                              {region.id === "5" ? (
                                <Image 
                                  source={bontangImage}
                                  style={{width: '100%', height: '100%'}}
                                  resizeMode="cover"
                                />
                              ) : (
                                <Image 
                                  source={region.thumbnail} 
                                  style={{width: '100%', height: '100%'}} 
                                  resizeMode="cover" 
                                />
                              )}
                            </View>
                            <View style={styles.regionOverlayDesktop}>
                              <Text style={styles.regionNameDesktop}>{region.name}</Text>
                              <View style={styles.exploreButton}>
                                <Text style={styles.exploreButtonText}>Jelajahi</Text>
                                <Ionicons name="arrow-forward" size={14} color={Colors.textDark} />
                              </View>
                            </View>
                          </HoverableComponent>
                        </Animated.View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.regionsContainer}>
                      {regions.map((region, index) => (
                        <Animated.View 
                          key={region.id}
                          ref={(el) => {
                            if (el) regionRefs.current[index] = el;
                          }}
                          style={[
                            styles.regionCard,
                            hoveredRegion === region.id && styles.regionCardHover,
                            {
                              opacity: entryAnimations[index],
                              transform: [
                                { scale: entryAnimations[index].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1]
                                })},
                                { translateY: entryAnimations[index].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [50, 0]
                                })}
                              ]
                            }
                          ]}
                        >
                          <HoverableComponent 
                            style={styles.cardTouchable}
                            onPress={() => setSelectedRegion(region)}
                            onHoverIn={() => setHoveredRegion(region.id)}
                            onHoverOut={() => setHoveredRegion(null)}
                          >
                            {region.id === "5" ? (
                              <Image 
                                source={bontangImage}
                                style={[styles.regionImage]}
                                resizeMode="cover"
                              />
                            ) : (
                              <Image 
                                source={region.thumbnail} 
                                style={[styles.regionImage, {backgroundColor: '#555'}]} 
                                resizeMode="cover" 
                              />
                            )}
                            <View style={styles.regionOverlay}>
                              <Text style={styles.regionName}>{region.name}</Text>
                              <View style={styles.exploreButton}>
                                <Text style={styles.exploreButtonText}>Jelajahi</Text>
                                <Ionicons name="arrow-forward" size={14} color={Colors.textDark} />
                              </View>
                            </View>
                          </HoverableComponent>
                        </Animated.View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}

// Helper function to get category icon
const getCategoryIcon = (category: string): any => {
  switch (category) {
    case 'Tarian':
      return 'body-outline';
    case 'Musik':
      return 'musical-notes-outline';
    case 'Kerajinan':
      return 'color-palette-outline';
    case 'Kuliner':
      return 'restaurant-outline';
    case 'Festival':
      return 'calendar-outline';
    case 'Arsitektur':
      return 'business-outline';
    default:
      return 'globe-outline';
  }
};

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

const styles = StyleSheet.create({
  // Basic styles
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: -50,
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
  backButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },

  // Hero section
  heroBackground: {
    height: 300,
    width: '100%',
  },
  heroBackgroundDesktop: {
    height: 500,
  },
  heroImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroImageContainerDesktop: {
    marginBottom: 30,
  },
  heroImage: {
    width: 600,
    height: 250,
    borderRadius: 15,
  },
  heroImageDesktop: {
    width: '90%',
    height: 400,
    borderRadius: 20,
    maxWidth: 1200,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroSearchContainer: {
    width: '90%',
    maxWidth: 500,
  },
  
  // Tab styles
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBarDesktop: {
    width: '80%',
    maxWidth: 1000,
    alignSelf: 'center',
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: Colors.background,
  },
  tabDesktop: {
    paddingVertical: 16,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    borderBottomWidth: 4,
    borderBottomColor: Colors.lightText,
  },
  inactiveTab: {
    backgroundColor: Colors.lightBackground,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  activeTabText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: "bold",
  },
  
  // Content area
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  tabContentDesktop: {
    paddingHorizontal: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  cardContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: Colors.background,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 8,
  },
  cardContainerDesktop: {
    padding: 40,
    borderRadius: 20,
    marginBottom: 30,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'justify',
    letterSpacing: 0.3,
    fontWeight: '400',
  },
  descriptionDesktop: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 30,
  },
  
  // Info section
  infoContainer: {
    width: '100%',
  },
  infoContainerDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: Colors.lightBackground,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoRowDesktop: {
    width: '48%',
    padding: 20,
  },
  infoLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  
  // Facts section
  factsSection: {
    marginTop: 24,
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  factsSectionDesktop: {
    padding: 30,
    borderRadius: 20,
  },
  factsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  factsTitleDesktop: {
    fontSize: 24,
    marginBottom: 24,
  },
  factsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  factItem: {
    marginBottom: 12,
    backgroundColor: Colors.buttonBackground,
    padding: 16,
    borderRadius: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  factItemDesktop: {
    width: '48%',
    marginBottom: 16,
    padding: 20,
  },
  factText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    letterSpacing: 0.2,
  },
  factTextDesktop: {
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Section headers
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  sectionTitleDesktop: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  
  // Culture section
  cultureGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cultureItem: {
    marginBottom: 20,
    padding: 0,
    backgroundColor: Colors.buttonBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cultureItemDesktop: {
    width: '48%',
    marginBottom: 30,
    flexDirection: 'column',
    borderRadius: 16,
    height: 'auto',
  },
  cultureItemImageLeft: {
    flexDirection: 'row',
  },
  cultureItemImageRight: {
    flexDirection: 'row-reverse',
  },
  cultureImage: {
    width: 160,
    height: 160,
    borderRadius: 0,
  },
  cultureImageDesktop: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cultureTextContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  cultureTextContainerDesktop: {
    padding: 24,
  },
  cultureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cultureNameDesktop: {
    fontSize: 22,
    marginBottom: 12,
  },
  cultureDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  cultureDescriptionDesktop: {
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Gallery section
  galleryContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  galleryContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryColumn: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 4,
  },
  galleryImageWrapper: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    borderRadius: 12,
  },
  galleryImageDesktop: {
    width: '31%',
    height: 250,
    marginHorizontal: 0,
    marginBottom: 30,
  },
  galleryImageLandscape: {
    aspectRatio: 1.5,
  },
  galleryImagePortrait: {
    aspectRatio: 0.7,
  },
  galleryImageSquare: {
    aspectRatio: 1,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    paddingBottom: 10,
  },
  captionText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Landing page layout
  headerSection: {
    marginBottom: 24,
  },
  headerSectionDesktop: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  mainTitleDesktop: {
    fontSize: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 16,
  },
  subtitleDesktop: {
    fontSize: 18,
    maxWidth: 600,
    textAlign: 'center',
    marginBottom: 24,
  },
  mainContent: {
    padding: 20,
  },
  mainContentDesktop: {
    padding: 40,
    paddingRight: 60,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Featured section
  featuredSection: {
    marginBottom: 30,
  },
  featuredScrollContent: {
    paddingBottom: 20, // Increase padding to handle larger cards
    paddingRight: 20,
    overflow: 'visible',
    paddingTop: 10, // Add top padding for hover space
  },
  featuredCard: {
    width: 280,
    backgroundColor: Colors.buttonBackground,
    borderRadius: 12,
    overflow: 'visible',
    marginRight: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 150,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  
  // Categories section
  categoriesSection: {
    marginBottom: 30,
  },
  categoriesSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -5,
    padding: 10, // Add padding for hover space
    overflow: 'visible',
  },
  categoriesGridDesktop: {
    justifyContent: 'center',
    marginHorizontal: -10,
  },
  categoryCard: {
    width: '40%',
    backgroundColor: `${Colors.secondary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'visible',
    justifyContent: 'center',
  },
  categoryCardDesktop: {
    width: '25%',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  
  // All regions section
  allRegionsSection: {
    marginBottom: 30,
  },
  regionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 32,
    overflow: 'visible',
    padding: 10, // Add padding for hover space
  },
  regionsContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 1400,
    alignSelf: 'center',
  },
  regionsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 0,
    margin: 0,
    marginTop: 16,
    marginRight: -24,
    overflow: 'visible',
  },
  regionCard: {
    height: 200,
    width: 300,
    borderRadius: 12,
    overflow: 'visible',
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 8,
  },
  regionCardDesktop: {
    width: '30%',
    marginBottom: 24,
    marginRight: 24,
    borderRadius: 16,
    overflow: 'visible',
    position: 'relative',
    height: 280,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: Colors.background,
  },
  regionImage: {
    width: "100%",
    height: "100%",
  },
  regionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  regionOverlayDesktop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '50%',
    justifyContent: 'flex-end',
  },
  regionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 4,
  },
  regionNameDesktop: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 8,
  },
  
  // Action buttons
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    paddingHorizontal: 20,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'solid',
  },
  searchInput: {
    flex: 1,
    color: '#000',
    marginLeft: 10,
    fontSize: 15,
    height: 40,
    fontWeight: '500',
  },
  clearSearchButton: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  searchResultsSection: {
    marginBottom: 30,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: `${Colors.background}90`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.border}60`,
    marginVertical: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.lightText,
    marginTop: 16,
    textAlign: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 30,
    marginTop: 4,
  },
  exploreButtonText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },

  // Add hover styles to StyleSheet
  cardTouchable: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        transitionProperty: 'transform, box-shadow',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-in-out',
      },
    }),
  },
  
  // Featured card hover effects
  featuredCardHover: Platform.OS === 'web' ? {
    transform: [{ translateY: -8 }, { scale: 1.03 }],
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  } : {},
  
  // Category card hover effects
  categoryCardHover: Platform.OS === 'web' ? {
    transform: [{ translateY: -5 }, { scale: 1.05 }],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  } : {},
  
  // Region card hover effects
  regionCardHover: Platform.OS === 'web' ? {
    transform: [{ translateY: -8 }, { scale: 1.03 }],
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  } : {},
  
  // Gallery image hover effects
  galleryImageHover: Platform.OS === 'web' ? {
    transform: [{ scale: 1.05 }],
    opacity: 0.9,
  } : {},

  // Search modal styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchModalContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    maxHeight: '60%',
    zIndex: 1000,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  searchModalContent: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  searchResultsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultsCount: {
    fontSize: 14,
    color: Colors.lightText,
    marginRight: 10,
  },
  closeModalButton: {
    padding: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultsScroll: {
    maxHeight: 350,
  },
  searchResultSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchResultSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.lightText,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  searchResultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  searchResultDescription: {
    fontSize: 14,
    color: Colors.lightText,
  },
  noResultsInModal: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  viewAllSearchResults: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  viewAllSearchResultsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
});
