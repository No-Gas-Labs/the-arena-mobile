import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
  settingItem: {
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 6,
  },
  settingValue: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#050812',
    borderWidth: 1,
    borderColor: '#00d9ff',
    borderRadius: 6,
    padding: 10,
    color: '#e0e0e0',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00d9ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#050812',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#ff3333',
  },
  dangerButtonText: {
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#1a1f3a',
    borderLeftWidth: 4,
    borderLeftColor: '#00d9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#a0a0a0',
    lineHeight: 18,
  },
});

export default function SettingsScreen() {
  const router = useRouter();
  const { apiUrl, setApiUrl, offlineMode, setOfflineMode } = useArenaStore();
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);
  const [urlSaved, setUrlSaved] = useState(false);

  const handleSaveApiUrl = () => {
    if (!tempApiUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    // Basic URL validation
    try {
      new URL(tempApiUrl.trim());
    } catch {
      Alert.alert('Error', 'Please enter a valid URL (e.g., https://api.example.com)');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    setApiUrl(tempApiUrl.trim());
    setUrlSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => setUrlSaved(false), 2000);
  };

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
          <Text style={styles.title}>⚙️ Settings</Text>
        </View>

        {/* API Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Configuration</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Backend URL</Text>
            <Text style={styles.settingValue}>Current: {apiUrl}</Text>
            <TextInput
              style={styles.input}
              placeholder="https://api.example.com"
              placeholderTextColor="#666"
              value={tempApiUrl}
              onChangeText={setTempApiUrl}
            />
            <TouchableOpacity
              style={[styles.button, urlSaved && { backgroundColor: '#00ff88' }]}
              onPress={handleSaveApiUrl}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{urlSaved ? '✓ Saved!' : 'Save URL'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🔗 Change this if you're running your own backend server. Default points to the production API.
            </Text>
          </View>
        </View>

        {/* Offline Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offline Mode</Text>

          <View style={styles.settingItem}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>Enable Offline Mode</Text>
                <Text style={styles.settingValue}>Use cached data when offline</Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#666', true: '#00d9ff' }}
                thumbColor={offlineMode ? '#00d9ff' : '#999'}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📱 When enabled, the app will use cached responses when internet is unavailable.
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Built by</Text>
            <Text style={styles.settingValue}>NO_GAS_LABS™</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Features</Text>
            <Text style={styles.settingValue}>
              • Quad-exposure to 4 AI models{'\n'}
              • Multi-channel publishing{'\n'}
              • Blockchain seniority claiming{'\n'}
              • Offline-first architecture
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ paddingBottom: 40 }}>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
            The future of thought is collaborative.{'\n'}
            The future of collaboration is cognitive.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
