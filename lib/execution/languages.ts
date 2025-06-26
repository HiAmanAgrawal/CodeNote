import { SupportedLanguage } from './types';

export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguage> = {
  javascript: {
    id: 1,
    name: 'JavaScript',
    extension: '.js',
    judge0Id: 63, // Node.js
    runCommand: 'node',
    timeLimit: 5,
    memoryLimit: 512,
  },
  python: {
    id: 2,
    name: 'Python',
    extension: '.py',
    judge0Id: 71, // Python 3
    runCommand: 'python3',
    timeLimit: 5,
    memoryLimit: 512,
  },
  cpp: {
    id: 3,
    name: 'C++',
    extension: '.cpp',
    judge0Id: 54, // C++ (GCC 9.2.0)
    compileCommand: 'g++ -std=c++17 -O2 -o main main.cpp',
    runCommand: './main',
    timeLimit: 3,
    memoryLimit: 256,
  },
  java: {
    id: 4,
    name: 'Java',
    extension: '.java',
    judge0Id: 62, // Java (OpenJDK 13.0.1)
    compileCommand: 'javac Main.java',
    runCommand: 'java Main',
    timeLimit: 5,
    memoryLimit: 512,
  },
};

export function getLanguageByExtension(extension: string): SupportedLanguage | null {
  const lang = Object.values(SUPPORTED_LANGUAGES).find(
    (lang) => lang.extension === extension
  );
  return lang || null;
}

export function getLanguageByName(name: string): SupportedLanguage | null {
  const lang = SUPPORTED_LANGUAGES[name.toLowerCase()];
  return lang || null;
}

export function isLanguageSupported(language: string): boolean {
  return language.toLowerCase() in SUPPORTED_LANGUAGES;
}