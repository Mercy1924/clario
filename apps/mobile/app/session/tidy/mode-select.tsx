import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../../../stores/session-store';

export default function ModeSelectScreen() {
  const router = useRouter();

  const handleSelectText = () => {
    // Navigate to first step with text mode
    router.push('/session/tidy/step-text');
  };

  const handleSelectVoice = () => {
    // Navigate to first step with voice mode
    router.push('/session/tidy/step-voice');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>How would you like guidance?</Text>
        <Text style={styles.subtitle}>You can switch modes at any time</Text>
      </View>

      <TouchableOpacity style={styles.optionCard} onPress={handleSelectText}>
        <View style={styles.optionIcon}>
          <Text style={styles.optionEmoji}>📖</Text>
        </View>
        <Text style={styles.optionTitle}>Read the steps</Text>
        <Text style={styles.optionDescription}>
          Text-based guidance with collapsible substeps and time estimates
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionCard} onPress={handleSelectVoice}>
        <View style={styles.optionIcon}>
          <Text style={styles.optionEmoji}>🎤</Text>
        </View>
        <Text style={styles.optionTitle}>Talk me through it</Text>
        <Text style={styles.optionDescription}>
          Voice guidance that reads steps aloud with hands-free interaction
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  optionCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 24,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  optionIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#f0f0f0',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});
