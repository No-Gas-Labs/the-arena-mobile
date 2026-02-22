import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useArenaStore } from '@/store/useArenaStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050812',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 20,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#00d9ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#00d9ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  insightCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d9ff',
  },
  promptText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 8,
  },
  promptContent: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 20,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  stat: {
    fontSize: 11,
    color: '#a0a0a0',
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  responsePreview: {
    backgroundColor: '#0a0e27',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  responsePreviewText: {
    fontSize: 12,
    color: '#a0a0a0',
    lineHeight: 18,
  },
  publishedBadge: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  publishedBadgeText: {
    fontSize: 10,
    color: '#050812',
    fontWeight: 'bold',
  },
});

export default function HistoryScreen() {
  const router = useRouter();
  const { insights } = useArenaStore();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (insights.length === 0) {
    return (
      <LinearGradient
        colors={['#050812', '#0a0e27', '#050812']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>📜 History</Text>
          </View>

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No insights yet</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/lab')}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>Go to The Lab</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#050812', '#0a0e27', '#050812']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📜 History</Text>
          <Text style={{ color: '#a0a0a0', fontSize: 12 }}>{insights.length} insights</Text>
        </View>

        {insights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <Text style={styles.promptText}>💭 Prompt</Text>
            <Text style={styles.promptContent} numberOfLines={2}>
              {insight.prompt}
            </Text>

            <View style={styles.statsRow}>
              <Text style={styles.stat}>🤖 {insight.responses.length} responses</Text>
              <Text style={styles.stat}>⏱️ {insight.timestamp}</Text>
            </View>

            <Text style={styles.timestamp}>{formatDate(insight.timestamp)}</Text>

            {insight.responses.length > 0 && (
              <View style={styles.responsePreview}>
                <Text style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>
                  {insight.responses[0].model}
                </Text>
                <Text style={styles.responsePreviewText} numberOfLines={2}>
                  {insight.responses[0].output}
                </Text>
              </View>
            )}

            {insight.publishedTo && insight.publishedTo.length > 0 && (
              <View style={styles.publishedBadge}>
                <Text style={styles.publishedBadgeText}>
                  ✓ Published to {insight.publishedTo.join(', ')}
                </Text>
              </View>
            )}

            {insight.blockchainHash && (
              <View style={styles.publishedBadge}>
                <Text style={styles.publishedBadgeText}>
                  🔗 {insight.blockchainHash.substring(0, 12)}...
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
