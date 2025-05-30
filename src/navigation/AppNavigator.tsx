import React, { useState, useEffect } from 'react';
import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import Colors from '../constants/Colors';

// Import screens for each feature
import TranslateScreen from '../screens/TranslateScreen';
import StoriesScreen from '../screens/StoriesScreen';
import ExploreScreen from '../screens/ExploreScreen';
import QuizScreen from '../screens/QuizScreen';
import EduCenterScreen from '../screens/EduCenterScreen';

// Import new auth screens
import LoginScreen from '../screens/LoginScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import TeacherDashboardScreen from '../screens/TeacherDashboardScreen';
import TeacherQuizManagementScreen from '../screens/TeacherQuizManagementScreen';
import TeacherContributorScreen from '../screens/TeacherContributorScreen';
import CreateQuizScreen from '../screens/CreateQuizScreen';

// Import Language Office screens
import LanguageOfficeDashboardScreen from '../screens/LanguageOfficeDashboardScreen';
import ContentValidationScreen from '../screens/ContentValidationScreen';
import LanguageManagementScreen from '../screens/LanguageManagementScreen';
import UserCommunityScreen from '../screens/UserCommunityScreen';
import ReportsExportScreen from '../screens/ReportsExportScreen';

// Import auth utilities
import { isAuthenticated, getUserRole } from '../utils/auth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define stack navigators for each main feature
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function TranslateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TranslateScreen" component={TranslateScreen} />
      <Stack.Screen name="DailyVocabulary" component={TranslateScreen} />
      <Stack.Screen name="BookmarkedWords" component={TranslateScreen} />
    </Stack.Navigator>
  );
}

function StoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoriesScreen" component={StoriesScreen} />
      <Stack.Screen name="StoryDetail" component={StoriesScreen} />
      <Stack.Screen name="VoiceHeritage" component={StoriesScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
      <Stack.Screen name="RegionDetail" component={ExploreScreen} />
      <Stack.Screen name="SurvivalPhrases" component={ExploreScreen} />
    </Stack.Navigator>
  );
}

function QuizStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="PictureQuiz" component={QuizScreen} />
      <Stack.Screen name="ConversationQuiz" component={QuizScreen} />
      <Stack.Screen name="DailyChallenge" component={QuizScreen} />
      <Stack.Screen name="Leaderboard" component={QuizScreen} />
      <Stack.Screen name="Badges" component={QuizScreen} />
    </Stack.Navigator>
  );
}

// Student dashboard tab navigator
function StudentDashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#EEE',
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={StudentDashboardScreen} 
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Translate" 
        component={TranslateStack} 
        options={{
          tabBarLabel: "Terjemahan",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="translate" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Stories" 
        component={StoriesStack} 
        options={{
          tabBarLabel: "Cerita",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizStack} 
        options={{
          tabBarLabel: "Kuis",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="assignment" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Teacher dashboard stack navigator
function TeacherDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
      <Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
    </Stack.Navigator>
  );
}

// Teacher quiz management stack navigator
function TeacherQuizManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherQuizManagement" component={TeacherQuizManagementScreen} />
      <Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
    </Stack.Navigator>
  );
}

// Teacher dashboard tab navigator
function TeacherDashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="TeacherDashboard"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#EEE',
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen 
        name="TeacherDashboard" 
        component={TeacherDashboardStack}
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="TeacherQuizManagement" 
        component={TeacherQuizManagementStack}
        options={{
          tabBarLabel: "Kuis",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "help-circle" : "help-circle-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="TeacherContributor" 
        component={TeacherContributorScreen} 
        options={{
          tabBarLabel: "Kontributor",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "document-text" : "document-text-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Language Office dashboard stack navigators
function LanguageOfficeDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LanguageOfficeDashboard" component={LanguageOfficeDashboardScreen} />
    </Stack.Navigator>
  );
}

function ContentValidationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContentValidation" component={ContentValidationScreen} />
    </Stack.Navigator>
  );
}

function LanguageManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LanguageManagement" component={LanguageManagementScreen} />
    </Stack.Navigator>
  );
}

function UserCommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserCommunity" component={UserCommunityScreen} />
    </Stack.Navigator>
  );
}

function ReportsExportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsExport" component={ReportsExportScreen} />
    </Stack.Navigator>
  );
}

// Language Office dashboard tab navigator
function LanguageOfficeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="LanguageOfficeDashboard"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#EEE',
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen 
        name="LanguageOfficeDashboard" 
        component={LanguageOfficeDashboardStack}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ContentValidation" 
        component={ContentValidationStack}
        options={{
          tabBarLabel: "Validasi Konten",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="check-circle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="LanguageManagement" 
        component={LanguageManagementStack}
        options={{
          tabBarLabel: "Manajemen Bahasa",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="language" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="UserCommunity" 
        component={UserCommunityStack}
        options={{
          tabBarLabel: "Pengguna & Komunitas",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="people" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ReportsExport" 
        component={ReportsExportStack}
        options={{
          tabBarLabel: "Ekspor & Laporan",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="description" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Auth navigator with login flow
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="StudentDashboard" component={StudentDashboardTabs} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardTabs} />
      <Stack.Screen name="LanguageOfficeDashboard" component={LanguageOfficeTabs} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [initialRoute, setInitialRoute] = useState('Main');
  
  // Check if user is authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const userRole = getUserRole();
        if (userRole === 'student') {
          setInitialRoute('StudentDashboard');
        } else if (userRole === 'teacher') {
          setInitialRoute('TeacherDashboard');
        } else if (userRole === 'languageOffice') {
          setInitialRoute('LanguageOfficeDashboard');
        }
      }
    };
    
    checkAuth();
  }, []);
  
  // If in desktop mode, use a simplified navigator with no tab bar
  if (Platform.OS === 'web' && isDesktop) {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute === 'Main' ? 'Home' : initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboardTabs} />
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboardTabs} />
          <Stack.Screen name="LanguageOfficeDashboard" component={LanguageOfficeTabs} />
          <Stack.Screen name="Translate" component={TranslateScreen} />
          <Stack.Screen name="Stories" component={StoriesScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="EduCenter" component={EduCenterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboardTabs} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboardTabs} />
        <Stack.Screen name="LanguageOfficeDashboard" component={LanguageOfficeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main tab navigator for public screens
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#EEE',
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Translate" 
        component={TranslateStack} 
        options={{
          tabBarLabel: "Terjemahan",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="translate" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreStack} 
        options={{
          tabBarLabel: "Jelajah Daerah",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="map" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Stories" 
        component={StoriesStack} 
        options={{
          tabBarLabel: "Cerita & Warisan",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="book" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 