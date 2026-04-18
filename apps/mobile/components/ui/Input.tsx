import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { FONT, SPACING, RADIUS, FONT_SIZE } from '@/constants/tokens';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  testID?: string;
  autoFocus?: boolean;
  keyboardType?: React Native.TextInputProps['keyboardType'];
  autoCapitalize?: React Native.TextInputProps['autoCapitalize'];
  returnKeyType?: React Native.TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  multiline = false,
  numberOfLines,
  secureTextEntry = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  testID,
  autoFocus,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const borderColor = error
    ? theme.tint // Could use semantic.error color
    : isFocused
    ? theme.tint
    : theme.border;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.input?.background || theme.surface,
            borderColor,
          },
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              fontFamily: FONT.family,
              fontSize: FONT_SIZE.md,
            },
            multiline && styles.multiline,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.input?.placeholder || theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry && !showPassword}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          testID={testID}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconRight}
          >
            <Text style={{ color: theme.textSecondary }}>
              {showPassword ? '👁' : '👁‍🗨'}
            </Text>
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconRight}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            { color: error ? theme.tint : theme.textSecondary }, // Could use semantic.error
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: FONT.family,
    fontWeight: FONT.medium,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    minHeight: 48, // Touch target
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  multiline: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  iconLeft: {
    marginRight: SPACING.xs,
  },
  iconRight: {
    marginLeft: SPACING.xs,
  },
  disabled: {
    opacity: 0.5,
  },
  helperText: {
    fontFamily: FONT.family,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});
