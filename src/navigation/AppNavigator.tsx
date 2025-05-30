import React from 'react';
import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import Colors from '../constants/Colors';

// Import screens for each feature
import TranslateScreen from '../screens/TranslateScreen';
import StoriesScreen from '../screens/StoriesScreen';
import ExploreScreen from '../screens/ExploreScreen';
import QuizScreen from '../screens/QuizScreen';
import EduCenterScreen from '../screens/EduCenterScreen';

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

export default function AppNavigator() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  
  // If in desktop mode, use a simplified navigator with no tab bar
  if (Platform.OS === 'web' && isDesktop) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
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
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopColor: '#EEE',
            paddingTop: 5,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            height: Platform.OS === 'ios' ? 90 : 65,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                backgroundColor: focused ? '#E3F2FD' : 'transparent',
                padding: 8,
                borderRadius: 8
              }}>
                <Text style={{ fontSize: 20, color }}>🏠</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Translate" 
          component={TranslateStack} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                backgroundColor: focused ? '#E3F2FD' : 'transparent',
                padding: 8,
                borderRadius: 8
              }}>
                <Text style={{ fontSize: 20, color }}>🔤</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Stories" 
          component={StoriesStack} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                backgroundColor: focused ? '#E3F2FD' : 'transparent',
                padding: 8,
                borderRadius: 8
              }}>
                <Text style={{ fontSize: 20, color }}>📖</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Explore" 
          component={ExploreStack} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                backgroundColor: focused ? '#E3F2FD' : 'transparent',
                padding: 8,
                borderRadius: 8
              }}>
                <Text style={{ fontSize: 20, color }}>🌏</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Quiz" 
          component={QuizStack} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                backgroundColor: focused ? '#E3F2FD' : 'transparent',
                padding: 8,
                borderRadius: 8
              }}>
                <Text style={{ fontSize: 20, color }}>📝</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 