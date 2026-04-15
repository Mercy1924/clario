import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../../../stores/session-store';
import { useVoiceStore } from '../../../stores/voice-store';

// Mock step data
const MOCK_STEP = {
  id: '1',
  step_order: 1,
  title: 'Clear the desk surface',
  transcript: 'Start by removing everything from the desk. Take each item and decide: keep it, move it, or throw it away. Work methodically from one side to the other.',
  annotated_image_url: 'https://via.placeholder.com/400x250',
};

export default function StepVoiceScreen() {
  const router = useRouter();
  const { speak, stopSpeaking, isSpeaking, transcript, setTranscript } = useVoiceStore();
  const { currentStepIndex, advanceStep, completeStep } = useSessionStore();

  const step = MOCK_STEP;

  useEffect(() => {
    // Auto-play voice guidance when screen loads
    const guidance = `${step.title}. ${step.transcript}`;
    speak(guidance);
    setTranscript(step.transcript);

    return () => {
      stopSpeaking();
    };
  }, []);

  const handleVoiceCommand = (command: 'done' | 'next' | 'repeat' | 'back') => {
    switch (command) {
      case 'done':
        completeStep();
        advanceStep();
        router.push('/session/tidy/complete');
        break;
      case 'next':
        advanceStep();
        router.push('/session/tidy/step-voice');
        break;
      case 'repeat':
        speak(`${step.title}. ${step.transcript}`);
        break;
      case 'back':
        router.back();
        break;
    }
  };

  const handleSwitchToText = () => {
    stopSpeaking();
    router.push('/session/tidy/step-text');
  };

  return (
    <View style={styles.container}>
      {/* Annotated Image */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            Annotated image highlighting desk area
          </Text>
        </View>
      </View>

      {/* Voice Content */}
      <View style={styles.content}>
        {/* Transcript */}
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>Current step:</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.transcript}>{transcript}</Text>
        </View>

        {/* Voice Status */}
        <View style={styles.voiceStatus}>
          {isSpeaking ? (
            <View style={styles.listeningIndicator}>
              <Text style={styles.listeningText}>🔊 Speaking...</Text>
            </View>
          ) : (
            <Text style={styles.voiceHint}>
              Say "Done", "Next", "Repeat", or "Go back"
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={() => handleVoiceCommand('done')}
        >
          <Text style={styles.micIcon}>🎤</Text>
          <Text style={styles.micText}>Tap to say "Done"</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleVoiceCommand('repeat')}
          >
            <Text style={styles.secondaryButtonText}>↺ Repeat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSwitchToText}
          >
            <Text style={styles.secondaryButtonText}>Switch to text</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: '55%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imagePlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e5e5e5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  transcriptContainer: {
    marginBottom: 24,
  },
  transcriptLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 28,
  },
  transcript: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  voiceStatus: {
    alignItems: 'center',
  },
  listeningIndicator: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  listeningText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  voiceHint: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    padding: 24,
    paddingBottom: 40,
  },
  micButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  micIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  micText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});
