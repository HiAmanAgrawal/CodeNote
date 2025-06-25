import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// AI Models
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-pro' });
export const geminiProVision = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

// Validation schemas
export const CodeAnalysisSchema = z.object({
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  explanation: z.string(),
  optimization: z.string().optional(),
  suggestions: z.array(z.string()).optional(),
});

export const NoteGenerationSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  summary: z.string(),
  keyPoints: z.array(z.string()),
});

export const ComplexityAnalysisSchema = z.object({
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  explanation: z.string(),
  visualization: z.string().optional(),
});

/**
 * Analyze code complexity and provide optimization suggestions
 */
export async function analyzeCodeComplexity({
  code,
  language,
  problemTitle,
  problemDescription,
}: {
  code: string;
  language: string;
  problemTitle?: string;
  problemDescription?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyze the following code for time and space complexity:

Language: ${language}
Problem: ${problemTitle || 'Unknown'}
Description: ${problemDescription || 'No description provided'}

Code:
${code}

Please provide:
1. Time Complexity (Big O notation)
2. Space Complexity (Big O notation)
3. Brief explanation of the algorithm
4. Suggestions for optimization
5. Best practices applied
6. Alternative approaches

Format your response as JSON with the following structure:
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "explanation": "Brief explanation...",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "bestPractices": ["Practice 1", "Practice 2"],
  "alternativeApproaches": ["Approach 1", "Approach 2"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      const analysis = JSON.parse(text);
      return {
        timeComplexity: analysis.timeComplexity || 'Unknown',
        spaceComplexity: analysis.spaceComplexity || 'Unknown',
        explanation: analysis.explanation || 'No explanation provided',
        suggestions: analysis.suggestions || [],
        bestPractices: analysis.bestPractices || [],
        alternativeApproaches: analysis.alternativeApproaches || [],
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        explanation: text || 'Analysis completed',
        suggestions: ['Review the code for potential optimizations'],
        bestPractices: ['Follow coding standards'],
        alternativeApproaches: ['Consider different algorithms'],
      };
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      timeComplexity: 'Unknown',
      spaceComplexity: 'Unknown',
      explanation: 'Failed to analyze code',
      suggestions: ['Check your code manually'],
      bestPractices: ['Follow coding standards'],
      alternativeApproaches: ['Consider different algorithms'],
    };
  }
}

/**
 * Generate notes from various sources (code, text, etc.)
 */
export async function generateNotesFromSource(
  source: string,
  sourceType: 'CODE' | 'TEXT' | 'VIDEO' | 'FILE',
  context?: string
) {
  try {
    let prompt = '';

    switch (sourceType) {
      case 'CODE':
        prompt = `
          Generate comprehensive notes from the following code:
          
          Code:
          ${source}
          
          Context: ${context || 'DSA practice'}
          
          Please provide:
          1. A clear title
          2. Detailed explanation of the algorithm/concept
          3. Key points and takeaways
          4. Relevant tags
          5. A concise summary
          
          Respond in JSON format:
          {
            "title": "Title",
            "content": "Detailed content...",
            "tags": ["tag1", "tag2"],
            "summary": "Brief summary",
            "keyPoints": ["point1", "point2"]
          }
        `;
        break;

      case 'TEXT':
        prompt = `
          Generate structured notes from the following text:
          
          Text:
          ${source}
          
          Context: ${context || 'DSA learning'}
          
          Please provide:
          1. A clear title
          2. Organized content with headings
          3. Key concepts and definitions
          4. Relevant tags
          5. A concise summary
          
          Respond in JSON format:
          {
            "title": "Title",
            "content": "Organized content...",
            "tags": ["tag1", "tag2"],
            "summary": "Brief summary",
            "keyPoints": ["point1", "point2"]
          }
        `;
        break;

      default:
        prompt = `
          Generate notes from the following ${sourceType.toLowerCase()} content:
          
          Content:
          ${source}
          
          Context: ${context || 'Learning material'}
          
          Please provide:
          1. A clear title
          2. Structured content
          3. Key takeaways
          4. Relevant tags
          5. A concise summary
          
          Respond in JSON format:
          {
            "title": "Title",
            "content": "Content...",
            "tags": ["tag1", "tag2"],
            "summary": "Brief summary",
            "keyPoints": ["point1", "point2"]
          }
        `;
    }

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const notes = JSON.parse(jsonMatch[0]);
    return NoteGenerationSchema.parse(notes);
  } catch (error) {
    console.error('Error generating notes:', error);
    throw new Error('Failed to generate notes');
  }
}

/**
 * Optimize code and provide improved version
 */
export async function optimizeCode(code: string, language: string, requirements?: string) {
  try {
    const prompt = `
      Optimize the following ${language} code:
      
      Original Code:
      ${code}
      
      Requirements: ${requirements || 'Improve performance and readability'}
      
      Please provide:
      1. Optimized version of the code
      2. Explanation of optimizations made
      3. Performance improvements
      4. Best practices applied
      
      Respond in JSON format:
      {
        "optimizedCode": "optimized code here",
        "explanation": "explanation of optimizations",
        "performanceImprovements": "performance details",
        "bestPractices": ["practice1", "practice2"]
      }
    `;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error optimizing code:', error);
    throw new Error('Failed to optimize code');
  }
}

/**
 * Generate problem explanations and solutions
 */
