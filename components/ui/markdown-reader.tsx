'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  FileText,
  Terminal
} from 'lucide-react';
import { useSimpleToast } from '@/components/ui/simple-toast';

interface MarkdownReaderProps {
  content: string;
  className?: string;
}

// Simple markdown parser for basic formatting
const parseMarkdown = (content: string) => {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Code blocks with language detection
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      return `<div class="code-block my-4" data-language="${language}">${code}</div>`;
    })
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$&</li>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1 <ExternalLink className="inline w-3 h-3" /></a>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/^([^<].*)/gm, '<p class="mb-4 leading-relaxed">$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 leading-relaxed"><\/p>/g, '')
    .replace(/<p class="mb-4 leading-relaxed">\s*<\/p>/g, '');
};

// Syntax highlighting for common languages
const highlightSyntax = (code: string, language: string) => {
  const keywords = {
    python: ['def', 'class', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'return', 'True', 'False', 'None', 'self', 'lambda', 'yield', 'async', 'await'],
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally', 'return', 'true', 'false', 'null', 'undefined', 'async', 'await', 'class', 'extends', 'super', 'new', 'this'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'abstract', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally', 'return', 'new', 'this', 'super', 'void', 'int', 'String', 'boolean'],
    cpp: ['#include', 'using', 'namespace', 'class', 'public', 'private', 'protected', 'static', 'const', 'if', 'else', 'for', 'while', 'try', 'catch', 'return', 'new', 'delete', 'this', 'void', 'int', 'string', 'bool', 'vector', 'map', 'set'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'TABLE', 'INDEX', 'PRIMARY', 'FOREIGN', 'KEY', 'REFERENCES', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'GROUP', 'BY', 'ORDER', 'HAVING', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN']
  };

  const langKeywords = keywords[language as keyof typeof keywords] || [];
  
  let highlighted = code;
  
  // Highlight keywords
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<span class="text-blue-600 font-semibold">${keyword}</span>`);
  });
  
  // Highlight strings
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>');
  highlighted = highlighted.replace(/'([^']*)'/g, '<span class="text-green-600">\'$1\'</span>');
  
  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-600">$1</span>');
  
  // Highlight comments
  if (language === 'python' || language === 'javascript') {
    highlighted = highlighted.replace(/#(.*$)/gm, '<span class="text-gray-500 italic">#$1</span>');
  }
  if (language === 'javascript' || language === 'java' || language === 'cpp') {
    highlighted = highlighted.replace(/\/\/(.*$)/gm, '<span class="text-gray-500 italic">//$1</span>');
    highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500 italic">/*$1*/</span>');
  }
  
  return highlighted;
};

export function MarkdownReader({ content, className = '' }: MarkdownReaderProps) {
  const { toast } = useSimpleToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, language: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(language);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const processedContent = parseMarkdown(content);

  // Extract code blocks and replace with enhanced versions
  const enhancedContent = processedContent.replace(
    /<div class="code-block my-4" data-language="([^"]+)">([\s\S]*?)<\/div>/g,
    (match, language, code) => {
      const highlightedCode = highlightSyntax(code, language);
      const sectionId = `code-${Math.random().toString(36).substr(2, 9)}`;
      const isExpanded = expandedSections.has(sectionId);
      
      return `
        <div class="code-section my-6" data-section-id="${sectionId}">
          <div class="flex items-center justify-between bg-muted p-3 rounded-t-lg border-b">
            <div class="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <Badge variant="outline" className="text-xs font-mono">${language}</Badge>
              <span class="text-sm text-muted-foreground">${code.split('\n').length} lines</span>
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick="window.toggleCodeSection('${sectionId}')"
                className="h-8 w-8 p-0"
              >
                ${isExpanded ? '<ChevronUp className="w-4 h-4" />' : '<ChevronDown className="w-4 h-4" />'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick="window.copyCode('${language}', \`${code.replace(/`/g, '\\`')}\`)"
                className="h-8 w-8 p-0"
              >
                ${copiedCode === language ? '<Check className="w-4 h-4 text-green-500" />' : '<Copy className="w-4 h-4" />'}
              </Button>
            </div>
          </div>
          <div class="code-content ${isExpanded ? 'block' : 'hidden'}">
            <pre class="bg-muted p-4 rounded-b-lg overflow-x-auto text-sm font-mono leading-relaxed">
              <code class="language-${language}">${highlightedCode}</code>
            </pre>
          </div>
        </div>
      `;
    }
  );

  // Add global functions for code interaction
  React.useEffect(() => {
    (window as any).copyCode = (language: string, code: string) => {
      copyToClipboard(code, language);
    };
    
    (window as any).toggleCodeSection = (sectionId: string) => {
      toggleSection(sectionId);
    };
  }, [expandedSections]);

  return (
    <div 
      className={`markdown-content prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: enhancedContent }}
    />
  );
} 