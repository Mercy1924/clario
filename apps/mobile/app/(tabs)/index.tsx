import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleNewSession = () => {
    router.push('/session/description');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Clarios</Text>
        <Text style={styles.subtitle}>One step at a time. One room at a time.</Text>
      </View>

      {/* New Session Card */}
      <TouchableOpacity style={styles.newSessionCard} onPress={handleNewSession}>
        <View style={styles.newSessionIcon}>
          <Text style={styles.newSessionEmoji}>📸</Text>
        </View>
        <View style={styles.newSessionContent}>
          <Text style={styles.newSessionTitle}>New Session</Text>
          <Text style={styles.newSessionDescription}>
            Scan a space and get guided steps to improve it
          </Text>
        </View>
        <View style={styles.newSessionArrow}>
          <Text style={styles.newSessionArrowText}>→</Text>
        </View>
      </TouchableOpacity>

      {/* Recent Sessions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📭</Text>
          <Text style={styles.emptyStateText}>No sessions yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start your first session to see it here
          </Text>
        </View>
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
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  newSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  newSessionIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#333',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newSessionEmoji: {
    fontSize: 28,
  },
  newSessionContent: {
    flex: 1,
    marginLeft: 16,
  },
  newSessionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  newSessionDescription: {
    fontSize: 14,
    color: '#ccc',
  },
  newSessionArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newSessionArrowText: {
    fontSize: 20,
    color: '#fff',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  seeAllText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
  },
  bottomPadding: {
    height: 40,
  },
});
