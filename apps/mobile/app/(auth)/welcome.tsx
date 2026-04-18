import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithGoogle, signInWithApple } from '../../lib/supabase';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google sign in error:', error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSignInWithApple = async () => {
    try {
      const { error } = await signInWithApple();
      if (error) {
        console.error('Apple sign in error:', error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleContinueWithoutAuth = () => {
    // For development/demo - in production auth is required
    router.replace('/(tabs)/index');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🏠</Text>
        </View>
        <Text style={styles.appName}>Clarios</Text>
      </View>

      {/* Value Proposition */}
      <View style={styles.valueProp}>
        <Text style={styles.valuePropText}>
          Your calm, directive assistant for{' '}
        </Text>
        <Text style={styles.valuePropBold}>
          transforming spaces, one step at a time.
        </Text>
      </View>

      {/* Auth Buttons */}
      <View style={styles.authButtons}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={handleSignInWithGoogle}
        >
          <Text style={styles.authButtonIcon}>G</Text>
          <Text style={styles.authButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.authButton}
          onPress={handleSignInWithApple}
        >
          <Text style={styles.authButtonIcon}></Text>
          <Text style={styles.authButtonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Continue without auth (for demo) */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinueWithoutAuth}
      >
        <Text style={styles.continueButtonText}>Continue without signing in</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f7ff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  valueProp: {
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  valuePropText: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  valuePropBold: {
    fontSize: 17,
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  authButtons: {
    gap: 12,
    marginBottom: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 12,
  },
  authButtonIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  continueButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    color: '#666',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
