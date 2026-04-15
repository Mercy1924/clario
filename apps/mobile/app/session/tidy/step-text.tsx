import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../../../stores/session-store';

// Mock step data - in production this comes from the backend
const MOCK_STEP = {
  id: '1',
  step_order: 1,
  title: 'Clear the desk surface',
  substeps: [
    { id: '1a', title: 'Remove all items from the desk', completed: false },
    { id: '1b', title: 'Throw away any rubbish', completed: false },
    { id: '1c', title: 'Group remaining items by category', completed: false },
  ],
  time_estimate: 10,
  status: 'pending' as const,
  completed_at: null,
  created_at: new Date().toISOString(),
};

export default function StepTextScreen() {
  const router = useRouter();
  const { currentStepIndex, steps, advanceStep, completeStep } = useSessionStore();

  // For demo, use mock step
  const step = steps[currentStepIndex] || MOCK_STEP;
  const totalSteps = 5;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const [expanded, setExpanded] = React.useState(false);

  const handleDone = () => {
    completeStep();
    advanceStep();
    // In production, check if there's a next step
    router.push('/session/tidy/step-text');
  };

  const handleSkip = () => {
    advanceStep();
    router.push('/session/tidy/step-text');
  };

  const handleSwitchToVoice = () => {
    router.push('/session/tidy/step-voice');
  };

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.stepIndicator}>Step {currentStepIndex + 1} of {totalSteps}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Step Title */}
        <Text style={styles.stepTitle}>{step.title}</Text>

        {/* Time Estimate */}
        {step.time_estimate && (
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeText}>{step.time_estimate} minutes</Text>
          </View>
        )}

        {/* Substeps */}
        {step.substeps && step.substeps.length > 0 && (
          <View style={styles.substepsContainer}>
            <TouchableOpacity
              style={styles.substepsHeader}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.substepsTitle}>
                {expanded ? 'Hide substeps' : `Show ${step.substeps.length} substeps`}
              </Text>
              <Text style={styles.substepsChevron}>{expanded ? '↑' : '↓'}</Text>
            </TouchableOpacity>

            {expanded && (
              <View style={styles.substepsList}>
                {step.substeps.map((substep: { id: string; title: string; completed: boolean }, index: number) => (
                  <View key={substep.id} style={styles.substepItem}>
                    <View style={styles.substepNumber}>
                      <Text style={styles.substepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.substepText}>{substep.title}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip this step</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voiceSwitchButton} onPress={handleSwitchToVoice}>
          <Text style={styles.voiceSwitchButtonText}>Switch to voice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 32,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  substepsContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    overflow: 'hidden',
  },
  substepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  substepsTitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  substepsChevron: {
    fontSize: 18,
    color: '#666',
  },
  substepsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  substepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  substepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  substepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  substepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    paddingTop: 2,
  },
  actions: {
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    color: '#999',
    textDecorationLine: 'underline',
  },
  voiceSwitchButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  voiceSwitchButtonText: {
    fontSize: 15,
    color: '#0066cc',
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
