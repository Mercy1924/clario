import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SPACING, RADIUS, SHADOW } from '@/constants/tokens';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'lg',
  style,
  onPress,
  testID,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      backgroundColor: theme.card,
      borderRadius: RADIUS.xl,
      overflow: 'hidden',
    };

    // Padding
    if (padding === 'sm') {
      baseStyles.padding = SPACING.sm;
    } else if (padding === 'md') {
      baseStyles.padding = SPACING.md;
    } else if (padding === 'lg') {
      baseStyles.padding = SPACING.lg;
    }
    // 'none' skips padding

    // Variant styles
    switch (variant) {
      case 'elevated':
        baseStyles.shadowColor = SHADOW.md.shadowColor;
        baseStyles.shadowOffset = SHADOW.md.shadowOffset;
        baseStyles.shadowOpacity = SHADOW.md.shadowOpacity;
        baseStyles.shadowRadius = SHADOW.md.shadowRadius;
        baseStyles.elevation = SHADOW.md.elevation;
        break;
      case 'outlined':
        baseStyles.borderWidth = 1;
        baseStyles.borderColor = theme.border;
        break;
      case 'interactive':
        baseStyles.shadowColor = SHADOW.sm.shadowColor;
        baseStyles.shadowOffset = SHADOW.sm.shadowOffset;
        baseStyles.shadowOpacity = SHADOW.sm.shadowOpacity;
        baseStyles.shadowRadius = SHADOW.sm.shadowRadius;
        baseStyles.elevation = SHADOW.sm.elevation;
        break;
      default:
        baseStyles.borderWidth = 1;
        baseStyles.borderColor = theme.border;
    }

    return { ...baseStyles, ...style };
  };

  if (onPress) {
    return (
      <View
        style={getCardStyles()}
        testID={testID}
        // Touchable handling would go here with TouchableOpacity wrapper
      >
        {children}
      </View>
    );
  }

  return (
    <View style={getCardStyles()} testID={testID}>
      {children}
    </View>
  );
}
