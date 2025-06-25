// Application constants
export const APP_NAME = 'CodeNote';
export const APP_DESCRIPTION = 'AI-Powered DSA Practice and Note-Taking Companion';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API endpoints
export const API_BASE_URL = '/api';
export const TRPC_API_URL = '/api/trpc';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'text/plain',
  'text/markdown',
  'application/json',
  'application/javascript',
  'text/javascript',
  'text/typescript',
  'text/x-python',
  'text/x-java-source',
  'text/x-c++src',
  'text/x-csrc',
];

// Programming languages supported by Monaco Editor
export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'c', name: 'C', extension: '.c' },
  { id: 'csharp', name: 'C#', extension: '.cs' },
  { id: 'go', name: 'Go', extension: '.go' },
  { id: 'rust', name: 'Rust', extension: '.rs' },
  { id: 'swift', name: 'Swift', extension: '.swift' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt' },
  { id: 'php', name: 'PHP', extension: '.php' },
  { id: 'ruby', name: 'Ruby', extension: '.rb' },
  { id: 'scala', name: 'Scala', extension: '.scala' },
  { id: 'dart', name: 'Dart', extension: '.dart' },
] as const;

// Problem categories
export const PROBLEM_CATEGORIES = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Heap',
  'Hash Table',
  'Math',
  'Bit Manipulation',
  'Sorting',
  'Recursion',
  'Divide and Conquer',
] as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD'] as const;

// Submission statuses
export const SUBMISSION_STATUSES = [
  'PENDING',
  'RUNNING',
  'ACCEPTED',
  'WRONG_ANSWER',
  'TIME_LIMIT_EXCEEDED',
  'MEMORY_LIMIT_EXCEEDED',
  'RUNTIME_ERROR',
  'COMPILATION_ERROR',
] as const;

// Source types for notes
export const SOURCE_TYPES = [
  'CODE',
  'VIDEO',
  'FILE',
  'TEXT',
  'VOICE',
  'DIAGRAM',
] as const;

// Time limits for contests (in minutes)
export const CONTEST_TIME_LIMITS = [30, 60, 90, 120, 180, 240] as const;

// Default contest settings
export const DEFAULT_CONTEST_SETTINGS = {
  maxParticipants: 100,
  timeLimit: 120, // minutes
  problemsPerContest: 5,
} as const;

// AI model configurations
export const AI_MODELS = {
  GEMINI_PRO: 'gemini-pro',
  GEMINI_PRO_VISION: 'gemini-pro-vision',
  GPT_4: 'gpt-4',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const;

// Vector search configurations
export const VECTOR_CONFIG = {
  EMBEDDING_DIMENSION: 1536, // OpenAI embedding dimension
  SIMILARITY_THRESHOLD: 0.7,
  MAX_RESULTS: 10,
} as const;

// UI constants
export const UI_CONSTANTS = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'Something went wrong. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  CONTEST_FULL: 'This contest is full',
  CONTEST_ENDED: 'This contest has ended',
  CONTEST_NOT_STARTED: 'This contest has not started yet',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  NOTE_CREATED: 'Note created successfully',
  NOTE_UPDATED: 'Note updated successfully',
  NOTE_DELETED: 'Note deleted successfully',
  CONTEST_CREATED: 'Contest created successfully',
  CONTEST_UPDATED: 'Contest updated successfully',
  CONTEST_JOINED: 'Successfully joined the contest',
  SUBMISSION_ACCEPTED: 'Congratulations! Your solution is correct',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'codenote-theme',
  LANGUAGE: 'codenote-language',
  EDITOR_SETTINGS: 'codenote-editor-settings',
  USER_PREFERENCES: 'codenote-user-preferences',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EDITOR: '/dashboard/editor',
  CONTESTS: '/dashboard/contests',
  ROADMAP: '/dashboard/roadmap',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    ERROR: '/auth/error',
  },
} as const;
