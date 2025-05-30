import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Header from '../components/layout/Header';

// Type definitions
type RootStackParamList = {
  LanguageOfficeDashboard: undefined;
  ContentValidation: undefined;
  LanguageManagement: undefined;
  UserCommunity: undefined;
  ReportsExport: undefined;
};

// Mock data for reports
const mockReports = [
  {
    id: '1',
    title: 'Laporan Triwulan Bahasa Daerah',
    period: 'Q2 2023',
    date: '30 Juni 2023',
    format: 'PDF',
    size: '1.2 MB',
    description: 'Statistik penggunaan dan progres revitalisasi bahasa daerah selama triwulan kedua 2023',
    type: 'scheduled'
  },
  {
    id: '2',
    title: 'Statistik Kontribusi Guru',
    period: 'Mei 2023',
    date: '31 Mei 2023',
    format: 'Excel',
    size: '845 KB',
    description: 'Data kontribusi guru per bahasa daerah dengan statistik aktivitas selama bulan Mei 2023',
    type: 'scheduled'
  },
  {
    id: '3',
    title: 'Perkembangan Kosakata Bahasa Jawa',
    period: 'Semester 1 2023',
    date: '15 Juni 2023',
    format: 'PDF',
    size: '3.5 MB',
    description: 'Laporan detail tentang penambahan kosakata dan validasi untuk Bahasa Jawa',
    type: 'custom'
  },
  {
    id: '4',
    title: 'Ekspor Database Kosakata',
    period: 'Data Lengkap',
    date: '1 Juni 2023',
    format: 'CSV',
    size: '7.8 MB',
    description: 'Ekspor lengkap database kosakata dari semua bahasa daerah dalam format CSV',
    type: 'custom'
  },
  {
    id: '5',
    title: 'Laporan Status Vitalitas Bahasa',
    period: 'Juni 2023',
    date: '30 Juni 2023',
    format: 'PDF',
    size: '2.1 MB',
    description: 'Laporan status vitalitas semua bahasa daerah berdasarkan kerangka UNESCO',
    type: 'scheduled'
  }
];

// Mock data for report formats
const reportFormats = [
  { id: 'pdf', name: 'PDF', icon: 'document-text' },
  { id: 'excel', name: 'Excel', icon: 'grid' },
  { id: 'csv', name: 'CSV', icon: 'code-slash' }
];

// Mock data for report templates
const reportTemplates = [
  { 
    id: 'quarterly', 
    name: 'Laporan Triwulan',
    description: 'Statistik lengkap penggunaan dan revitalisasi bahasa dalam periode 3 bulan'
  },
  { 
    id: 'language-status', 
    name: 'Status Vitalitas Bahasa',
    description: 'Laporan status vitalitas bahasa berdasarkan kerangka UNESCO'
  },
  { 
    id: 'contributor-stats', 
    name: 'Statistik Kontributor',
    description: 'Data kontribusi guru dan komunitas per bahasa daerah'
  },
  { 
    id: 'vocabulary-export', 
    name: 'Ekspor Database Kosakata',
    description: 'Ekspor lengkap database kosakata semua bahasa atau per bahasa'
  }
];

type Report = {
  id: string;
  title: string;
  period: string;
  date: string;
  format: string;
  size: string;
  description: string;
  type: string;
};

interface ReportsExportScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const ReportsExportScreen = ({ navigation }: ReportsExportScreenProps) => {
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'generate'
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Format icon based on report format
  const getFormatIcon = (format: string): 'document-text' | 'grid' | 'code-slash' | 'document' => {
    switch(format.toLowerCase()) {
      case 'pdf': return 'document-text';
      case 'excel': return 'grid';
      case 'csv': return 'code-slash';
      default: return 'document';
    }
  };

  // Format color based on report format
  const getFormatColor = (format: string) => {
    switch(format.toLowerCase()) {
      case 'pdf': return '#F44336';
      case 'excel': return '#4CAF50';
      case 'csv': return '#2196F3';
      default: return '#757575';
    }
  };

