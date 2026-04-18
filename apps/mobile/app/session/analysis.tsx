import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../../stores/session-store';
import { getMockAnalysis } from '../../lib/mocks';
import type { AnalysisFinding } from '../../types/clarios';

type Mode = 'tidy' | 'restructure';

export default function AnalysisScreen() {
  const router = useRouter();
  const {
    currentSpace,
    setCurrentAnalysis,
    setSelectedMode,
    currentSession,
  } = useSessionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<{
    annotatedImageUrl: string;
    findings: AnalysisFinding[];
    modeRecommendation: Mode;
    modeRationale: string;
    contextConfirmed: boolean;
  } | null>(null);

  useEffect(() => {
    // Simulate AI analysis with mock data
    const runAnalysis = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Use mock analysis (tidy mode as default for testing)
      const mockAnalysis = getMockAnalysis('tidy');

      setAnalysis({
        annotatedImageUrl: mockAnalysis.annotated_image_url || '',
        findings: mockAnalysis.findings,
        modeRecommendation: mockAnalysis.mode_recommendation || 'tidy',
        modeRationale: mockAnalysis.mode_rationale || '',
        contextConfirmed: mockAnalysis.context_confirmed,
      });

      setIsLoading(false);
    };

    runAnalysis();
  }, []);

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);

    // Save analysis to store
    if (analysis && currentSession) {
      setCurrentAnalysis({
        id: `analysis-${Date.now()}`,
        session_id: currentSession.id,
        annotated_image_url: analysis.annotatedImageUrl,
        findings: analysis.findings,
        mode_recommendation: analysis.modeRecommendation,
        mode_rationale: analysis.modeRationale,
        context_confirmed: analysis.contextConfirmed,
        created_at: new Date().toISOString(),
      });
    }

    if (mode === 'tidy') {
      router.push('/session/tidy/mode-select');
    } else {
      router.push('/session/restructure/generating');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={styles.loadingText}>Looking at your space...</Text>
      </View>
    );
  }

  if (!analysis) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Space Analysis</Text>
      </View>

      {/* Annotated Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            Annotated photo would appear here
          </Text>
          <Text style={styles.imageSubtext}>
            Items and areas circled and labelled
          </Text>
        </View>
      </View>

      {/* Context Confirmed */}
      {analysis.contextConfirmed && currentSpace?.type && (
        <View style={styles.contextRow}>
          <Text style={styles.contextLabel}>Confirmed from your description:</Text>
          <View style={styles.contextPills}>
            {currentSpace.type && (
              <View style={styles.contextPill}>
                <Text style={styles.contextPillText}>{currentSpace.type}</Text>
              </View>
            )}
            {currentSpace.goal && (
              <View style={styles.contextPill}>
                <Text style={styles.contextPillText}>{currentSpace.goal}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Findings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What we found</Text>
        {analysis.findings.map((finding) => (
          <View key={finding.id} style={styles.findingCard}>
            <View style={styles.findingHeader}>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor(finding.severity) },
                ]}
              />
              <Text style={styles.findingLabel}>{finding.label}</Text>
            </View>
            <Text style={styles.findingDescription}>{finding.description}</Text>
          </View>
        ))}
      </View>

      {/* Mode Recommendation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended: Tidy Mode</Text>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationText}>{analysis.modeRationale}</Text>
        </View>
      </View>

      {/* Mode Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How would you like to proceed?</Text>

        <TouchableOpacity
          style={[
            styles.modeCard,
            analysis.modeRecommendation === 'tidy' &&
              styles.modeCardRecommended,
          ]}
          onPress={() => handleModeSelect('tidy')}
        >
          <View style={styles.modeCardHeader}>
            <Text style={styles.modeCardIcon}>🟢</Text>
            <Text style={styles.modeCardTitle}>Tidy Mode</Text>
          </View>
          <Text style={styles.modeCardDescription}>
            Declutter, clean, and organise what's already there
          </Text>
          <Text style={styles.modeCardFeature}>Includes voice guidance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeCard,
            analysis.modeRecommendation === 'restructure' &&
              styles.modeCardRecommended,
          ]}
          onPress={() => handleModeSelect('restructure')}
        >
          <View style={styles.modeCardHeader}>
            <Text style={styles.modeCardIcon}>🟡</Text>
            <Text style={styles.modeCardTitle}>Restructure Mode</Text>
          </View>
          <Text style={styles.modeCardDescription}>
            Rethink the layout, reposition furniture, optimise the space
          </Text>
          <Text style={styles.modeCardFeature}>Includes before/after diagram</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  imageContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 15,
  },
  imageSubtext: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
  },
  contextRow: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  contextLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  contextPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  contextPill: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  contextPillText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  findingCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  findingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  findingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  findingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modeCard: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  modeCardRecommended: {
    borderColor: '#1a1a1a',
    backgroundColor: '#fff',
  },
  modeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  modeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modeCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  modeCardFeature: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  },
});
