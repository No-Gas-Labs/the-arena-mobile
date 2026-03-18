import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const DEFAULT_TIMEOUT = 30000;

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface QuadExposureResponse {
  responses: Array<{
    model: string;
    output: string;
    tokens: number;
    latency_ms: number;
  }>;
}

export interface PublishResponse {
  success: boolean;
  publishedTo: string[];
  urls?: Record<string, string>;
}

export interface BlockchainClaimResponse {
  success: boolean;
  hash: string;
  chain: string;
}

class ApiService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string = 'https://the-arena-api.fly.dev') {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = this.handleError(error);
        return Promise.reject(new Error(message));
      }
    );
  }

  private handleError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timed out. Please try again.';
      }
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return 'Invalid request. Please check your input.';
          case 401:
            return 'Authentication required.';
          case 403:
            return 'Access denied.';
          case 404:
            return 'Resource not found.';
          case 429:
            return 'Too many requests. Please wait a moment.';
          case 500:
            return 'Server error. Please try again later.';
          default:
            return `Request failed with status ${error.response.status}`;
        }
      }
      if (error.request) {
        return 'No response from server. Check your connection.';
      }
    }
    return error instanceof Error ? error.message : 'An unexpected error occurred.';
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
    this.client.defaults.baseURL = url;
  }

  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await this.client.get('/health');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Health check failed', 
        status: 0 
      };
    }
  }

  async quadExposure(prompt: string): Promise<ApiResponse<QuadExposureResponse>> {
    try {
      const response = await this.client.post('/api/quad-exposure', { prompt });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Quad exposure failed', 
        status: 0 
      };
    }
  }

  async publish(
    response: string, 
    channels: string[]
  ): Promise<ApiResponse<PublishResponse>> {
    try {
      const res = await this.client.post('/api/publish', { response, channels });
      return { data: res.data, error: null, status: res.status };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Publishing failed', 
        status: 0 
      };
    }
  }

  async claimSeniority(
    content: string, 
    chain: 'solana' | 'base'
  ): Promise<ApiResponse<BlockchainClaimResponse>> {
    try {
      const res = await this.client.post('/api/claim-seniority', { content, chain });
      return { data: res.data, error: null, status: res.status };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Blockchain claim failed', 
        status: 0 
      };
    }
  }
}

// Export singleton instance
export const api = new ApiService();

export default ApiService;