  // Report item renderer
  const renderReportItem = (report: Report) => (
    <TouchableOpacity 
      key={report.id}
      style={[
        styles.reportItem,
        selectedReport?.id === report.id && styles.selectedReportItem
      ]}
      onPress={() => setSelectedReport(report)}
    >
      <View style={styles.reportHeader}>
        <View style={[
          styles.formatIcon,
          { backgroundColor: getFormatColor(report.format) + '20' }
        ]}>
          <Ionicons 
            name={getFormatIcon(report.format) as any} 
            size={24} 
            color={getFormatColor(report.format)} 
          />
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportPeriod}>{report.period}</Text>
          <Text style={styles.reportDate}>{report.date}</Text>
        </View>
      </View>
      <View style={styles.reportMeta}>
        <View style={styles.reportTypeContainer}>
          <Text style={styles.reportType}>
            {report.type === 'scheduled' ? 'Terjadwal' : 'Kustom'}
          </Text>
        </View>
        <Text style={styles.reportSize}>{report.format} • {report.size}</Text>
      </View>
      <Text style={styles.reportDescription}>{report.description}</Text>
    </TouchableOpacity>
  );

  // Format option renderer
  const renderFormatOption = (format: typeof reportFormats[0]) => (
    <TouchableOpacity 
      key={format.id}
      style={[
        styles.formatOption,
        selectedFormat === format.id && styles.selectedFormatOption
      ]}
      onPress={() => setSelectedFormat(format.id)}
    >
      <Ionicons 
        name={format.icon} 
        size={24} 
        color={selectedFormat === format.id ? Colors.primary : Colors.lightText} 
      />
      <Text style={[
        styles.formatName,
        selectedFormat === format.id && styles.selectedFormatName
      ]}>
        {format.name}
      </Text>
    </TouchableOpacity>
  );

  // Template option renderer
  const renderTemplateOption = (template: typeof reportTemplates[0]) => (
    <TouchableOpacity 
      key={template.id}
      style={[
        styles.templateOption,
        selectedTemplate === template.id && styles.selectedTemplateOption
      ]}
      onPress={() => setSelectedTemplate(template.id)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateName}>{template.name}</Text>
        <Ionicons 
          name={selectedTemplate === template.id ? "checkmark-circle" : "checkmark-circle-outline"} 
          size={24} 
          color={selectedTemplate === template.id ? Colors.primary : Colors.lightText} 
        />
      </View>
      <Text style={styles.templateDescription}>{template.description}</Text>
    </TouchableOpacity>
  );

  // Custom navigation items for Language Office
  const navItems = [
    { title: 'Dashboard', route: 'LanguageOfficeDashboard', isActive: false, icon: 'dashboard' },
    { title: 'Validasi Konten', route: 'ContentValidation', isActive: false, icon: 'check-circle' },
    { title: 'Manajemen Bahasa', route: 'LanguageManagement', isActive: false, icon: 'language' },
    { title: 'Pengguna & Komunitas', route: 'UserCommunity', isActive: false, icon: 'people' },
    { title: 'Ekspor & Laporan', route: 'ReportsExport', isActive: true, icon: 'description' }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Ekspor & Laporan" 
        showNotifications={true}
        showNavigation={true}
        activeNavItem="ReportsExport"
        customNavItems={navItems}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            activeTab === 'history' && styles.activeTabItem
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'history' && styles.activeTabText
          ]}>
            Riwayat Laporan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabItem, 
            activeTab === 'generate' && styles.activeTabItem
          ]}
          onPress={() => setActiveTab('generate')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'generate' && styles.activeTabText
          ]}>
            Buat Laporan Baru
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'history' ? (
          <>
            {isDesktop && (
              <View style={styles.reportFilterBar}>
                <Text style={styles.filterTitle}>Filter:</Text>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Semua</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Terjadwal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterText}>Kustom</Text>
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <TouchableOpacity style={styles.sortOption}>
                  <Text style={styles.sortText}>Terbaru</Text>
                  <Ionicons name="chevron-down" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            <ScrollView style={styles.reportsContainer}>
              <View style={styles.reportsList}>
                {mockReports.map(report => renderReportItem(report))}
              </View>
            </ScrollView>
            
            {selectedReport && isDesktop && (
              <View style={styles.reportDetailPanel}>
                <View style={styles.reportDetailHeader}>
                  <Text style={styles.detailTitle}>{selectedReport.title}</Text>
                  <TouchableOpacity 
                    style={styles.closeDetailButton}
                    onPress={() => setSelectedReport(null)}
                  >
                    <Ionicons name="close" size={24} color={Colors.lightText} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.reportDetailContent}>
                  <View style={styles.detailInfoRow}>
                    <View style={styles.detailInfoItem}>
                      <Text style={styles.detailInfoLabel}>Periode:</Text>
                      <Text style={styles.detailInfoValue}>{selectedReport.period}</Text>
                    </View>
                    <View style={styles.detailInfoItem}>
                      <Text style={styles.detailInfoLabel}>Tanggal:</Text>
                      <Text style={styles.detailInfoValue}>{selectedReport.date}</Text>
                    </View>
                    <View style={styles.detailInfoItem}>
                      <Text style={styles.detailInfoLabel}>Format:</Text>
                      <Text style={styles.detailInfoValue}>{selectedReport.format}</Text>
                    </View>
                    <View style={styles.detailInfoItem}>
                      <Text style={styles.detailInfoLabel}>Ukuran:</Text>
                      <Text style={styles.detailInfoValue}>{selectedReport.size}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailDescriptionSection}>
                    <Text style={styles.detailSectionTitle}>Deskripsi</Text>
                    <Text style={styles.detailDescription}>{selectedReport.description}</Text>
                  </View>
                  
                  <View style={styles.detailPreviewSection}>
                    <Text style={styles.detailSectionTitle}>Pratinjau</Text>
                    <View style={styles.previewPlaceholder}>
                      <Ionicons name="document-text-outline" size={64} color="#CCC" />
                      <Text style={styles.previewPlaceholderText}>
                        Pratinjau laporan akan ditampilkan di sini
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailActions}>
                    <TouchableOpacity style={styles.detailActionButton}>
                      <Ionicons name="eye-outline" size={20} color={Colors.primary} />
                      <Text style={styles.detailActionText}>Lihat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.detailActionButton}>
                      <Ionicons name="cloud-download-outline" size={20} color={Colors.primary} />
                      <Text style={styles.detailActionText}>Unduh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.detailActionButton}>
                      <Ionicons name="trash-outline" size={20} color="#F44336" />
                      <Text style={[styles.detailActionText, { color: '#F44336' }]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </>
        ) : (
          <ScrollView style={styles.generateContainer}>
            <View style={styles.generateSection}>
              <Text style={styles.generateSectionTitle}>Pilih Template Laporan</Text>
              <View style={styles.templateOptions}>
                {reportTemplates.map(template => renderTemplateOption(template))}
              </View>
            </View>
            
            <View style={styles.generateSection}>
              <Text style={styles.generateSectionTitle}>Format Output</Text>
              <View style={styles.formatOptions}>
                {reportFormats.map(format => renderFormatOption(format))}
              </View>
            </View>
            
            <View style={styles.generateSection}>
              <Text style={styles.generateSectionTitle}>Rentang Waktu</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity style={styles.dateOption}>
                  <Text style={styles.dateOptionText}>Bulan Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateOption}>
                  <Text style={styles.dateOptionText}>Triwulan Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateOption}>
                  <Text style={styles.dateOptionText}>Tahun Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dateOption, styles.customDateOption]}>
                  <Text style={styles.dateOptionText}>Kustom</Text>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.generateSection}>
              <Text style={styles.generateSectionTitle}>Pilihan Lanjutan</Text>
              <View style={styles.advancedOptions}>
                <TouchableOpacity style={styles.advancedOption}>
                  <Ionicons name="language-outline" size={20} color={Colors.text} />
                  <Text style={styles.advancedOptionText}>Pilih Bahasa Spesifik</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.lightText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.advancedOption}>
                  <Ionicons name="options-outline" size={20} color={Colors.text} />
                  <Text style={styles.advancedOptionText}>Konfigurasi Detail Laporan</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.lightText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.advancedOption}>
                  <Ionicons name="mail-outline" size={20} color={Colors.text} />
                  <Text style={styles.advancedOptionText}>Kirim Laporan via Email</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.lightText} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.generateActions}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.generateButton}>
                <Text style={styles.generateButtonText}>Buat Laporan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  reportFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterTitle: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 12,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  filterText: {
    fontSize: 12,
    color: Colors.text,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  sortText: {
    fontSize: 12,
    color: Colors.primary,
    marginRight: 4,
  },
  reportsContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  reportsList: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedReportItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  reportPeriod: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    color: Colors.lightText,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTypeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  reportType: {
    fontSize: 10,
    color: Colors.text,
  },
  reportSize: {
    fontSize: 12,
    color: Colors.lightText,
  },
  reportDescription: {
    fontSize: 14,
    color: Colors.text,
  },
  reportDetailPanel: {
    width: '30%',
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
  },
  reportDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  closeDetailButton: {
    padding: 4,
  },
  reportDetailContent: {
    padding: 16,
    flex: 1,
  },
  detailInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  detailInfoItem: {
    width: '50%',
    marginBottom: 12,
  },
  detailInfoLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 4,
  },
  detailInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  detailDescriptionSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  detailPreviewSection: {
    flex: 1,
    marginBottom: 24,
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 24,
  },
  previewPlaceholderText: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 16,
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  detailActionText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  generateContainer: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  generateSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  generateSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  templateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateOption: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  selectedTemplateOption: {
    borderColor: Colors.primary,
    backgroundColor: '#F1F8E9',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  templateDescription: {
    fontSize: 14,
    color: Colors.lightText,
  },
  formatOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formatOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    width: '30%',
  },
  selectedFormatOption: {
    backgroundColor: '#E3F2FD',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  formatName: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 8,
  },
  selectedFormatName: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
  },
  customDateOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateOptionText: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 4,
  },
  advancedOptions: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  advancedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  advancedOptionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  generateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ReportsExportScreen; 