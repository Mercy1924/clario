import { THEME, BRAND } from './tokens';

/**
 * Clarios Color System
 * Integrated with design tokens for consistent theming
 */

export default {
  light: {
    text: THEME.light.text.primary,
    background: THEME.light.background,
    surface: THEME.light.surface,
    tint: BRAND.primary,
    tabIconDefault: '#999999',
    tabIconSelected: BRAND.primary,

    // Extended theme values
    textSecondary: THEME.light.text.secondary,
    textTertiary: THEME.light.text.tertiary,
    border: THEME.light.border.default,
    card: THEME.light.card.background,
  },
  dark: {
    text: THEME.dark.text.primary,
    background: THEME.dark.background,
    surface: THEME.dark.surface,
    tint: BRAND.primaryLight,
    tabIconDefault: '#666666',
    tabIconSelected: BRAND.primaryLight,

    // Extended theme values
    textSecondary: THEME.dark.text.secondary,
    textTertiary: THEME.dark.text.tertiary,
    border: THEME.dark.border.default,
    card: THEME.dark.card.background,
  },
};
