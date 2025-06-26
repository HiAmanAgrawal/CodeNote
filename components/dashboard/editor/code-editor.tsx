'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Maximize,
  Minimize,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  Share,
  Eye,
  EyeOff
} from 'lucide-react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'vs' | 'vs-dark' | 'hc-black';
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string, language: string) => void;
  onSave?: (code: string) => void;
  className?: string;
}

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'cpp', label: 'C++', extension: '.cpp' },
  { value: 'c', label: 'C', extension: '.c' },
  { value: 'csharp', label: 'C#', extension: '.cs' },
  { value: 'go', label: 'Go', extension: '.go' },
  { value: 'rust', label: 'Rust', extension: '.rs' },
  { value: 'php', label: 'PHP', extension: '.php' },
  { value: 'ruby', label: 'Ruby', extension: '.rb' },
  { value: 'swift', label: 'Swift', extension: '.swift' },
  { value: 'kotlin', label: 'Kotlin', extension: '.kt' },
  { value: 'scala', label: 'Scala', extension: '.scala' },
];

const defaultCode = {
  javascript: `function solution() {
    // Your code here
    return "Hello, World!";
}

console.log(solution());`,
  python: `def solution():
    # Your code here
    return "Hello, World!"

print(solution())`,
  java: `public class Solution {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language = 'javascript',
  theme = 'vs-dark',
  readOnly = false,
  onCodeChange,
  onRun,
  onSave,
  className,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState<'off' | 'on' | 'wordWrapColumn' | 'bounded'>('off');
  const [tabSize, setTabSize] = useState(2);
  const [showSettings, setShowSettings] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Initialize Monaco Editor
  useEffect(() => {
    if (!editorRef.current) return;

    const code = initialCode || defaultCode[selectedLanguage as keyof typeof defaultCode] || defaultCode.javascript;

    monacoEditorRef.current = monaco.editor.create(editorRef.current, {
      value: code,
      language: selectedLanguage,
      theme: selectedTheme,
      readOnly,
      automaticLayout: true,
      fontSize,
      lineNumbers: showLineNumbers ? 'on' : 'off',
      minimap: { enabled: showMinimap },
      wordWrap,
      tabSize,
      scrollBeyondLastLine: false,
      roundedSelection: false,
      selectOnLineNumbers: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      mouseWheelZoom: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
      },
      parameterHints: { enabled: true },
      hover: { enabled: true },
      contextmenu: true,
      quickSuggestions: true,
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'top',
      wordBasedSuggestions: true,
      suggestOnTriggerCharacters: true,
      suggestSelection: 'first',
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
      },
    });

    // Handle code changes
    monacoEditorRef.current.onDidChangeModelContent(() => {
      const code = monacoEditorRef.current?.getValue() || '';
      onCodeChange?.(code);
    });

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }
    };
  }, []);

  // Update editor when language changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, selectedLanguage);
      }
    }
  }, [selectedLanguage]);

  // Update editor when theme changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      monaco.editor.setTheme(selectedTheme);
    }
  }, [selectedTheme]);

  // Update editor settings
  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.updateOptions({
        fontSize,
        lineNumbers: showLineNumbers ? 'on' : 'off',
        minimap: { enabled: showMinimap },
        wordWrap,
        tabSize,
      });
    }
  }, [fontSize, showLineNumbers, showMinimap, wordWrap, tabSize]);

  const handleRun = useCallback(async () => {
    if (!monacoEditorRef.current) return;

    const code = monacoEditorRef.current.getValue();
    setIsRunning(true);

    try {
      await onRun?.(code, selectedLanguage);
    } catch (error) {
      console.error('Code execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [onRun, selectedLanguage]);

  const handleSave = useCallback(() => {
    if (!monacoEditorRef.current) return;

    const code = monacoEditorRef.current.getValue();
    onSave?.(code);
  }, [onSave]);

  const handleReset = useCallback(() => {
    if (!monacoEditorRef.current) return;

    const defaultCodeForLanguage = defaultCode[selectedLanguage as keyof typeof defaultCode] || defaultCode.javascript;
    monacoEditorRef.current.setValue(defaultCodeForLanguage);
  }, [selectedLanguage]);

  const handleCopy = useCallback(() => {
    if (!monacoEditorRef.current) return;

    const code = monacoEditorRef.current.getValue();
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  }, []);

  const handleDownload = useCallback(() => {
    if (!monacoEditorRef.current) return;

    const code = monacoEditorRef.current.getValue();
    const language = languageOptions.find(lang => lang.value === selectedLanguage);
    const extension = language?.extension || '.txt';
    const filename = `code${extension}`;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [selectedLanguage]);

  const handleUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.ts,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.scala,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && monacoEditorRef.current) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          monacoEditorRef.current?.setValue(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (monacoEditorRef.current) {
      monacoEditorRef.current.layout();
    }
  }, [isFullscreen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}
    >
      <Card className={`h-full ${isFullscreen ? 'rounded-none' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg">Code Editor</CardTitle>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vs">Light</SelectItem>
                  <SelectItem value="vs-dark">Dark</SelectItem>
                  <SelectItem value="hc-black">High Contrast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 14, 16, 18, 20, 24].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tab Size</label>
                  <Select value={tabSize.toString()} onValueChange={(value) => setTabSize(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 4, 8].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} spaces
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Word Wrap</label>
                  <Select value={wordWrap} onValueChange={(value: any) => setWordWrap(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="wordWrapColumn">Column</SelectItem>
                      <SelectItem value="bounded">Bounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Display</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lineNumbers"
                        checked={showLineNumbers}
                        onChange={(e) => setShowLineNumbers(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="lineNumbers" className="text-sm">Line Numbers</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="minimap"
                        checked={showMinimap}
                        onChange={(e) => setShowMinimap(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="minimap" className="text-sm">Minimap</label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRun}
                disabled={isRunning || readOnly}
                className="flex items-center space-x-2"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleSave}
                disabled={readOnly}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                disabled={readOnly}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Editor Container */}
          <div
            ref={editorRef}
            className="border rounded-lg overflow-hidden"
            style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CodeEditor; 