export async function generateProblemExplanation(
  problemTitle: string,
  problemDescription: string,
  difficulty: string
) {
  try {
    const prompt = `
      Provide a comprehensive explanation for this ${difficulty.toLowerCase()} problem:
      
      Title: ${problemTitle}
      Description: ${problemDescription}
      
      Please provide:
      1. Problem breakdown and understanding
      2. Approach explanation
      3. Step-by-step solution
      4. Time and space complexity analysis
      5. Key insights and patterns
      6. Similar problems for practice
      
      Respond in JSON format:
      {
        "breakdown": "problem breakdown",
        "approach": "solution approach",
        "solution": "step-by-step solution",
        "complexity": {
          "time": "O(n)",
          "space": "O(1)",
          "explanation": "complexity explanation"
        },
        "insights": ["insight1", "insight2"],
        "similarProblems": ["problem1", "problem2"]
      }
    `;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating problem explanation:', error);
    throw new Error('Failed to generate problem explanation');
  }
}

/**
 * Generate personalized learning recommendations
 */
export async function generateLearningRecommendations(
  userNotes: string[],
  completedProblems: string[],
  weakAreas: string[]
) {
  try {
    const prompt = `
      Based on the user's learning history, generate personalized recommendations:
      
      User's Notes: ${userNotes.join(', ')}
      Completed Problems: ${completedProblems.join(', ')}
      Weak Areas: ${weakAreas.join(', ')}
      
      Please provide:
      1. Recommended topics to focus on
      2. Suggested problems to practice
      3. Learning resources
      4. Study plan
      5. Progress tracking suggestions
      
      Respond in JSON format:
      {
        "recommendedTopics": ["topic1", "topic2"],
        "suggestedProblems": ["problem1", "problem2"],
        "learningResources": ["resource1", "resource2"],
        "studyPlan": "detailed study plan",
        "progressTracking": ["metric1", "metric2"]
      }
    `;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate learning recommendations');
  }
}

/**
 * Check if AI service is available
 */
export function isAIServiceAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

// Generate note with AI
export async function generateNoteWithAI({
  problemTitle,
  problemContent,
  solution,
  topic,
}: {
  problemTitle: string;
  problemContent: string;
  solution?: string;
  topic?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Create a comprehensive study note for the following coding problem:

Problem Title: ${problemTitle}
Problem Content: ${problemContent}
Solution: ${solution || 'Not provided'}
Topic: ${topic || 'General'}

Please create a detailed note that includes:
1. Problem summary
2. Key concepts and techniques
3. Step-by-step solution approach
4. Time and space complexity analysis
5. Common pitfalls and edge cases
6. Related problems and variations
7. Practice tips

Format your response as JSON with the following structure:
{
  "title": "Note Title",
  "content": "Detailed note content...",
  "topic": "Topic name",
  "difficulty": "EASY|MEDIUM|HARD",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const note = JSON.parse(text);
      return {
        title: note.title || `${problemTitle} - Study Note`,
        content: note.content || 'AI-generated note content',
        topic: note.topic || topic || 'General',
        difficulty: note.difficulty || 'MEDIUM',
        tags: note.tags || ['AI-Generated', 'Study Note'],
        confidence: note.confidence || 0.8,
      };
    } catch {
      return {
        title: `${problemTitle} - Study Note`,
        content: text || 'AI-generated note content',
        topic: topic || 'General',
        difficulty: 'MEDIUM',
        tags: ['AI-Generated', 'Study Note'],
        confidence: 0.8,
      };
    }
  } catch (error) {
    console.error('AI note generation error:', error);
    return {
      title: `${problemTitle} - Study Note`,
      content: 'Failed to generate AI note. Please create manually.',
      topic: topic || 'General',
      difficulty: 'MEDIUM',
      tags: ['Manual', 'Study Note'],
      confidence: 0.5,
    };
  }
}

// Get problem recommendations
export async function getProblemRecommendations({
  userId,
  solvedProblemIds,
  attemptedProblemIds,
  topic,
  difficulty,
  limit,
}: {
  userId: string;
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
  topic?: string;
  difficulty?: string;
  limit: number;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Based on the user's progress, recommend coding problems:

User ID: ${userId}
Solved Problems: ${solvedProblemIds.length}
Attempted Problems: ${attemptedProblemIds.length}
Preferred Topic: ${topic || 'Any'}
Preferred Difficulty: ${difficulty || 'Any'}
Number of Recommendations: ${limit}

Please recommend problems that:
1. Build upon the user's current knowledge
2. Introduce new concepts gradually
3. Match their preferred topic and difficulty
4. Help them improve their skills

Format your response as JSON with the following structure:
{
  "recommendations": [
    {
      "problemId": "problem-1",
      "confidence": 0.9,
      "reason": "Builds on arrays knowledge"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      return data.recommendations || [];
    } catch {
      // Fallback recommendations
      return [
        {
          problemId: 'two-sum',
          confidence: 0.8,
          reason: 'Good starting problem for arrays',
        },
        {
          problemId: 'valid-parentheses',
          confidence: 0.7,
          reason: 'Introduces stack concepts',
        },
      ];
    }
  } catch (error) {
    console.error('AI recommendation error:', error);
    return [
      {
        problemId: 'two-sum',
        confidence: 0.5,
        reason: 'Default recommendation',
      },
    ];
  }
}
