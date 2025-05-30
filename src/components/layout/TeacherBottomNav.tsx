import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  TeacherDashboard: undefined;
  TeacherQuizManagement: undefined;
  TeacherContributor: undefined;
};

type Props = {
  activeScreen: 'home' | 'quiz' | 'contributor';
};

const TeacherBottomNav = ({ activeScreen }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  if (isDesktop) {
    // Render side navigation for desktop
    return (
      <View style={styles.sideNavContainer}>
        <TouchableOpacity 
          style={[styles.sideNavItem, activeScreen === 'home' && styles.activeSideNavItem]}
          onPress={() => navigation.navigate('TeacherDashboard')}
        >
          <Ionicons 
            name={activeScreen === 'home' ? "home" : "home-outline"} 
            size={24} 
            color={activeScreen === 'home' ? Colors.primary : Colors.text} 
          />
          <Text style={[styles.sideNavText, activeScreen === 'home' && styles.activeSideNavText]}>Beranda</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sideNavItem, activeScreen === 'quiz' && styles.activeSideNavItem]}
          onPress={() => navigation.navigate('TeacherQuizManagement')}
        >
          <Ionicons 
            name={activeScreen === 'quiz' ? "help-circle" : "help-circle-outline"} 
            size={24} 
            color={activeScreen === 'quiz' ? Colors.primary : Colors.text} 
          />
          <Text style={[styles.sideNavText, activeScreen === 'quiz' && styles.activeSideNavText]}>Kuis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sideNavItem, activeScreen === 'contributor' && styles.activeSideNavItem]}
          onPress={() => navigation.navigate('TeacherContributor')}
        >
          <Ionicons 
            name={activeScreen === 'contributor' ? "document-text" : "document-text-outline"} 
            size={24} 
            color={activeScreen === 'contributor' ? Colors.primary : Colors.text} 
          />
          <Text style={[styles.sideNavText, activeScreen === 'contributor' && styles.activeSideNavText]}>Kontributor</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render bottom navigation for mobile/tablet
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('TeacherDashboard')}
      >
        <Ionicons 
          name={activeScreen === 'home' ? "home" : "home-outline"} 
          size={24} 
          color={activeScreen === 'home' ? Colors.primary : Colors.lightText} 
        />
        <Text 
          style={[
            styles.navText, 
            activeScreen === 'home' && styles.activeNavText
          ]}
        >
          Beranda
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('TeacherQuizManagement')}
      >
        <Ionicons 
          name={activeScreen === 'quiz' ? "help-circle" : "help-circle-outline"} 
          size={24} 
          color={activeScreen === 'quiz' ? Colors.primary : Colors.lightText} 
        />
        <Text 
          style={[
            styles.navText, 
            activeScreen === 'quiz' && styles.activeNavText
          ]}
        >
          Kuis
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('TeacherContributor')}
      >
        <Ionicons 
          name={activeScreen === 'contributor' ? "document-text" : "document-text-outline"} 
          size={24} 
          color={activeScreen === 'contributor' ? Colors.primary : Colors.lightText} 
        />
        <Text 
          style={[
            styles.navText, 
            activeScreen === 'contributor' && styles.activeNavText
          ]}
        >
          Kontributor
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.lightText,
  },
  activeNavText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Side navigation styles for desktop
  sideNavContainer: {
    width: 240,
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
    height: '100%',
  },
  sideNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeSideNavItem: {
    backgroundColor: Colors.primary + '10',
  },
  sideNavText: {
    fontSize: 16,
    marginLeft: 16,
    color: Colors.text,
  },
  activeSideNavText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default TeacherBottomNav; 