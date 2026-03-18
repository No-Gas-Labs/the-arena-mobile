import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useArenaStore, Response } from '@/store/useArenaStore';

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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#00d9ff',
    borderRadius: 8,
    padding: 12,
    color: '#e0e0e0',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00d9ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#050812',
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseContainer: {
    marginBottom: 20,
  },
  responseCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  responseModel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 20,
    marginBottom: 8,
  },
  responseStats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    fontSize: 11,
    color: '#a0a0a0',
  },
  selectButton: {
    backgroundColor: '#ff006e',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#a0a0a0',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#ff3333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 12,
  },
});

const modelColors: Record<string, string> = {
  'Gemini': '#4285F4',
  'ChatGPT': '#10A37F',
  'Claude': '#9B59B6',
  'Grok': '#000000',
};

export default function LabScreen() {
  const router = useRouter();
  const { apiUrl, addInsight, setLoading, isLoading, error, setError, offlineMode, insights } = useArenaStore();
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        await axios.get(`${apiUrl}/health`, { timeout: 3000 });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    checkConnectivity();
    const interval = setInterval(checkConnectivity, 30000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const handleExpose = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (!isOnline && !offlineMode) {
      Alert.alert(
        'Offline',
        'You appear to be offline. Enable Offline Mode in settings to use cached responses.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await axios.post(`${apiUrl}/api/quad-exposure`, {
        prompt: prompt.trim(),
      }, { timeout: 30000 });

      const newResponses = response.data.responses || [];
      setResponses(newResponses);

      // Save to store
      addInsight({
        id: Date.now().toString(),
        prompt: prompt.trim(),
        responses: newResponses,
        timestamp: Date.now(),
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      // If offline mode enabled, show similar cached insights
      if (offlineMode && insights.length > 0) {
        const similarInsights = insights.filter(i => 
          i.prompt.toLowerCase().includes(prompt.toLowerCase().split(' ')[0])
        );
        if (similarInsights.length > 0) {
          setResponses(similarInsights[0].responses);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert('Offline Mode', 'Showing cached response. Connect to internet for fresh responses.');
          return;
        }
      }
      setError(err instanceof Error ? err.message : 'Failed to get responses');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResponse = (response: Response) => {
    // Navigate to publish screen with selected response
    router.push({
      pathname: '/publish',
      params: { response: JSON.stringify(response) },
    });
  };

  const handleCopyResponse = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Response copied to clipboard');
  };

  return (
    <LinearGradient
      colors={['#050812', '#0a0e27', '#050812']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.title}>🧪 The Lab</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isOnline ? 'rgba(0,255,136,0.1)' : 'rgba(255,50,50,0.1)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isOnline ? '#00ff88' : '#ff3333',
                marginRight: 6,
              }} />
              <Text style={{ color: isOnline ? '#00ff88' : '#ff3333', fontSize: 10 }}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>
          <Text style={{ color: '#a0a0a0', fontSize: 12, marginTop: 4 }}>Quad-exposure to 4 AI models</Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Prompt Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Thought</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your prompt here..."
            placeholderTextColor="#666"
            value={prompt}
            onChangeText={setPrompt}
            editable={!isLoading}
            multiline
          />
        </View>

        {/* Expose Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.6 }]}
          onPress={handleExpose}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#050812" />
          ) : (
            <Text style={styles.buttonText}>🚀 Expose to All 4</Text>
          )}
        </TouchableOpacity>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d9ff" />
            <Text style={styles.loadingText}>Getting responses from all 4 models...</Text>
          </View>
        )}

        {/* Responses */}
        {responses.length > 0 && !isLoading && (
          <View style={styles.responseContainer}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00d9ff', marginBottom: 12 }}>
              Responses ({responses.length})
            </Text>

            {responses.map((response, index) => (
              <View
                key={index}
                style={[
                  styles.responseCard,
                  { borderLeftColor: modelColors[response.model] || '#00d9ff' },
                ]}
              >
                <Text style={styles.responseModel}>{response.model}</Text>
                <Text style={styles.responseText} numberOfLines={4}>
                  {response.output}
                </Text>
                <View style={styles.responseStats}>
                  <Text style={styles.stat}>📊 {response.tokens} tokens</Text>
                  <Text style={styles.stat}>⏱️ {response.latency_ms}ms</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <TouchableOpacity
                    style={[styles.selectButton, { flex: 1 }]}
                    onPress={() => handleSelectResponse(response)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.selectButtonText}>✓ Select</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.selectButton, { flex: 1, backgroundColor: '#1a3a5a' }]}
                    onPress={() => handleCopyResponse(response.output)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.selectButtonText, { color: '#00d9ff' }]}>📋 Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
