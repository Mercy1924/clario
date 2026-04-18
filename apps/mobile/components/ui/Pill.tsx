import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { FONT, SPACING, RADIUS, FONT_SIZE } from '@/constants/tokens';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

export type PillSize = 'sm' | 'md' | 'lg';

interface PillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: PillSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  testID?: string;
}

export const Pill: React.FC<PillProps> = ({
  label,
  selected = false,
  onPress,
  size = 'md',
  disabled = false,
  icon,
  testID,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
          minHeight: 32,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          minHeight: 40,
        };
      default: // md
        return {
          paddingVertical: SPACING.xs + 2,
          paddingHorizontal: SPACING.md,
          minHeight: 36,
        };
    }
  };

  const getTextStyles = () => ({
    fontFamily: FONT.family,
    fontWeight: selected ? FONT.medium : FONT.regular,
    fontSize: size === 'sm' ? FONT_SIZE.xs : FONT_SIZE.sm,
    color: selected ? '#FFFFFF' : theme.text,
  });

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.pill,
        getSizeStyles(),
        selected ? { backgroundColor: theme.tint } : { backgroundColor: theme.background },
        disabled && styles.disabled,
      ]}
      testID={testID}
    >
      {icon && icon}
      <Text style={getTextStyles()}>{label}</Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});
