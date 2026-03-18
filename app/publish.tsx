import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useArenaStore, Response } from '@/store/useArenaStore';
import * as Haptics from 'expo-haptics';

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
  responseCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00d9ff',
  },
  modelBadge: {
    backgroundColor: '#00d9ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  modelText: {
    color: '#050812',
    fontSize: 12,
    fontWeight: 'bold',
  },
  responseText: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  channelGrid: {
    gap: 12,
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  channelButtonSelected: {
    borderColor: '#00d9ff',
  },
  channelIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 2,
  },
  channelDesc: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  channelCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00d9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelCheckText: {
    color: '#050812',
    fontSize: 14,
    fontWeight: 'bold',
  },
  blockchainSection: {
    marginBottom: 24,
  },
  blockchainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ff006e',
    marginBottom: 12,
  },
  blockchainIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  blockchainInfo: {
    flex: 1,
  },
  blockchainName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff006e',
    marginBottom: 2,
  },
  blockchainDesc: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  publishButton: {
    backgroundColor: '#00d9ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  publishButtonText: {
    color: '#050812',
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimButton: {
    backgroundColor: '#ff006e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 8, 18, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#00d9ff',
    fontSize: 16,
    marginTop: 12,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
  },
});

const CHANNELS = [
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', desc: 'Post to your timeline' },
  { id: 'substack', name: 'Substack', icon: '📝', desc: 'Publish as article' },
  { id: 'email', name: 'Email', icon: '📧', desc: 'Send newsletter' },
];

const BLOCKCHAINS = [
  { id: 'solana', name: 'Solana', icon: '⛓️', desc: 'Fast, low-cost claiming' },
  { id: 'base', name: 'Base', icon: '🔷', desc: 'Ethereum L2 security' },
];

export default function PublishScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateInsight, currentInsight, apiUrl } = useArenaStore();
  
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  
  let response: Response | null = null;
  try {
    response = params.response ? JSON.parse(params.response as string) : null;
  } catch (e) {
    response = null;
  }

  const toggleChannel = (channelId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handlePublish = async () => {
    if (selectedChannels.length === 0) {
      Alert.alert('Select Channels', 'Please select at least one channel to publish to.');
      return;
    }

    setIsPublishing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (currentInsight) {
        updateInsight(currentInsight.id, {
          publishedTo: selectedChannels,
        });
      }
      
      setPublishSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedBlockchain) {
      Alert.alert('Select Blockchain', 'Please select a blockchain to claim on.');
      return;
    }

    setIsClaiming(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockHash = '0x' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      if (currentInsight) {
        updateInsight(currentInsight.id, {
          blockchainHash: mockHash,
        });
      }
      
      setClaimSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to claim on blockchain. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!response) {
    return (
      <LinearGradient colors={['#050812', '#0a0e27', '#050812']} style={styles.gradient}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>📤 Publish</Text>
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
            <Text style={{ color: '#a0a0a0', marginBottom: 20 }}>No response selected</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/lab')}>
              <Text style={styles.backButtonText}>Back to Lab</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#050812', '#0a0e27', '#050812']} style={styles.gradient}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📤 Publish</Text>
          <Text style={{ color: '#a0a0a0', fontSize: 12 }}>Share your insight with the world</Text>
        </View>

        {/* Selected Response */}
        <View style={styles.responseCard}>
          <View style={styles.modelBadge}>
            <Text style={styles.modelText}>{response.model}</Text>
          </View>
          <Text style={styles.responseText}>{response.output}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
            <Text style={{ color: '#a0a0a0', fontSize: 12 }}>📊 {response.tokens} tokens</Text>
            <Text style={{ color: '#a0a0a0', fontSize: 12 }}>⏱️ {response.latency_ms}ms</Text>
          </View>
        </View>

        {/* Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publish To</Text>
          <View style={styles.channelGrid}>
            {CHANNELS.map(channel => (
              <TouchableOpacity
                key={channel.id}
                style={[
                  styles.channelButton,
                  selectedChannels.includes(channel.id) && styles.channelButtonSelected,
                ]}
                onPress={() => toggleChannel(channel.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.channelIcon}>{channel.icon}</Text>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelName}>{channel.name}</Text>
                  <Text style={styles.channelDesc}>{channel.desc}</Text>
                </View>
                {selectedChannels.includes(channel.id) && (
                  <View style={styles.channelCheck}>
                    <Text style={styles.channelCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Publish Button */}
        {publishSuccess ? (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>Published!</Text>
            <Text style={styles.successSubtext}>
              Shared to {selectedChannels.join(', ')}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.publishButton, isPublishing && { opacity: 0.7 }]}
            onPress={handlePublish}
            disabled={isPublishing}
            activeOpacity={0.8}
          >
            {isPublishing ? (
              <ActivityIndicator color="#050812" />
            ) : (
              <Text style={styles.publishButtonText}>🚀 Publish to {selectedChannels.length || 'All'} Channels</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Blockchain Claim */}
        <View style={styles.blockchainSection}>
          <Text style={styles.sectionTitle}>Claim Seniority</Text>
          {BLOCKCHAINS.map(blockchain => (
            <TouchableOpacity
              key={blockchain.id}
              style={[
                styles.blockchainButton,
                selectedBlockchain === blockchain.id && { borderColor: '#00ff88' },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedBlockchain(blockchain.id);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.blockchainIcon}>{blockchain.icon}</Text>
              <View style={styles.blockchainInfo}>
                <Text style={styles.blockchainName}>{blockchain.name}</Text>
                <Text style={styles.blockchainDesc}>{blockchain.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Claim Button */}
        {claimSuccess ? (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🔗</Text>
            <Text style={styles.successText}>Claimed!</Text>
            <Text style={styles.successSubtext}>Your insight is now on-chain</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.claimButton, isClaiming && { opacity: 0.7 }]}
            onPress={handleClaim}
            disabled={isClaiming}
            activeOpacity={0.8}
          >
            {isClaiming ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.claimButtonText}>🔗 Claim on {selectedBlockchain || 'Blockchain'}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {(isPublishing || isClaiming) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00d9ff" />
          <Text style={styles.loadingText}>
            {isPublishing ? 'Publishing...' : 'Claiming on blockchain...'}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}