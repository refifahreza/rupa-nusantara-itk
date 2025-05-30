import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';
import Layout from '../components/layout/Layout';
import Colors from '../constants/Colors';

type Module = {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'pdf' | 'html';
};

const modules: Module[] = [
  {
    id: 'mod1',
    title: 'Budaya dan Bahasa Kalimantan Timur',
    description: 'Modul pembelajaran dasar tentang budaya dan bahasa daerah Kalimantan Timur',
    image: 'https://placehold.co/600x400/F57C00/FFF?text=Budaya+KalTim',
    type: 'pdf'
  },
  {
    id: 'mod2',
    title: 'Cerita Rakyat untuk Kelas 4-6 SD',
    description: 'Kumpulan cerita rakyat dan aktivitas pembelajaran untuk siswa SD',
    image: 'https://placehold.co/600x400/F57C00/FFF?text=Cerita+Rakyat',
    type: 'html'
  },
  {
    id: 'mod3',
    title: 'Kosakata Bahasa Daerah untuk Pemula',
    description: 'Daftar kosakata dasar dalam bahasa daerah Kalimantan Timur',
    image: 'https://placehold.co/600x400/F57C00/FFF?text=Kosakata',
    type: 'pdf'
  },
];

export default function EduCenterScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [activeTab, setActiveTab] = useState<'modules'|'stats'|'download'|'curriculum'>('modules');
  
  const renderModulesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Modul Pembelajaran</Text>
      <Text style={styles.sectionDescription}>
        Modul-modul pembelajaran untuk guru dan siswa yang dapat digunakan sebagai bahan ajar muatan lokal
      </Text>
      
      {modules.map(module => (
        <TouchableOpacity 
          key={module.id}
          style={styles.moduleCard}
          onPress={() => navigation.navigate('LearningModules', { moduleId: module.id })}
        >
          <Image 
            source={{ uri: module.image }} 
            style={styles.moduleImage}
            resizeMode="cover"
          />
          <View style={styles.moduleContent}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>
            <View style={styles.moduleFooter}>
              <Text style={styles.moduleType}>
                {module.type === 'pdf' ? '📄 PDF' : '🌐 HTML'}
              </Text>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => navigation.navigate('LearningModules', { moduleId: module.id })}
              >
                <Text style={styles.viewButtonText}>Lihat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Statistik Penggunaan Siswa</Text>
      <Text style={styles.sectionDescription}>
        Pantau perkembangan belajar siswa melalui statistik penggunaan aplikasi
      </Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Statistik akan tersedia setelah login sebagai guru</Text>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login sebagai Guru</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderDownloadTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Unduh Konten Offline</Text>
      <Text style={styles.sectionDescription}>
        Unduh konten pembelajaran untuk digunakan tanpa koneksi internet
      </Text>
      
      <View style={styles.downloadCard}>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Unduh Modul Pembelajaran (25MB)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Unduh Kamus Offline (12MB)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Unduh Audio Cerita (40MB)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderCurriculumTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Integrasi Kurikulum Muatan Lokal</Text>
      <Text style={styles.sectionDescription}>
        Panduan integrasi aplikasi dengan kurikulum muatan lokal di sekolah
      </Text>
      
      <View style={styles.curriculumCard}>
        <Text style={styles.curriculumTitle}>Dokumen Panduan Integrasi Kurikulum</Text>
        <TouchableOpacity style={styles.curriculumButton}>
          <Text style={styles.curriculumButtonText}>Unduh Panduan (PDF)</Text>
        </TouchableOpacity>
        <Text style={styles.curriculumTitle}>Rencana Pelaksanaan Pembelajaran (RPP)</Text>
        <TouchableOpacity style={styles.curriculumButton}>
          <Text style={styles.curriculumButtonText}>Unduh Template RPP (DOCX)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pusat Pendidikan</Text>
        <Text style={styles.headerSubtitle}>Sumber daya untuk guru dan sekolah</Text>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'modules' && styles.activeTab]} 
          onPress={() => setActiveTab('modules')}
        >
          <Text style={[styles.tabText, activeTab === 'modules' && styles.activeTabText]}>Modul</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]} 
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Statistik</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'download' && styles.activeTab]} 
          onPress={() => setActiveTab('download')}
        >
          <Text style={[styles.tabText, activeTab === 'download' && styles.activeTabText]}>Unduh</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'curriculum' && styles.activeTab]} 
          onPress={() => setActiveTab('curriculum')}
        >
          <Text style={[styles.tabText, activeTab === 'curriculum' && styles.activeTabText]}>Kurikulum</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        {activeTab === 'modules' && renderModulesTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'download' && renderDownloadTab()}
        {activeTab === 'curriculum' && renderCurriculumTab()}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  moduleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  moduleImage: {
    height: 150,
    width: '100%',
  },
  moduleContent: {
    padding: 16,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleType: {
    fontSize: 14,
    color: '#888',
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  downloadCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  curriculumCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  curriculumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    color: '#333',
  },
  curriculumButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  curriculumButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 