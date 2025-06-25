import { createLLM } from './config';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

export interface NoteGenerationRequest {
  title: string;
  content: string;
  topic: string;
  difficulty: string;
  style?: 'detailed' | 'concise' | 'visual';
}

export interface CodeAnalysisRequest {
  code: string;
  language: string;
  focus?: 'complexity' | 'optimization' | 'best-practices' | 'all';
}

export interface ELI5Request {
  concept: string;
  context: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface MultimodalRequest {
  text?: string;
  image?: string; // base64 encoded image
  audio?: string; // base64 encoded audio
}

export class AIServices {
  private llm: any;
  private gemini: ChatGoogleGenerativeAI;

  constructor() {
    this.llm = createLLM();
    this.gemini = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY || '',
      model: 'gemini-pro-vision',
    });
  }

  // Note Generation Service
  async generateNote(params: {
    title: string;
    content: string;
    topic: string;
    difficulty: string;
    style?: 'detailed' | 'concise' | 'visual';
  }): Promise<string> {
    try {
      const llm = createLLM();
      
      const stylePrompt = params.style 
        ? `Style: ${params.style} - ${params.style === 'detailed' ? 'Comprehensive with examples' : params.style === 'concise' ? 'Key points only' : 'Visual with diagrams and flowcharts'}`
        : 'Style: Balanced with key concepts and examples';

      const prompt = `
Generate comprehensive notes for the following DSA topic:

Title: ${params.title}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
${stylePrompt}

Content to generate notes from:
${params.content}

Please create well-structured notes with:
1. Clear headings and subheadings
2. Key concepts and definitions
3. Examples and code snippets where relevant
4. Important takeaways
5. Related topics and connections
6. Practice problems or exercises if applicable

Make the notes engaging and easy to understand for ${params.difficulty} level learners.
`;

      const response = await llm.invoke([
        {
          role: 'user',
          content: prompt,
        },
      ]);

      return response.content as string;
    } catch (error) {
      console.error('Note generation error:', error);
      return 'Sorry, I encountered an error while generating notes. Please try again.';
    }
  }

  // Code Complexity Analysis Service
  async analyzeCode(request: CodeAnalysisRequest) {
    const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert code analyst specializing in Data Structures and Algorithms.
Analyze the following {language} code and provide a comprehensive analysis:

Code:
{code}

Focus areas: {focus}

Please provide:
1. Algorithm explanation and approach
2. Time complexity analysis (Big O notation)
3. Space complexity analysis
4. Optimization suggestions
5. Best practices recommendations
6. Alternative approaches if applicable
7. Edge cases and considerations
8. Code quality assessment

Be thorough but concise in your analysis.
`);

    const chain = RunnableSequence.from([
      promptTemplate,
      this.llm,
      new StringOutputParser(),
    ]);

    return await chain.invoke({
      code: request.code,
      language: request.language,
      focus: request.focus || 'all',
    });
  }

  // ELI5 (Explain Like I'm 5) Service
  async explainELI5(request: ELI5Request) {
    const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert educator who can explain complex concepts in simple terms.
Explain the following concept in a way that a {level} level student can understand:

Concept: {concept}
Context: {context}
Level: {level}

Please provide:
1. A simple, clear explanation using analogies and examples
2. Step-by-step breakdown of the concept
3. Visual representation using ASCII art or diagrams
4. Real-world applications and examples
5. Common misconceptions and clarifications
6. Progressive complexity (start simple, build up)

Make it engaging, memorable, and easy to follow. Use concrete examples and avoid jargon.
`);

    const chain = RunnableSequence.from([
      promptTemplate,
      this.llm,
      new StringOutputParser(),
    ]);

    return await chain.invoke({
      concept: request.concept,
      context: request.context,
      level: request.level,
    });
  }

  // Multimodal Input Processing Service
  async processMultimodalInput(request: MultimodalRequest) {
    if (request.image) {
      return await this.processImage(request.image, request.text);
    } else if (request.audio) {
      return await this.processAudio(request.audio, request.text);
    } else {
      return await this.processText(request.text || '');
    }
  }

  private async processImage(imageBase64: string, text?: string) {
    const prompt = `
Analyze this image and provide insights about the Data Structures and Algorithms content shown.

${text ? `Context: ${text}` : ''}

Please provide:
1. Description of what's shown in the image
2. Analysis of any algorithms, data structures, or concepts depicted
3. Explanation of the visual representation
4. Key insights and takeaways
5. Related concepts and connections
6. Suggestions for further study

If the image contains code, analyze the code structure and logic.
If it's a diagram, explain the relationships and flow.
`;

    const response = await this.gemini.invoke([
      prompt,
      `[IMAGE DATA OMITTED]\n\n${text || 'Please analyze this image.'}`,
    ]);

    return response.content;
  }

  private async processAudio(audioBase64: string, text?: string) {
    // For now, we'll use text processing since audio processing requires additional setup
    // In a full implementation, you'd use a speech-to-text service first
    const prompt = `
Process the following audio content related to Data Structures and Algorithms.

${text ? `Context: ${text}` : ''}

Please provide:
1. Summary of the audio content
2. Key concepts discussed
3. Important points and insights
4. Questions or clarifications needed
5. Related topics for further study
`;

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(prompt),
      this.llm,
      new StringOutputParser(),
    ]);

    return await chain.invoke({});
  }

  private async processText(text: string) {
    const prompt = `
Analyze the following text content related to Data Structures and Algorithms:

${text}

Please provide:
1. Summary of the main concepts
2. Key insights and takeaways
3. Important algorithms or data structures mentioned
4. Complexity analysis if applicable
5. Related topics and connections
6. Suggestions for further study
`;

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(prompt),
      this.llm,
      new StringOutputParser(),
    ]);

    return await chain.invoke({});
  }

  // Voice-to-Text Service (placeholder for future implementation)
  async voiceToText(audioBase64: string): Promise<string> {
    // This would integrate with a speech-to-text service like Google Speech-to-Text
    // For now, return a placeholder
    return "Voice-to-text conversion would be implemented here with a speech recognition service.";
  }

  // Image Analysis Service
  async analyzeImage(imageBase64: string, context?: string): Promise<string> {
    try {
      const llm = createLLM();
      
      const prompt = context || 'Please analyze this image and explain what you see, especially if it contains code, algorithms, or data structures.';
      
      // For now, we'll use a text-only approach since multimodal is complex with version conflicts
      const response = await llm.invoke([
        {
          role: 'user',
          content: `Please analyze this image: ${prompt}\n\nNote: Image analysis is currently limited due to API compatibility. Please describe what you would look for in this type of image.`,
        },
      ]);

      return response.content as string;
    } catch (error) {
      console.error('Image analysis error:', error);
      return 'Sorry, I encountered an error while analyzing the image. Please try again.';
    }
  }

  // Diagram Analysis Service
  async analyzeDiagram(imageBase64: string, diagramType?: string): Promise<string> {
    try {
      const llm = createLLM();
      
      const prompt = diagramType 
        ? `Analyze this ${diagramType} diagram. Explain the algorithm, data structure, or concept it represents.`
        : 'Analyze this diagram and explain what algorithm, data structure, or concept it represents.';

      const response = await llm.invoke([
        {
          role: 'user',
          content: `${prompt}\n\nNote: Diagram analysis is currently limited due to API compatibility. Please describe what you would look for in this type of diagram.`,
        },
      ]);

      return response.content as string;
    } catch (error) {
      console.error('Diagram analysis error:', error);
      return 'Sorry, I encountered an error while analyzing the diagram. Please try again.';
    }
  }

  async processVoiceToText(audioBase64: string): Promise<string> {
    try {
      const llm = createLLM();
      
      const response = await llm.invoke([
        {
          role: 'user',
          content: 'Please transcribe this audio recording.\n\nNote: Voice-to-text is currently limited due to API compatibility. Please describe what you would expect to hear in this type of recording.',
        },
      ]);

      return response.content as string;
    } catch (error) {
      console.error('Voice-to-text error:', error);
      return 'Sorry, I encountered an error while processing the audio. Please try again.';
    }
  }
} 