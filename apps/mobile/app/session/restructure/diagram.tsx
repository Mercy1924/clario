import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function DiagramScreen() {
  const router = useRouter();
  const [showAlternative, setShowAlternative] = useState(false);

  const handleAccept = () => {
    router.push('/session/restructure/step');
  };

  const handleRequestAlternative = () => {
    setShowAlternative(true);
    // In production: call API to generate alternative layout
    setTimeout(() => {
      setShowAlternative(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Layout Plan</Text>
        <Text style={styles.subtitle}>Review before and after arrangement</Text>
      </View>

      {/* Before/After Diagram */}
      <View style={styles.diagramContainer}>
        <View style={styles.diagramPanel}>
          <Text style={styles.diagramLabel}>Current</Text>
          <View style={styles.diagramPlaceholder}>
            <Text style={styles.diagramPlaceholderText}>
              Current layout SVG
            </Text>
            <Text style={styles.diagramSubtext}>
              Furniture positions as captured
            </Text>
          </View>
        </View>

        <View style={styles.diagramArrow}>
          <Text style={styles.diagramArrowText}>→</Text>
        </View>

        <View style={styles.diagramPanel}>
          <Text style={styles.diagramLabel}>Suggested</Text>
          <View style={styles.diagramPlaceholder}>
            <Text style={styles.diagramPlaceholderText}>
              Suggested layout SVG
            </Text>
            <Text style={styles.diagramSubtext}>
              Optimised arrangement
            </Text>
          </View>
        </View>
      </View>

      {/* Key Changes */}
      <View style={styles.changesContainer}>
        <Text style={styles.changesTitle}>Key changes:</Text>
        <View style={styles.changeItem}>
          <View style={styles.changeDot} />
          <Text style={styles.changeText}>Desk → North wall (better light)</Text>
        </View>
        <View style={styles.changeItem}>
          <View style={styles.changeDot} />
          <Text style={styles.changeText}>Chair → Angled for ergonomics</Text>
        </View>
        <View style={styles.changeItem}>
          <View style={styles.changeDot} />
          <Text style={styles.changeText}>Storage → Under window</Text>
        </View>
      </View>

      {/* Note about voice mode */}
      <View style={styles.voiceNote}>
        <Text style={styles.voiceNoteIcon}>ℹ️</Text>
        <Text style={styles.voiceNoteText}>
          Voice mode is not available in Restructure mode. Steps require visual reference to the diagram.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.alternativeButton}
          onPress={handleRequestAlternative}
          disabled={showAlternative}
        >
          <Text style={styles.alternativeButtonText}>
            {showAlternative ? 'Generating...' : 'Request alternative'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptButtonText}>Accept plan</Text>
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
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 16,
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
  diagramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  diagramPanel: {
    flex: 1,
    maxWidth: 150,
  },
  diagramLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  diagramPlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    padding: 12,
  },
  diagramPlaceholderText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  diagramSubtext: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  diagramArrow: {
    width: 40,
    alignItems: 'center',
  },
  diagramArrowText: {
    fontSize: 24,
    color: '#1a1a1a',
  },
  changesContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  changesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffaa00',
    marginRight: 10,
  },
  changeText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  voiceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  voiceNoteIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  voiceNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actions: {
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  alternativeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
  },
  alternativeButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
