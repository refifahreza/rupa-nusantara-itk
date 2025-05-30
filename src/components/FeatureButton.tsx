import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  View
} from 'react-native';
import Colors from '../constants/Colors';

interface FeatureButtonProps {
  title: string;
  emoji: string;
  description?: string;
  onPress: () => void;
}

export default function FeatureButton({ title, emoji, description, onPress }: FeatureButtonProps) {
  // Web-specific className
  const webClassName = Platform.OS === 'web' 
    ? 'bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow' 
    : '';
    
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      className={webClassName}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.buttonBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  titleContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  title: {
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    color: Colors.lightText,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
}); 