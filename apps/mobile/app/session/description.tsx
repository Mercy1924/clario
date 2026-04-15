import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../../stores/session-store';

const SPACE_TYPES = ['Bedroom', 'Living Room', 'Home Office', 'Kitchen', 'Study', 'Other'] as const;
const MODE_PREFERENCES = ['Tidy', 'Restructure', 'AI decides'] as const;

type SpaceType = typeof SPACE_TYPES[number];
type ModePreference = typeof MODE_PREFERENCES[number];

export default function DescriptionScreen() {
  const router = useRouter();
  const { setCurrentSpace } = useSessionStore();

  const [inputMethod, setInputMethod] = useState<'type' | 'speak'>('type');
  const [spaceType, setSpaceType] = useState<SpaceType | null>(null);
  const [goal, setGoal] = useState('');
  const [modePreference, setModePreference] = useState<ModePreference>('AI decides');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleSkip = () => {
    // Save empty space data and proceed to capture
    setCurrentSpace({
      id: '',
      session_id: '',
      name: null,
      type: null,
      goal: null,
      description_method: 'skipped',
      images: [],
      created_at: new Date().toISOString(),
    });
    router.push('/session/capture');
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false);
      // In production, this would capture the voice transcript
      // For now, we'll just use placeholder text
      setTranscript('This is my bedroom, I want more space to work');
    } else {
      setIsRecording(true);
      // In production, this would start recording
    }
  };

  const handleSubmit = () => {
    const finalGoal = inputMethod === 'speak' ? transcript : goal;

    setCurrentSpace({
      id: '',
      session_id: '',
      name: null,
      type: spaceType || null,
      goal: finalGoal || null,
      description_method: inputMethod,
      images: [],
      created_at: new Date().toISOString(),
    });
    router.push('/session/capture');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Before we look...</Text>
        <Text style={styles.subtitle}>Tell us about your space (optional)</Text>
      </View>

      {/* Input Method Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, inputMethod === 'type' && styles.toggleButtonActive]}
          onPress={() => setInputMethod('type')}
        >
          <Text style={[styles.toggleText, inputMethod === 'type' && styles.toggleTextActive]}>
            Type
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, inputMethod === 'speak' && styles.toggleButtonActive]}
          onPress={() => setInputMethod('speak')}
        >
          <Text style={[styles.toggleText, inputMethod === 'speak' && styles.toggleTextActive]}>
            Speak
          </Text>
        </TouchableOpacity>
      </View>

      {/* Type Input */}
      {inputMethod === 'type' && (
        <View style={styles.form}>
          {/* Space Type Pills */}
          <Text style={styles.label}>What type of space is this?</Text>
          <View style={styles.pillContainer}>
            {SPACE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.pill, spaceType === type && styles.pillActive]}
                onPress={() => setSpaceType(type)}
              >
                <Text style={[styles.pillText, spaceType === type && styles.pillTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Goal Input */}
          <Text style={styles.label}>What do you want to achieve?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., more space to work, less clutter"
            placeholderTextColor="#999"
            value={goal}
            onChangeText={setGoal}
            multiline
          />

          {/* Mode Preference */}
          <Text style={styles.label}>How should we help?</Text>
          <View style={styles.pillContainer}>
            {MODE_PREFERENCES.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.pill, modePreference === mode && styles.pillActive]}
                onPress={() => setModePreference(mode)}
              >
                <Text style={[styles.pillText, modePreference === mode && styles.pillTextActive]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Speak Input */}
      {inputMethod === 'speak' && (
        <View style={styles.voiceContainer}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={handleVoiceInput}
          >
            {isRecording ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.micIcon}>🎤</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.voiceInstruction}>
            {isRecording ? 'Tap to stop' : 'Tap and describe your space'}
          </Text>

          {transcript ? (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptLabel}>Transcript:</Text>
              <Text style={styles.transcript}>{transcript}</Text>
              <TouchableOpacity onPress={() => setTranscript('')}>
                <Text style={styles.clearTranscript}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, (!goal && !transcript) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!goal && !transcript}
      >
        <Text style={styles.submitButtonText}>Capture my space</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    marginBottom: 24,
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  pillActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  pillText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  voiceContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  micButtonActive: {
    backgroundColor: '#ff4444',
  },
  micIcon: {
    fontSize: 32,
  },
  voiceInstruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  transcriptContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  transcriptLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  transcript: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  clearTranscript: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
