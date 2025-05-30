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
  AppState,
  AppStateStatus,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useIsFocused, useFocusEffect, useNavigation } from '@react-navigation/native';
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

// Define Culinary item type
interface CulinaryItem {
  name: string;
  image: any;
  description: string;
  origin?: string;
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
  culinary: CulinaryItem[]; // Add culinary array
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
const penajamPaserUtaraImage = require('../../assets/img-penajampaserutara/penajampaserutarahero.jpeg');
const kutaiKartanegaraImage = require('../../assets/img-kutaikartanegara/Kutai-Kartanagarahero.jpeg');
const mahakamHuluImage = require('../../assets/img-mahakamhulu/mahakamuluhero.jpeg');
const kutaiBaratImage = require('../../assets/img-kutaibarat/kutaibarathero.jpeg');
const defaultHeroImage = require('../../assets/img-berau/derawan.jpeg');

// Function to get local image based on index (to reuse available images)
const getLocalImage = (index: number): any => {
  const images = [
    defaultHeroImage, 
    require('../../assets/img-berau/derawan.jpeg'), 
    require('../../assets/img-samarinda/tepianmahakam.jpeg'), 
    require('../../assets/img-kutaikartanegara/pulaukumala.jpeg'), 
    require('../../assets/img-kutaikartanegara/KedatonKutaiKartanegara.jpeg'),
  ];
  return images[index % images.length];
};

// Function to get local image based on region id
const getRegionThumbnail = (id: string): any => {
  switch(id) {
    case "1": return penajamPaserUtaraImage;
    case "2": return kutaiKartanegaraImage;
    case "3": return mahakamHuluImage;
    case "4": return kutaiBaratImage;
    default: return defaultHeroImage;
  }
};

// Mock data for regions
const regions: Region[] = [
  {
    id: "1",
    name: "Penajam Paser Utara",
    thumbnail: penajamPaserUtaraImage,
    description:
      "Penajam Paser Utara adalah kabupaten di Kalimantan Timur yang terletak di Teluk Balikpapan. Kabupaten ini memiliki luas wilayah sekitar 3.333 km² dengan berbagai kekayaan alam termasuk hutan, minyak, dan gas.",
    population: "175.439 jiwa (2020)",
    location: "Terletak di Teluk Balikpapan, Kalimantan Timur",
    culture: [
      {
        name: "Upacara Adat Belian",
        image: require('../../assets/img-penajampaserutara/upacaraadatbelian.jpeg'),
        description: "Upacara adat penyembuhan yang dilakukan oleh suku Paser. Ritual ini dipimpin oleh seorang dukun atau Belian yang memiliki kemampuan berkomunikasi dengan roh leluhur."
      },
      {
        name: "Tari Ronggeng Paser",
        image: require('../../assets/img-penajampaserutara/TariRonggengPaser.jpeg'),
        description: "Tarian tradisional yang menggambarkan kegembiraan masyarakat Paser. Ditarikan dengan gerakan yang energik diiringi musik tradisional."
      },
      {
        name: "Musik Tingkilan",
        image: require('../../assets/img-penajampaserutara/musiktingkilan.jpeg'),
        description: "Musik tradisional dari Kalimantan Timur yang dimainkan dengan alat musik petik bernama gambus dan kendang. Sering digunakan untuk mengiringi tarian dan upacara adat."
      },
      {
        name: "Kerajinan Anyaman Rotan",
        image: require('../../assets/img-penajampaserutara/kerajinananyamanrotan.jpeg'),
        description: "Kerajinan tangan khas Kalimantan yang terbuat dari rotan. Digunakan untuk membuat berbagai peralatan rumah tangga dan hiasan dengan teknik menganyam yang telah diwariskan turun-temurun."
      },
    ],
    culinary: [],
    photos: [
      {
        url: require('../../assets/img-penajampaserutara/air-terjun-tembinus.webp'),
        type: "landscape",
        caption: "Air Terjun Tembinus"
      },
      {
        url: require('../../assets/img-penajampaserutara/goa-besiang.webp'),
        type: "square",
        caption: "Goa Besiang"
      },
      {
        url: require('../../assets/img-penajampaserutara/pulau-gusung.webp'),
        type: "portrait",
        caption: "Pulau Gusung"
      },
      {
        url: require('../../assets/img-penajampaserutara/upacaraadatbelian.jpeg'),
        type: "landscape",
        caption: "Upacara Adat Belian"
      },
      {
        url: require('../../assets/img-penajampaserutara/TariRonggengPaser.jpeg'),
        type: "square",
        caption: "Tari Ronggeng Paser"
      },
      {
        url: require('../../assets/img-penajampaserutara/musiktingkilan.jpeg'),
        type: "portrait",
        caption: "Musik Tingkilan"
      },
      {
        url: require('../../assets/img-penajampaserutara/kerajinananyamanrotan.jpeg'),
        type: "landscape",
        caption: "Kerajinan Anyaman Rotan"
      },
      {
        url: require('../../assets/img-penajampaserutara/penajampaserutarahero.jpeg'),
        type: "square",
        caption: "Penajam Paser Utara"
      },
      {
        url: require('../../assets/img-berau/derawan.jpeg'),
        type: "portrait",
        caption: "Batu Dinding"
      },
      {
        url: require('../../assets/img-berau/pulaumaratua.jpeg'),
        type: "portrait",
        caption: "Pesut Mahakam"
      },
      {
        url: require('../../assets/img-berau/derawan.jpeg'),
        type: "portrait",
        caption: "Pulau Derawan"
      },
      {
        url: require('../../assets/img-berau/pulaumaratua.jpeg'),
        type: "portrait",
        caption: "Pulau Maratua"
      },
    ],
    funFacts: [
      "Penajam Paser Utara akan menjadi lokasi Ibu Kota Negara (IKN) baru Indonesia",
      "Kabupaten ini terbentuk pada tahun 2002 dari pemekaran Kabupaten Pasir",
      "Memiliki potensi wisata bahari yang besar dengan pantai-pantai yang masih alami",
    ],
  },
  {
    id: "2",
    name: "Kutai Kartanegara",
    thumbnail: kutaiKartanegaraImage,
    description:
      "Kutai Kartanegara adalah kabupaten terluas di Kalimantan Timur dan merupakan wilayah bekas Kesultanan Kutai yang kaya akan sejarah dan budaya.",
    population: "725.293 jiwa (2020)",
    location: "Terletak di sekitar Sungai Mahakam",
    culture: [
      {
        name: "Upacara Belimbur",
        image: require('../../assets/img-kutaikartanegara/upacarabelimbur.jpeg'),
        description: "Ritual mandi bersama di Sungai Mahakam sebagai simbol pembersihan diri dari hal-hal negatif."
      },
      {
        name: "Festival Erau",
        image: require('../../assets/img-kutaikartanegara/festivalerau.jpeg'),
        description: "Upacara adat tahunan Kesultanan Kutai Kartanegara untuk memperingati penobatan raja atau sultan."
      }
    ],
    culinary: [],
    photos: [
      {
        url: require('../../assets/img-kutaikartanegara/museummulawarman.jpeg'),
        type: "square",
        caption: "Museum Mulawarman"
      },
      {
        url: require('../../assets/img-kutaikartanegara/KedatonKutaiKartanegara.jpeg'),
        type: "landscape",
        caption: "Kedaton Kutai Kartanegara"
      },
      {
        url: require('../../assets/img-kutaikartanegara/festivalerau.jpeg'),
        type: "portrait",
        caption: "Festival Erau"
      },
      {
        url: require('../../assets/img-kutaikartanegara/upacarabelimbur.jpeg'),
        type: "landscape",
        caption: "Upacara Belimbur"
      },
      {
        url: require('../../assets/img-kutaikartanegara/pulaukumala.jpeg'),
        type: "square",
        caption: "Pulau Kumala"
      },
      {
        url: require('../../assets/img-kutaikartanegara/Kutai-Kartanagarahero.jpeg'),
        type: "portrait",
        caption: "Kutai Kartanegara"
      }
    ],
    funFacts: [
      "Kutai Kartanegara adalah kerajaan tertua di Indonesia, berdiri sejak abad ke-4 Masehi",
      "Festival Erau yang terkenal diadakan di Tenggarong, ibukota Kutai Kartanegara",
      "Museum Mulawarman menyimpan koleksi benda-benda bersejarah dari Kesultanan Kutai"
    ],
  },
  {
    id: "3",
    name: "Mahakam Hulu",
    thumbnail: mahakamHuluImage,
    description:
      "Mahakam Hulu adalah kabupaten di Kalimantan Timur yang kaya akan sumber daya alam dan budaya tradisional. Wilayah ini memiliki hutan yang luas dan masyarakat dengan tradisi yang masih terjaga.",
    population: "120.356 jiwa (2020)",
    location: "Terletak di bagian barat Kalimantan Timur",
    culture: [
      {
        name: "Upacara Adat Kwangkay",
        image: require('../../assets/img-mahakamhulu/upacaraadatkwangkay.jpeg'),
        description: "Upacara pemindahan tulang-belulang leluhur yang sudah dikuburkan ke tempat yang baru, sebagai bentuk penghormatan kepada leluhur."
      },
      {
        name: "Tari Hudoq",
        image: require('../../assets/img-mahakamhulu/Tari Hudoq.jpeg'),
        description: "Tarian sakral yang mengenakan topeng berbentuk binatang untuk mengusir roh jahat dan menyambut musim panen."
      }
    ],
    culinary: [],
    photos: [
      {
        url: require('../../assets/img-mahakamhulu/hutantropismahakamhulu.jpeg'),
        type: "landscape",
        caption: "Hutan Tropis Mahakam Hulu"
      },
      {
        url: require('../../assets/img-mahakamhulu/upacaraadattradisional.jpeg'),
        type: "square",
        caption: "Upacara Adat Tradisional"
      },
      {
        url: require('../../assets/img-mahakamhulu/mahakamuluhero.jpeg'),
        type: "portrait",
        caption: "Budaya Dayak Mahakam Hulu"
      },
      {
        url: require('../../assets/img-mahakamhulu/upacaraadatkwangkay.jpeg'),
        type: "landscape",
        caption: "Upacara Adat Kwangkay"
      },
      {
        url: require('../../assets/img-mahakamhulu/Tari Hudoq.jpeg'),
        type: "square",
        caption: "Tari Hudoq"
      }
    ],
    funFacts: [
      "Mahakam Hulu memiliki keanekaragaman hayati yang tinggi dengan banyak spesies endemik",
      "Masyarakat di Mahakam Hulu masih memegang teguh adat istiadat dan tradisi leluhur",
      "Wilayah ini memiliki banyak sungai yang menjadi urat nadi transportasi masyarakat"
    ],
  },
  {
    id: "4",
    name: "Kutai Barat",
    thumbnail: kutaiBaratImage,
    description:
      "Kutai Barat adalah kabupaten di Kalimantan Timur yang kaya akan budaya Dayak dan sumber daya alam. Wilayah ini masih memiliki hutan yang luas dan keanekaragaman hayati yang tinggi.",
    population: "153.837 jiwa (2020)",
    location: "Terletak di bagian barat Kalimantan Timur",
    culture: [
      {
        name: "Upacara Adat Belian Bawo",
        image: require('../../assets/img-kutaibarat/UpacaraAdatBelianBawo.jpeg'),
        description: "Ritual penyembuhan yang dilakukan oleh suku Dayak Benuaq, dipimpin oleh seorang dukun atau Belian."
      },
      {
        name: "Tari Ngerangkau",
        image: require('../../assets/img-kutaibarat/TariNgerangkau.jpeg'),
        description: "Tarian yang menggambarkan perburuan kepala pada masa lampau, kini dipertunjukkan sebagai pelestarian budaya."
      }
    ],
    culinary: [],
    photos: [
      {
        url: require('../../assets/img-kutaibarat/PegununganMeratus.jpeg'),
        type: "landscape",
        caption: "Pegunungan Meratus"
      },
      {
        url: require('../../assets/img-kutaibarat/kutaibarathero.jpeg'),
        type: "portrait",
        caption: "Pemandangan Kutai Barat"
      },
      {
        url: require('../../assets/img-kutaibarat/HutanLindungKutaiBarat.jpeg'),
        type: "square",
        caption: "Hutan Lindung Kutai Barat"
      },
      {
        url: require('../../assets/img-kutaibarat/UpacaraAdatBelianBawo.jpeg'),
        type: "landscape",
        caption: "Upacara Adat Belian Bawo"
      },
      {
        url: require('../../assets/img-kutaibarat/TariNgerangkau.jpeg'),
        type: "square",
        caption: "Tari Ngerangkau"
      },
      {
        url: require('../../assets/img-kutaibarat/kutaibarathero.jpeg'),
        type: "portrait",
        caption: "Danau di Kutai Barat"
      },
    ],
    funFacts: [
      "Kutai Barat memiliki rumah adat Lamin yang bisa dihuni hingga 30 keluarga",
      "Daerah ini memiliki tradisi seni ukir dan anyaman yang sangat detail dan bernilai tinggi",
      "Masyarakat Dayak di Kutai Barat memiliki pengetahuan herbal tradisional yang luas"
    ],
  },
  {
    id: "5",
    name: "Balikpapan",
    thumbnail: require('../../assets/img-baikpapan/balikpapanhero.jpg'),
    description:
      "Balikpapan adalah kota terbesar kedua di Kalimantan Timur dan menjadi pusat ekonomi utama. Dikenal sebagai kota minyak, Balikpapan juga memiliki pantai-pantai indah dan infrastruktur modern.",
    population: "688.318 jiwa (2020)",
    location: "Terletak di Teluk Balikpapan, pantai timur Kalimantan",
    culture: [
      {
        name: "Festival Adat Mappanre Laut",
        image: require('../../assets/img-baikpapan/taripesisirpantai.jpeg'),
        description: "Upacara syukuran nelayan atas hasil tangkapan laut yang dilakukan oleh masyarakat pesisir Balikpapan."
      },
      {
        name: "Tari Pesisir Pantai",
        image: require('../../assets/img-baikpapan/taripesisirpantai.jpeg'),
        description: "Tarian yang menggambarkan kehidupan masyarakat pesisir pantai Balikpapan dengan gerakan lembut menyerupai ombak."
      }
    ],
    culinary: [
      {
        name: "Kepiting Soka Balikpapan",
        image: require('../../assets/img-baikpapan/Kepitingsoka.jpeg'),
        description: "Kepiting soka yang dimasak dengan bumbu khas Balikpapan, biasanya digoreng dengan tepung atau diolah dengan saus padang.",
        origin: "Makanan laut khas pesisir Balikpapan"
      },
      {
        name: "Pisang Gapit",
        image: require('../../assets/img-baikpapan/pisanggapit.jpeg'),
        description: "Pisang yang dipotong tipis, dijepit dengan bambu, kemudian dibakar dan disajikan dengan saus gula merah dan kelapa parut.",
        origin: "Jajanan tradisional dari Balikpapan"
      },
      {
        name: "Nasi Bekepor Balikpapan",
        image: require('../../assets/img-baikpapan/nasibekeporbalikpapan.jpeg'),
        description: "Nasi yang dimasak dengan santan dan rempah khas Balikpapan, disajikan dengan lauk seperti ikan bakar atau ayam bumbu merah.",
        origin: "Adaptasi dari makanan tradisional Paser yang populer di Balikpapan"
      }
    ],
    photos: [
      {
        url: require('../../assets/img-baikpapan/balikpapanhero.jpg'),
        type: "landscape",
        caption: "Pemandangan Kota Balikpapan"
      },
      {
        url: require('../../assets/img-baikpapan/mangrove-hutanmargasatwa.jpeg'),
        type: "portrait",
        caption: "Hutan Mangrove Margasatwa"
      },
      {
        url: require('../../assets/img-baikpapan/monumenperjuanganrakyat.jpeg'),
        type: "square",
        caption: "Monumen Perjuangan Rakyat"
      },
      {
        url: require('../../assets/img-baikpapan/penangkaranberuangmadu.jpeg'),
        type: "landscape",
        caption: "Penangkaran Beruang Madu"
      }
    ],
    funFacts: [
      "Balikpapan sering disebut sebagai 'Kota Minyak' karena sejarahnya sebagai pusat industri perminyakan",
      "Kota ini memiliki slogan 'Balikpapan Beriman' (Bersih, Indah, Aman, dan Nyaman)",
      "Balikpapan memiliki bandara internasional terbesar di Kalimantan Timur"
    ],
  },
  {
    id: "6",
    name: "Samarinda",
    thumbnail: require('../../assets/img-samarinda/samarindahero.jpeg'),
    description:
      "Samarinda adalah ibu kota provinsi Kalimantan Timur yang terletak di tepi Sungai Mahakam. Kota ini merupakan pusat pemerintahan, pendidikan, dan budaya di Kalimantan Timur.",
    population: "827.994 jiwa (2020)",
    location: "Terletak di tepi Sungai Mahakam, Kalimantan Timur",
    culture: [
      {
        name: "Upacara Adat Tepung Tawar",
        image: require('../../assets/img-samarinda/upacara adattepungtawar.jpeg'),
        description: "Ritual pemberkatan yang menggunakan tepung beras yang dilarutkan dalam air sebagai simbol pembersihan diri."
      },
      {
        name: "Tari Kancet Ledo",
        image: require('../../assets/img-samarinda/tarikancet.jpeg'),
        description: "Tarian tradisional suku Dayak yang merupakan tarian persembahan dalam upacara penyambutan tamu kehormatan."
      }
    ],
    culinary: [
      {
        name: "Nasi Bekepor Samarinda",
        image: require('../../assets/img-samarinda/masinbekeporsamarinda.jpeg'),
        description: "Nasi yang dimasak dengan santan, serai, dan daun pandan, kemudian dibungkus dengan daun pisang dan dibakar. Disajikan dengan berbagai lauk pauk.",
        origin: "Makanan tradisional yang populer di Samarinda"
      }
    ],
    photos: [
      {
        url: require('../../assets/img-samarinda/samarindahero.jpeg'),
        type: "landscape",
        caption: "Kota Samarinda"
      },
      {
        url: require('../../assets/img-samarinda/jembatanmahakam.jpeg'),
        type: "square",
        caption: "Jembatan Mahakam"
      },
      {
        url: require('../../assets/img-samarinda/tepianmahakam.jpeg'),
        type: "portrait",
        caption: "Tepian Mahakam"
      },
      {
        url: require('../../assets/img-samarinda/masinbekeporsamarinda.jpeg'),
        type: "landscape",
        caption: "Kuliner Samarinda"
      },
      {
        url: require('../../assets/img-samarinda/tarikancet.jpeg'),
        type: "square",
        caption: "Tari Kancet Ledo"
      }
    ],
    funFacts: [
      "Samarinda terkenal dengan produksi sarung tenun Samarinda yang telah menjadi warisan budaya nasional",
      "Kota ini memiliki Islamic Center dengan menara setinggi 99 meter yang menjadi landmark utama",
      "Samarinda dilalui oleh Sungai Mahakam yang merupakan jalur transportasi penting sejak jaman kerajaan"
    ],
  },
  {
    id: "7",
    name: "Berau",
    thumbnail: require('../../assets/img-berau/derawan.jpeg'),
    description:
      "Berau adalah kabupaten di Kalimantan Timur yang terkenal dengan Kepulauan Derawan, destinasi wisata terindah di Indonesia. Daerah ini kaya akan keanekaragaman hayati laut dan hutan.",
    population: "214.378 jiwa (2020)",
    location: "Terletak di bagian utara Kalimantan Timur",
    culture: [
      {
        name: "Upacara Adat Pelas Kampung",
        image: require('../../assets/img-berau/upacaraadatpelaskampung.jpeg'),
        description: "Ritual tahunan untuk menghilangkan malapetaka dan menyucikan kampung dari gangguan roh jahat."
      },
      {
        name: "Tari Jepen Berau",
        image: require('../../assets/img-berau/tarijepenberau.jpeg'),
        description: "Tarian tradisional masyarakat Berau yang menggambarkan kegembiraan dan biasanya ditampilkan pada acara pernikahan atau penyambutan tamu."
      }
    ],
    culinary: [
      {
        name: "Kepiting Soka Berau",
        image: require('../../assets/img-berau/kepitingsokaberau.jpeg'),
        description: "Kepiting soka khas Berau yang dimasak dengan bumbu khas dan digoreng dengan tepung. Memiliki rasa manis dan gurih.",
        origin: "Makanan laut populer dari pesisir Berau"
      },
      {
        name: "Sate Ikan Pari",
        image: require('../../assets/img-berau/sateikanpari.jpeg'),
        description: "Sate yang terbuat dari daging ikan pari yang dipotong dadu, ditusuk, dan dibakar dengan bumbu kacang khas Berau.",
        origin: "Makanan tradisional nelayan Berau"
      },
      {
        name: "Otak-otak Ikan Berau",
        image: require('../../assets/img-berau/otakotakikan.jpeg'),
        description: "Campuran daging ikan yang dihaluskan dengan tepung dan bumbu, kemudian dibungkus daun pisang dan dipanggang.",
        origin: "Jajanan populer dari pesisir Berau"
      }
    ],
    photos: [
      {
        url: require('../../assets/img-berau/derawan.jpeg'),
        type: "landscape",
        caption: "Pulau Derawan"
      },
      {
        url: require('../../assets/img-berau/pulaumaratua.jpeg'),
        type: "square",
        caption: "Pulau Maratua"
      },
      {
        url: require('../../assets/img-berau/labuancermin.jpeg'),
        type: "portrait",
        caption: "Danau Labuan Cermin"
      },
      {
        url: require('../../assets/img-berau/penangkaranpenyu.jpeg'),
        type: "landscape",
        caption: "Penangkaran Penyu"
      }
    ],
    funFacts: [
      "Kepulauan Derawan di Berau adalah habitat bagi penyu hijau dan penyu sisik yang dilindungi",
      "Danau Labuan Cermin memiliki fenomena dua lapis air (tawar dan asin) dengan kejernihan luar biasa",
      "Berau adalah salah satu penghasil udang terbesar di Indonesia"
    ],
  },
  {
    id: "8",
    name: "Paser",
    thumbnail: require('../../assets/img-paser/paserhero.jpeg'),
    description:
      "Paser adalah kabupaten di bagian selatan Kalimantan Timur. Wilayah ini kaya akan sumber daya alam dan memiliki potensi pertanian, perkebunan, dan pertambangan yang besar.",
    population: "269.789 jiwa (2020)",
    location: "Terletak di bagian selatan Kalimantan Timur",
    culture: [
      {
        name: "Upacara Adat Naik Ayun",
        image: require('../../assets/img-paser/upacaraadat.jpeg'),
        description: "Ritual untuk bayi yang baru lahir dengan mengayun bayi dalam ayunan khusus sebagai simbol pengenalan kepada alam."
      },
      {
        name: "Tari Rembara",
        image: require('../../assets/img-paser/tarirembara.jpeg'),
        description: "Tarian tradisional masyarakat Paser yang menggambarkan keberanian dan semangat juang para pejuang Paser melawan penjajah."
      }
    ],
    culinary: [
      {
        name: "Ketupat Kandangan",
        image: require('../../assets/img-paser/ketupatkandangan.jpeg'),
        description: "Ketupat yang disajikan dengan kuah santan kuning bersama daging sapi atau ayam. Memiliki rasa gurih yang khas.",
        origin: "Makanan tradisional masyarakat Paser untuk perayaan"
      },
      {
        name: "Nasi Bekepor Paser",
        image: require('../../assets/img-paser/nasibekepor.jpeg'),
        description: "Nasi yang dimasak dengan santan dan rempah dalam bungkusan daun pisang. Varian Paser memiliki bumbu yang lebih kaya.",
        origin: "Makanan khas masyarakat Paser yang telah ada sejak lama"
      },
      {
        name: "Geguduh",
        image: require('../../assets/img-paser/geguduh.jpeg'),
        description: "Kue tradisional yang terbuat dari tepung beras, kelapa parut, dan gula merah. Digoreng hingga renyah di luar dan lembut di dalam.",
        origin: "Jajanan tradisional untuk acara adat dan perayaan"
      }
    ],
    photos: [
      {
        url: require('../../assets/img-paser/paserhero.jpeg'),
        type: "landscape",
        caption: "Pemandangan Kabupaten Paser"
      },
      {
        url: require('../../assets/img-paser/ketupatkandangan.jpeg'),
        type: "square",
        caption: "Ketupat Kandangan"
      },
      {
        url: require('../../assets/img-paser/nasibekepor.jpeg'),
        type: "portrait",
        caption: "Nasi Bekepor Paser"
      },
      {
        url: require('../../assets/img-paser/geguduh.jpeg'),
        type: "landscape",
        caption: "Kue Geguduh"
      },
      {
        url: require('../../assets/img-paser/tarirembara.jpeg'),
        type: "square",
        caption: "Tari Rembara"
      }
    ],
    funFacts: [
      "Paser dahulu merupakan Kerajaan Pasir Balengkong yang berdiri sekitar abad ke-17",
      "Masyarakat Paser memiliki tradisi Beumaa (membuka lahan) yang dilakukan secara gotong royong",
      "Kabupaten ini menghasilkan buah naga dan durian yang terkenal dengan kualitas premium"
    ],
  },
  {
    id: "9",
    name: "Bontang",
    thumbnail: require('../../assets/img-bontang/bontanghero.jpeg'),
    description:
      "Bontang adalah kota industri di Kalimantan Timur yang terkenal dengan pabrik gas alam cair dan pupuk. Meskipun berfokus pada industri, Bontang juga memiliki keindahan alam laut dan hutan mangrove.",
    population: "170.611 jiwa (2020)",
    location: "Terletak di pesisir timur Kalimantan Timur",
    culture: [
      {
        name: "Festival Laut Bontang",
        image: require('../../assets/img-bontang/fistival laut.jpeg'),
        description: "Perayaan tahunan untuk menghormati laut dan nelayan dengan berbagai atraksi budaya dan lomba perahu tradisional."
      },
      {
        name: "Tari Pesisir Bontang",
        image: require('../../assets/img-bontang/fistival laut.jpeg'),
        description: "Tarian yang menggambarkan kehidupan nelayan dan masyarakat pesisir Bontang dengan gerakan yang mengalun seperti ombak."
      }
    ],
    culinary: [
      {
        name: "Ikan Bakar Mangrove",
        image: require('../../assets/img-bontang/ikanbakarmangruf.jpeg'),
        description: "Ikan segar yang dibakar dengan bumbu khas Bontang dan disajikan dengan sambal dabu-dabu. Memiliki aroma asap dari kayu bakau.",
        origin: "Makanan khas nelayan di kawasan mangrove Bontang"
      },
      {
        name: "Kepiting Kenari",
        image: require('../../assets/img-bontang/kepitingkenari.jpeg'),
        description: "Kepiting yang dimasak dengan bumbu kenari khas Bontang, memberikan rasa gurih dan aroma khas pada hidangan.",
        origin: "Makanan laut tradisional dari Bontang Kuala"
      },
      {
        name: "Sambal Bontang",
        image: require('../../assets/img-bontang/sambal.jpeg'),
        description: "Sambal khas Bontang yang terbuat dari campuran cabai, terasi, dan jeruk nipis, dengan tambahan ikan teri atau udang rebon.",
        origin: "Bumbu tradisional masyarakat pesisir dan sungai"
      }
    ],
    photos: [
      {
        url: require('../../assets/img-bontang/bontanghero.jpeg'),
        type: "landscape",
        caption: "Kota Bontang"
      },
      {
        url: require('../../assets/img-bontang/fistival laut.jpeg'),
        type: "square",
        caption: "Festival Laut Bontang"
      },
      {
        url: require('../../assets/img-bontang/ikanbakarmangruf.jpeg'),
        type: "portrait",
        caption: "Ikan Bakar Mangrove"
      },
      {
        url: require('../../assets/img-bontang/kepitingkenari.jpeg'),
        type: "landscape",
        caption: "Kepiting Kenari"
      },
      {
        url: require('../../assets/img-bontang/sambal.jpeg'),
        type: "square",
        caption: "Sambal Bontang"
      }
    ],
    funFacts: [
      "Bontang memiliki pabrik LNG (Liquefied Natural Gas) terbesar di Indonesia",
      "Kota ini dikelilingi oleh Taman Nasional Kutai yang merupakan habitat orangutan",
      "Kampung Bontang Kuala adalah perkampungan nelayan di atas air dengan rumah panggung tradisional"
    ],
  },
  {
    id: "10",
    name: "Sangatta",
    thumbnail: require('../../assets/img-sangata/sangatahero.jpeg'),
    description:
      "Sangatta adalah ibukota Kabupaten Kutai Timur di Kalimantan Timur dan menjadi pusat pertambangan batubara. Daerah ini juga memiliki kekayaan alam berupa hutan hujan tropis yang menjadi rumah bagi berbagai flora dan fauna langka.",
    population: "163.898 jiwa (2020)",
    location: "Terletak di bagian timur Kalimantan Timur",
    culture: [
      {
        name: "Festival Erau Kutai Timur",
        image: require('../../assets/img-sangata/eraukutaitimur.jpeg'),
        description: "Perayaan budaya tahunan yang menampilkan berbagai pertunjukan seni dan upacara adat khas Kutai Timur sebagai wujud syukur dan pelestarian tradisi."
      },
      {
        name: "Tari Perang Suku Dayak",
        image: require('../../assets/img-sangata/tariperang.jpeg'),
        description: "Tarian tradisional yang menggambarkan keberanian dan semangat juang para prajurit Dayak dalam pertempuran melawan musuh."
      }
    ],
    culinary: [
      {
        name: "Kepiting Kenari Sangatta",
        image: require('../../assets/img-sangata/kepiting kenarisangata.jpeg'),
        description: "Kepiting yang dimasak dengan bumbu khas Sangatta yang kaya akan rempah dan kacang kenari, memberikan cita rasa gurih yang khas.",
        origin: "Makanan laut khas daerah pesisir Sangatta"
      },
      {
        name: "Nasi Bekepor Kutai Timur",
        image: require('../../assets/img-sangata/nasiberkepoi.jpeg'),
        description: "Nasi yang dimasak dengan santan, dibungkus daun pisang dan disajikan dengan lauk pauk seperti ayam atau ikan. Versi Kutai Timur memiliki aroma rempah yang lebih kuat.",
        origin: "Makanan tradisional masyarakat Kutai Timur"
      },
      {
        name: "Sayur Daun Singkong Santan",
        image: require('../../assets/img-sangata/sayurdaunsingkongsantan.jpeg'),
        description: "Daun singkong yang direbus dan dimasak dengan santan, rempah-rempah, dan ikan asin. Menjadi hidangan sehari-hari yang populer di Sangatta.",
        origin: "Masakan rumahan khas masyarakat lokal Sangatta"
      }
    ],
    photos: [
      {
        url: require('../../assets/img-sangata/sangatahero.jpeg'),
        type: "landscape",
        caption: "Sangatta"
      },
      {
        url: require('../../assets/img-sangata/eraukutaitimur.jpeg'),
        type: "square",
        caption: "Festival Erau Kutai Timur"
      },
      {
        url: require('../../assets/img-sangata/tariperang.jpeg'),
        type: "portrait",
        caption: "Tari Perang Suku Dayak"
      },
      {
        url: require('../../assets/img-sangata/kepiting kenarisangata.jpeg'),
        type: "landscape",
        caption: "Kepiting Kenari Sangatta"
      },
      {
        url: require('../../assets/img-sangata/nasiberkepoi.jpeg'),
        type: "square",
        caption: "Nasi Bekepor Kutai Timur"
      }
    ],
    funFacts: [
      "Sangatta adalah pusat pertambangan batubara terbesar di Indonesia dan rumah bagi PT Kaltim Prima Coal",
      "Taman Nasional Kutai yang terletak di dekat Sangatta merupakan salah satu habitat orangutan terbesar di Indonesia",
      "Sebelum menjadi kota tambang, Sangatta adalah daerah dengan hutan hujan tropis yang luas dan menjadi rumah bagi suku Dayak"
    ],
  }
];

// Helper function to create gallery columns with better distribution
const createGalleryColumns = (photos: PhotoItem[], columnCount: number) => {
  const columns = Array.from({ length: columnCount }, () => [] as PhotoItem[]);
  
  // Sort photos by type to distribute them more evenly
  const landscapePhotos = photos.filter(p => p.type === 'landscape');
  const portraitPhotos = photos.filter(p => p.type === 'portrait');
  const squarePhotos = photos.filter(p => p.type === 'square');
  
  // Combine all photos in an optimal distribution
  const sortedPhotos = [...landscapePhotos, ...squarePhotos, ...portraitPhotos];
  
  // Distribute photos to columns
  sortedPhotos.forEach((photo, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(photo);
  });
  
  return columns;
};

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isDesktop, setIsDesktop] = useState(windowWidth >= 1024);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegions, setFilteredRegions] = useState(regions);
  const [isSearching, setIsSearching] = useState(false);
  
  // Add state for category filtering
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<{
    type: string,
    items: Array<{
      regionId: string,
      regionName: string,
      item: any
    }>
  } | null>(null);
  
  // Add mute/unmute state for hero video
  const [isMuted, setIsMuted] = useState(false);
  const [userMutePreference, setUserMutePreference] = useState(false); // Store user's preference
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Set default to false
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused(); // Hook to detect if screen is focused
  
  // Effect to handle muting when screen focus changes
  useEffect(() => {
    if (!isFocused) {
      // Screen is not in focus, always mute video
      console.log('Screen lost focus - muting video');
      setIsMuted(true);
    } else {
      // Screen is in focus, restore user's preference
      console.log('Screen gained focus - restoring user mute preference');
      setIsMuted(userMutePreference);
    }
  }, [isFocused, userMutePreference]);
  
  // Handle user toggling mute button
  const handleToggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    setUserMutePreference(newMuteState); // Remember user's choice
    console.log('User toggled mute to:', newMuteState);
  };
  
  // Function to completely unload video
  const unloadVideo = async () => {
    if (videoRef.current) {
      try {
        console.log('Unloading video completely');
        await videoRef.current.stopAsync();
        await videoRef.current.unloadAsync();
        setIsPlaying(false);
      } catch (error) {
        console.log('Error unloading video:', error);
      }
    }
  };
  
  // Use useFocusEffect which is called when screen comes into focus and cleanup when it loses focus
  useFocusEffect(
    React.useCallback(() => {
      // This runs when the screen is focused
      console.log('Screen is focused');
      
      // Return a cleanup function that runs when the screen is unfocused
      return () => {
        console.log('Screen is unfocused - cleaning up video');
        unloadVideo();
      };
    }, [])
  );
  
  // Add a navigation state listener to detect screen changes
  useEffect(() => {
    if (!navigation) return;
    
    // Function to handle navigation state changes
    const unsubscribe = navigation.addListener('state', () => {
      // This will run whenever the navigation state changes (switching screens)
      console.log('Navigation state changed - stopping video');
      unloadVideo();
    });
    
    // Cleanup the listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);
  
  // Add effect for selectedRegion changes
  useEffect(() => {
    if (selectedRegion) {
      // If a region is selected, unload the video
      unloadVideo();
    }
  }, [selectedRegion]);
  
  // App state effect - more aggressive
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log('App state changing from', appState.current, 'to', nextAppState);
      
      if (nextAppState !== 'active') {
        // App is going to background or inactive
        await unloadVideo();
      }
      
      appState.current = nextAppState;
    };
    
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Component unmount cleanup
  useEffect(() => {
    return () => {
      // Final cleanup when component unmounts
      unloadVideo();
    };
  }, []);
  
  // More aggressive cleanup on app state change
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) && 
        nextAppState.match(/inactive|background/)
      ) {
        // App is going to background - completely unload the video
        if (videoRef.current) {
          try {
            await videoRef.current.stopAsync();
            await videoRef.current.unloadAsync();
            setIsPlaying(false);
            console.log('Video unloaded due to app going to background');
          } catch (error) {
            console.log('Error unloading video:', error);
          }
        }
      }
      
      appState.current = nextAppState;
    };
    
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Add hover state for cards
  const [hoveredFeatured, setHoveredFeatured] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);
  
  // Create refs for all regions to track their positions
  const regionRefs = useRef<Array<any>>(new Array(regions.length).fill(null));
  const featuredRefs = useRef<Array<any>>(new Array(regions.length).fill(null));
  const categoryRefs = useRef<Array<any>>(new Array(3).fill(null));
  
  // Animation values for each card
  const [entryAnimations] = useState(() => 
    regions.map(() => new Animated.Value(0))
  );
  
  const [categoryAnimations] = useState(() => 
    Array(3).fill(0).map(() => new Animated.Value(0))
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
    } else if (activeTab === "culinary") {
      // Reset animation values for culinary tab
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

  // Function to filter items by category
  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    let results: Array<{regionId: string, regionName: string, item: any}> = [];
    let type: string = '';
    
    // Based on selected category, get relevant items from all regions
    switch(category) {
      case 'Tarian':
        type = 'culture';
        regions.forEach(region => {
          region.culture.forEach(item => {
            if (item.name.toLowerCase().includes('tari') || 
                item.description.toLowerCase().includes('tari')) {
              results.push({
                regionId: region.id,
                regionName: region.name,
                item: item
              });
            }
          });
        });
        break;
      
      case 'Kuliner':
        type = 'culinary';
        regions.forEach(region => {
          region.culinary.forEach(item => {
            results.push({
              regionId: region.id,
              regionName: region.name,
              item: item
            });
          });
        });
        break;
      
      case 'Festival':
        type = 'culture';
        regions.forEach(region => {
          region.culture.forEach(item => {
            if (item.name.toLowerCase().includes('festival') || 
                item.description.toLowerCase().includes('festival') ||
                item.name.toLowerCase().includes('upacara') || 
                item.description.toLowerCase().includes('upacara')) {
              results.push({
                regionId: region.id,
                regionName: region.name,
                item: item
              });
            }
          });
        });
        break;
    }
    
    setCategoryResults({
      type,
      items: results
    });
  };
  
  // Function to close category results and reset state
  const closeCategory = () => {
    setSelectedCategory(null);
    setCategoryResults(null);
  };
  
  // Add function to navigate to region and appropriate tab
  const navigateToRegionWithCategory = (regionId: string, type: string) => {
    const region = regions.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion(region);
      
      if (type === 'culture') {
        setActiveTab('culture');
      } else if (type === 'culinary') {
        setActiveTab('culinary');
      }
    }
  };

  if (selectedRegion) {
    return (
      <Layout>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            styles.storyContainer,
            isDesktop && styles.storyContainerDesktop
          ]}>
            <View style={styles.storyHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedRegion(null)}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text style={styles.backButtonText}>Kembali</Text>
              </TouchableOpacity>

              <Text style={[styles.storyTitle, isDesktop && styles.storyTitleDesktop]}>
                {selectedRegion.name}
              </Text>
            </View>

            <View style={isDesktop ? styles.desktopContentLayout : null}>
              <View style={isDesktop ? styles.desktopImageContainer : null}>
                <Image
                  source={selectedRegion.id === "5" ? defaultHeroImage : selectedRegion.thumbnail}
                  style={[styles.storyImage, isDesktop && styles.storyImageDesktop]}
                  resizeMode="cover"
                />
              </View>

              <View style={isDesktop ? styles.desktopContentContainer : null}>
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
                      activeTab === "culinary" ? styles.activeTab : styles.inactiveTab,
                      isDesktop && styles.tabDesktop
                    ]}
                    onPress={() => setActiveTab("culinary")}
                  >
                    <Text style={activeTab === "culinary" ? styles.activeTabText : styles.tabText}>Kuliner</Text>
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

                {/* Tab Content - Keep existing tab content handlers but update the wrappers */}
                {activeTab === "info" && (
                  <Animated.View 
                    style={[
                      styles.tabContent, 
                      isDesktop && styles.tabContentDesktop,
                      { opacity: infoAnimFade, transform: [{ translateY: infoAnimSlide }] }
                    ]}
                  >
                    {/* Keep existing info tab content */}
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
                        <View style={[isDesktop && styles.factsGridDesktop, styles.factsWrapper]}>
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
                    
                    <View style={[styles.cultureGridDesktop, styles.contentWrapper]}>
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

                {activeTab === "culinary" && (
                  <Animated.View 
                    style={[
                      styles.tabContent, 
                      isDesktop && styles.tabContentDesktop,
                      { opacity: cultureAnimFade, transform: [{ translateY: cultureAnimSlide }] }
                    ]}
                  >
                    <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
                      Kuliner {selectedRegion.name}
                    </Text>
                    
                    <View style={[styles.cultureGridDesktop, styles.contentWrapper]}>
                      {selectedRegion.culinary.map((item, index) => (
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
                            {item.origin && (
                              <Text style={[styles.culinaryOrigin, isDesktop && styles.culinaryOriginDesktop]}>
                                <Text style={styles.culinaryOriginLabel}>Asal: </Text>
                                {item.origin}
                              </Text>
                            )}
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
                      {createGalleryColumns(selectedRegion.photos, isDesktop ? 3 : 2).map((column, columnIndex) => (
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
                                <View style={[
                                  styles.galleryImageContainer,
                                  photo.type === 'landscape' && styles.galleryImageContainerLandscape,
                                  photo.type === 'portrait' && styles.galleryImageContainerPortrait,
                                  photo.type === 'square' && styles.galleryImageContainerSquare,
                                ]}>
                                  <Image
                                    source={photo.url}
                                    style={styles.galleryImage}
                                    resizeMode="cover"
                                  />
                                </View>
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
              </View>
            </View>
          </View>
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
        {/* Hero Section - Simplified for reliable playback */}
        {!selectedRegion && (
          <View style={[styles.heroBackground, isDesktop && styles.heroBackgroundDesktop]}>
            <Video
              ref={videoRef}
              source={require('../../assets/videos/HeroEksplore.mp4')}
              style={[styles.heroVideo, isDesktop && styles.heroVideoDesktop]}
              resizeMode={ResizeMode.COVER}
              shouldPlay={isFocused}
              isLooping
              isMuted={isMuted}
              useNativeControls={false}
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (status.isLoaded) {
                  setIsPlaying(status.isPlaying);
                }
              }}
            />
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
            
            {/* Add audio toggle button */}
            <TouchableOpacity
              style={[
                styles.audioToggleButton,
                isDesktop ? styles.audioToggleButtonDesktop : styles.audioToggleButtonMobile
              ]}
              onPress={handleToggleMute}
            >
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={isDesktop ? 24 : 18}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}

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

        {/* Category Results Modal */}
        {selectedCategory && categoryResults && (
          <View style={styles.categoryResultsContainer}>
            <View style={styles.categoryResultsHeader}>
              <Text style={styles.categoryResultsTitle}>
                {selectedCategory} di Kalimantan Timur
              </Text>
              <TouchableOpacity 
                onPress={closeCategory}
                style={styles.closeCategoryButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.categoryResultsScroll}
              showsVerticalScrollIndicator={true}
            >
              {categoryResults.items.length > 0 ? (
                <View style={styles.categoryResultsList}>
                  {categoryResults.items.map((result, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.categoryResultItem}
                      onPress={() => navigateToRegionWithCategory(result.regionId, categoryResults.type)}
                    >
                      <Image 
                        source={result.item.image} 
                        style={styles.categoryResultImage} 
                        resizeMode="cover"
                      />
                      <View style={styles.categoryResultContent}>
                        <Text style={styles.categoryResultName}>{result.item.name}</Text>
                        <Text style={styles.categoryResultRegion}>
                          <Ionicons name="location-outline" size={14} color={Colors.primary} />
                          {' '}{result.regionName}
                        </Text>
                        <Text 
                          style={styles.categoryResultDescription}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {result.item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noResultsInModal}>
                  <Ionicons name="search-outline" size={60} color={`${Colors.primary}60`} />
                  <Text style={styles.noResultsText}>
                    Tidak ditemukan hasil untuk "{selectedCategory}"
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
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
                              source={defaultHeroImage}
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
                  <Text style={styles.sectionHeaderTitle}>Daerah Pioritas 3T</Text>
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScrollContent}
                >
                  {regions.slice(0, 4).map((region, index) => (
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
                            source={defaultHeroImage}
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
                  {['Tarian', 'Kuliner', 'Festival'].map((category, index) => (
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
                        onPress={() => filterByCategory(category)}
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
                                  source={defaultHeroImage}
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
                                source={defaultHeroImage}
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  titleDesktop: {
    fontSize: 32,
    marginBottom: 24,
  },

  // Hero section
  heroBackground: {
    height: 300,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackgroundDesktop: {
    height: 500,
  },
  heroVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  heroVideoDesktop: {
    height: '100%',
  },
  heroImageContainer: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImageContainerDesktop: {
    marginBottom: 30,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  heroImageDesktop: {
    width: '100%',
    height: 400,
    borderRadius: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    width: '100%',
    paddingHorizontal: 0,
  },
  tabBarDesktop: {
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 4,
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
    width: '100%',
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
    width: '100%',
  },
  cardContainerDesktop: {
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
    width: '100%',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'justify',
    letterSpacing: 0.3,
    fontWeight: '400',
    width: '100%',
  },
  descriptionDesktop: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 30,
  },
  
  // Info section
  infoContainer: {
    width: '100%',
    marginBottom: 20,
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
    width: '100%',
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
    width: '100%',
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
    width: '100%',
  },
  factItemDesktop: {
    width: '48%',
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
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
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 20,
    marginTop: 0,
    textAlign: 'left',
  },
  sectionTitleDesktop: {
    fontSize: 24,
    marginBottom: 24,
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
    width: '100%',
    maxWidth: 1200,
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
    height: 'auto',
    width: '100%',
  },
  cultureItemDesktop: {
    width: '48%',
    marginBottom: 24,
    flexDirection: 'column',
    borderRadius: 16,
  },
  cultureItemImageLeft: {
    flexDirection: 'row',
  },
  cultureItemImageRight: {
    flexDirection: 'row-reverse',
  },
  cultureImage: {
    width: 140,
    height: 140,
    borderRadius: 0,
  },
  cultureImageDesktop: {
    width: '100%',
    height: 240,
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
    padding: 20,
    minHeight: 150,
  },
  cultureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cultureNameDesktop: {
    fontSize: 20,
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
    paddingHorizontal: 0,
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
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  galleryImageContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: Colors.lightBackground,
  },
  galleryImageContainerLandscape: {
    aspectRatio: 16/9,
  },
  galleryImageContainerPortrait: {
    aspectRatio: 2/3,
  },
  galleryImageContainerSquare: {
    aspectRatio: 1,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  captionText: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: '600',
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
    transform: [{ scale: 1.03 }],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 2,
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
  // Add styles for audio toggle button
  audioToggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  audioToggleButtonDesktop: {
    width: 48,
    height: 48,
  },
  audioToggleButtonMobile: {
    width: 36,
    height: 36,
    bottom: 15,
    right: 15,
  },
  
  // Add culinary styles
  culinaryOrigin: {
    fontSize: 13,
    color: Colors.lightText,
    marginTop: 8,
    fontStyle: 'italic',
  },
  culinaryOriginDesktop: {
    fontSize: 14,
    marginTop: 12,
  },
  culinaryOriginLabel: {
    fontWeight: 'bold',
  },
  
  // Category results styles
  categoryResultsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    margin: 20,
    marginTop: 0,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.primary,
  },
  categoryResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  closeCategoryButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryResultsScroll: {
    maxHeight: 500,
  },
  categoryResultsList: {
    padding: 16,
  },
  categoryResultItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: Colors.buttonBackground,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryResultImage: {
    width: 120,
    height: 120,
  },
  categoryResultContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  categoryResultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryResultRegion: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 8,
    fontWeight: '500',
  },
  categoryResultDescription: {
    fontSize: 14,
    color: Colors.lightText,
    lineHeight: 20,
  },
  heroContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  heroContainerDesktop: {
    marginBottom: 40,
  },
  contentWrapper: {
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentWrapperDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  factsWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  
  // Add or update these styles to match StoriesScreen
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
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  storyTitleDesktop: {
    fontSize: 32,
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
});
