import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Get the session from the URL params
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to complete sign in');
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log('Auth successful, navigating to home');
          router.replace('/(tabs)/index');
        } else {
          // No session found - user may have cancelled
          console.log('No session found, returning to welcome');
          router.replace('/(auth)/welcome');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An unexpected error occurred');
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </View>
      ) : (
        <>
          <ActivityIndicator size="large" color="#1a1a1a" />
          <p style={styles.text}>Completing sign in...</p>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
});
