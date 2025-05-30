import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp as TabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  BottomTabs: undefined;
  Settings: undefined;
  HomeScreen: undefined;
  TranslateScreen: undefined;
  DailyVocabulary: undefined;
  BookmarkedWords: undefined;
  StoriesScreen: undefined;
  StoryDetail: { storyId: string };
  VoiceHeritage: undefined;
  ExploreScreen: undefined;
  RegionDetail: { regionId: string };
  SurvivalPhrases: undefined;
  QuizScreen: undefined;
  PictureQuiz: undefined;
  ConversationQuiz: undefined;
  DailyChallenge: undefined;
  Leaderboard: undefined;
  Badges: undefined;
  EduCenterScreen: undefined;
  LearningModules: { moduleId: string };
  StudentStats: undefined;
  DownloadContent: undefined;
  CurriculumIntegration: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  Translate: undefined;
  Stories: undefined;
  Explore: undefined;
  Quiz: undefined;
  EduCenter: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type BottomTabNavigationProp = TabNavigationProp<BottomTabParamList>; 