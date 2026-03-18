import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
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
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#00d9ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#050812',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#00d9ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00d9ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureGrid: {
    gap: 12,
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d9ff',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff006e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  footer: {
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const { insights } = useArenaStore();

  return (
    <LinearGradient
      colors={['#050812', '#0a0e27', '#050812']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚔️ THE ARENA</Text>
          <Text style={styles.subtitle}>Unified Cognitive Operating System</Text>
          <Text style={styles.description}>
            Submit a thought, get quad-exposure responses from 4 AI models, publish instantly, and claim seniority on blockchain.
          </Text>
        </View>

        {/* Primary Actions */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/lab');
            }}
            activeOpacity={0.8}
            accessibilityLabel="Enter The Lab"
            accessibilityHint="Opens the AI quad-exposure lab"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>🧪 Enter The Lab</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/history');
            }}
            activeOpacity={0.8}
            accessibilityLabel="View History"
            accessibilityHint={`View ${insights.length} saved insights`}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>📜 View History ({insights.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🧠</Text>
            <Text style={styles.featureTitle}>Quad-Exposure</Text>
            <Text style={styles.featureDesc}>4 AI models simultaneously</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📤</Text>
            <Text style={styles.featureTitle}>Multi-Channel</Text>
            <Text style={styles.featureDesc}>Twitter, Substack, Email</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔗</Text>
            <Text style={styles.featureTitle}>Blockchain</Text>
            <Text style={styles.featureDesc}>Solana & Base seniority</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>AI Models</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Channels</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Blockchains</Text>
          </View>
        </View>

        {/* Settings */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/settings');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Built by NO_GAS_LABS™</Text>
          <Text style={styles.footerText}>The future of thought is collaborative</Text>
          <Text style={[styles.footerText, { marginTop: 8, opacity: 0.5 }]}>
            v{Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
