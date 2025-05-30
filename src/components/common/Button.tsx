import React from 'react';
import { 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  ActivityIndicator 
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'outline':
        return 'bg-transparent border border-primary';
      default:
        return 'bg-primary';
    }
  };

  const getTextClass = () => {
    return variant === 'outline' ? 'text-primary' : 'text-white';
  };

  return (
    <TouchableOpacity
      className={`rounded-lg py-3 px-4 items-center justify-center ${getButtonClass()} ${disabled || loading ? 'opacity-70' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3498db' : '#ffffff'} />
      ) : (
        <Text className={`font-medium ${getTextClass()}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
} 