import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FONT, SPACING, RADIUS, FONT_SIZE, SHADOW, LETTER_SPACING } from '@/constants/tokens';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  testID,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.lg,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      minHeight: 48, // Touch target minimum
    };

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyles.backgroundColor = theme.tint;
        break;
      case 'secondary':
        baseStyles.backgroundColor = 'transparent';
        baseStyles.borderWidth = 1;
        baseStyles.borderColor = theme.tint;
        break;
      case 'ghost':
        baseStyles.backgroundColor = 'transparent';
        break;
      case 'outline':
        baseStyles.backgroundColor = 'transparent';
        baseStyles.borderWidth = 1;
        baseStyles.borderColor = theme.border;
        break;
    }

    // Size adjustments
    if (size === 'sm') {
      baseStyles.paddingHorizontal = SPACING.md;
      baseStyles.paddingVertical = SPACING.sm;
      baseStyles.minHeight = 40;
    } else if (size === 'lg') {
      baseStyles.paddingHorizontal = SPACING.xl;
      baseStyles.paddingVertical = SPACING.lg;
      baseStyles.minHeight = 56;
    }

    // Full width
    if (fullWidth) {
      baseStyles.width = '100%';
    }

    // Disabled state
    if (disabled) {
      baseStyles.opacity = 0.5;
    }

    return { ...baseStyles, ...style };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontFamily: FONT.family,
      fontWeight: FONT.medium,
      fontSize: size === 'sm' ? FONT_SIZE.sm : FONT_SIZE.md,
      letterSpacing: LETTER_SPACING.wide,
    };

    // Variant text colors
    switch (variant) {
      case 'primary':
        baseStyles.color = '#FFFFFF';
        break;
      case 'secondary':
      case 'outline':
        baseStyles.color = theme.tint;
        break;
      case 'ghost':
        baseStyles.color = theme.text;
        break;
    }

    // Disabled state
    if (disabled) {
      baseStyles.color = theme.textSecondary;
    }

    return { ...baseStyles, ...textStyle };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), disabled && styles.disabled]}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : theme.tint}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyles()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
