export const APP_CONFIG = {
  name: 'THE ARENA',
  version: '1.0.0',
  buildNumber: '1',
  
  // API
  defaultApiUrl: 'https://the-arena-api.fly.dev',
  apiTimeout: 30000,
  
  // Features
  features: {
    quadExposure: true,
    multiChannelPublish: true,
    blockchainClaim: true,
    offlineMode: true,
  },
  
  // AI Models
  models: [
    { id: 'gemini', name: 'Gemini', color: '#4285F4', icon: '✨' },
    { id: 'chatgpt', name: 'ChatGPT', color: '#10A37F', icon: '🤖' },
    { id: 'claude', name: 'Claude', color: '#9B59B6', icon: '🎭' },
    { id: 'grok', name: 'Grok', color: '#000000', icon: '💀' },
  ] as const,
  
  // Publishing Channels
  channels: [
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', enabled: true },
    { id: 'substack', name: 'Substack', icon: '📝', enabled: true },
    { id: 'email', name: 'Email', icon: '📧', enabled: true },
  ] as const,
  
  // Blockchains
  blockchains: [
    { id: 'solana', name: 'Solana', icon: '⛓️', enabled: true },
    { id: 'base', name: 'Base', icon: '🔷', enabled: true },
  ] as const,
  
  // Limits
  limits: {
    maxPromptLength: 5000,
    maxResponseLength: 10000,
    maxInsightsStored: 100,
  },
  
  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
} as const;

export const STORAGE_KEYS = {
  insights: 'arena-insights',
  settings: 'arena-settings',
  apiUrl: 'arena-api-url',
  offlineMode: 'arena-offline-mode',
} as const;