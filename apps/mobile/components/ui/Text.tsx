import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { FONT, FONT_SIZE, LINE_HEIGHT, LETTER_SPACING } from '@/constants/tokens';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

export type TextVariant = 'default' | 'heading' | 'title' | 'body' | 'caption' | 'label';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: TextStyle;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'default',
  size,
  weight = 'regular',
  color,
  align = 'left',
  style,
  numberOfLines,
  adjustsFontSizeToFit,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontFamily: FONT.family,
      color: color || theme.text,
      textAlign: align,
    };

    // Size from variant or explicit size prop
    const fontSize = size || getFontSizeForVariant(variant);
    baseStyles.fontSize = FONT_SIZE[fontSize] || FONT_SIZE.md;

    // Weight
    baseStyles.fontWeight = FONT[weight] || FONT.regular;

    // Line height based on variant
    baseStyles.lineHeight = LINE_HEIGHT[variant === 'heading' ? 'tight' : 'base'];

    // Letter spacing for headers
    if (variant === 'heading' || variant === 'title') {
      baseStyles.letterSpacing = LETTER_SPACING.tight;
    }

    return baseStyles;
  };

  return (
    <RNText
      style={[getTextStyles(), style]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
    >
      {children}
    </RNText>
  );
};

function getFontSizeForVariant(variant: TextVariant): keyof typeof FONT_SIZE {
  switch (variant) {
    case 'heading':
      return '3xl';
    case 'title':
      return 'xl';
    case 'body':
      return 'md';
    case 'caption':
      return 'xs';
    case 'label':
      return 'sm';
    default:
      return 'md';
  }
}
