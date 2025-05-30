import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
}

export default function Text({ 
  children, 
  variant = 'body',
  className,
  ...props 
}: TextProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'h1':
        return 'text-3xl font-bold';
      case 'h2':
        return 'text-2xl font-semibold';
      case 'h3':
        return 'text-xl font-medium';
      case 'body':
        return 'text-base';
      case 'caption':
        return 'text-sm text-gray-500';
      default:
        return 'text-base';
    }
  };

  return (
    <RNText 
      className={`${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </RNText>
  );
} 