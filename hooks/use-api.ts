import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// API Client
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      // Add auth token if available
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(`${this.baseURL}${config.url}`, {
        method: config.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
        body: config.data ? JSON.stringify(config.data) : undefined,
        ...config,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status, statusText: response.statusText } as AxiosResponse<ApiResponse<T>>;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ ...config, url, method: 'GET' });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ ...config, url, method: 'POST', data });
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ ...config, url, method: 'PUT', data });
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ ...config, url, method: 'PATCH', data });
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.request<T>({ ...config, url, method: 'DELETE' });
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Custom hooks
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: () => apiClient.get<T>(url),
    ...options,
  });
}

export function useApiMutation<T, V>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: Omit<UseMutationOptions<ApiResponse<T>, AxiosError, V>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: V) => {
      switch (method) {
        case 'POST':
          return apiClient.post<T>(url, data);
        case 'PUT':
          return apiClient.put<T>(url, data);
        case 'PATCH':
          return apiClient.patch<T>(url, data);
        case 'DELETE':
          return apiClient.delete<T>(url);
        default:
          return apiClient.post<T>(url, data);
      }
    },
    onSuccess: (data, variables, context) => {
      // Show success message
      if (data.message) {
        toast.success(data.message);
      }
      
      // Invalidate related queries
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Show error message
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
      
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}

// Specific API hooks for different resources
export const useNotes = {
  // Get all notes
  list: (filters?: any) => useApiQuery(
    ['notes', 'list', filters],
    `/notes${filters ? `?${new URLSearchParams(filters)}` : ''}`
  ),

  // Get single note
  get: (id: string) => useApiQuery(
    ['notes', 'get', id],
    `/notes/${id}`
  ),

  // Create note
  create: () => useApiMutation<any, any>('/notes', 'POST', {
    onSuccess: () => {
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: ['notes', 'list'] });
    },
  }),

  // Update note
  update: (id: string) => useApiMutation<any, any>(`/notes/${id}`, 'PUT', {
    onSuccess: (data, variables) => {
      // Update cache optimistically
      queryClient.setQueryData(['notes', 'get', id], data);
      queryClient.invalidateQueries({ queryKey: ['notes', 'list'] });
    },
  }),

  // Delete note
  delete: () => useApiMutation<any, string>('/notes', 'DELETE', {
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['notes', 'get', id] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'list'] });
    },
  }),
};

export const useContests = {
  list: (filters?: any) => useApiQuery(
    ['contests', 'list', filters],
    `/contests${filters ? `?${new URLSearchParams(filters)}` : ''}`
  ),

  get: (id: string) => useApiQuery(
    ['contests', 'get', id],
    `/contests/${id}`
  ),

  join: () => useApiMutation<any, { contestId: string }>('/contests/join', 'POST'),

  submit: () => useApiMutation<any, { contestId: string; problemId: string; code: string }>(
    '/contests/submit',
    'POST'
  ),
};

export const useProblems = {
  list: (filters?: any) => useApiQuery(
    ['problems', 'list', filters],
    `/problems${filters ? `?${new URLSearchParams(filters)}` : ''}`
  ),

  get: (id: string) => useApiQuery(
    ['problems', 'get', id],
    `/problems/${id}`
  ),

  submit: () => useApiMutation<any, { problemId: string; code: string; language: string }>(
    '/problems/submit',
    'POST'
  ),
};

export const useUser = {
  profile: () => useApiQuery(['user', 'profile'], '/user/profile'),

  update: () => useApiMutation<any, any>('/user/profile', 'PUT'),

  stats: () => useApiQuery(['user', 'stats'], '/user/stats'),

  submissions: (filters?: any) => useApiQuery(
    ['user', 'submissions', filters],
    `/user/submissions${filters ? `?${new URLSearchParams(filters)}` : ''}`
  ),
};

// Mock data for development
export const mockApiData = {
  notes: [
    {
      id: '1',
      title: 'Two Sum Problem - Hash Map Solution',
      content: 'The Two Sum problem is a classic algorithmic challenge...',
      tags: ['arrays', 'hash-map'],
      category: 'Algorithms',
      difficulty: 'beginner',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
      isFavorite: true,
      isPublic: true,
      viewCount: 45,
      wordCount: 250,
    },
  ],
  contests: [
    {
      id: '1',
      title: 'Weekly Contest #124',
      description: '4 problems • 90 minutes',
      startTime: '2024-01-25T10:00:00Z',
      endTime: '2024-01-25T11:30:00Z',
      problems: 4,
    },
  ],
}; 