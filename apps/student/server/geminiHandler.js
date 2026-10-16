/**
 * Server-Side Gemini API Handler for ZHERO Student Platform
 * Keeps GEMINI_API_KEY secure on the server side; never bundled into frontend assets.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt enforcing ZHERO's conversational guidance requirements
const SYSTEM_INSTRUCTION = `
You are the empathetic, thoughtful, and evidence-based AI Career Counselor for ZHERO, an educational support and career guidance platform.
Your objective is to conduct a genuine conversational assessment with a student exploring their future education and career pathways.

Guiding Principles:
1. Ask ONE primary question at a time.
2. Ask meaningful, personalized follow-up questions based directly on what the student just shared.
3. If a student expresses self-doubt (e.g. "I love design but I'm not creative enough"), explore what they enjoy designing and what makes them doubt themselves. Encourage them without being patronizing. Never diagnose mental health conditions or make unsupported psychological claims.
4. Do not rush to recommend a career in the first 2-3 turns. Build an authentic picture of their curiosity, learning habits, problem decomposition style, and preferred work environment.
5. Use warm, accessible, age-appropriate, non-judgmental language.
6. Keep questions grounded in concrete experiences (e.g., projects they enjoyed, times they solved a tough puzzle, subjects that made time fly).
`;

function getApiKey() {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
}

export async function handleGeminiChat(body) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      success: false,
      isAiPowered: false,
      error: 'GEMINI_API_KEY is not configured in server environment.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for responsive, high-quality conversational turns
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const { messages = [], context = {} } = body;

    // Convert prior conversation turns into Gemini format
    const chatHistory = [];

    // Provide initial context grounding
    if (context && Object.keys(context).length > 0) {
      chatHistory.push({
        role: 'user',
        parts: [{
          text: `Here is the student's preliminary background context:
- Education level: ${context.educationLevel || 'Not specified'}
- Stream / Focus: ${context.stream || 'Not specified'}
- Activities/Subjects enjoyed: ${(context.enjoyedSubjects || []).join(', ') || 'Exploring'}
- Skills practiced or curious about: ${(context.curiousSkills || []).join(', ') || 'Exploring'}
- Working style preference: ${context.workEnvironment || 'Flexible'}
- In their own words: "${context.selfDescription || 'Excited to discover where my strengths lead.'}"
Please open the conversation warmly with an engaging, accessible opening question.`
        }]
      });
      chatHistory.push({
        role: 'model',
        parts: [{
          text: `Welcome! I'm your ZHERO AI Career Guide. I'm here to listen, explore what energizes you, and help you map out real possibilities—without any pressure or rigid tests. What's one activity or subject recently where you found yourself genuinely absorbed in what you were doing?`
        }]
      });
    }

    // Append prior conversational messages
    messages.forEach((msg) => {
      chatHistory.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    });

    // Extract the latest user message
    const latestMessage = chatHistory.pop();
    if (!latestMessage || latestMessage.role !== 'user') {
      return {
        success: false,
        isAiPowered: false,
        error: 'No active user message provided.',
      };
    }

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(latestMessage.parts[0].text);
    const responseText = result.response.text();

    return {
      success: true,
      isAiPowered: true,
      reply: responseText,
      modelUsed: 'gemini-1.5-flash',
    };
  } catch (err) {
    console.error('Gemini API Error:', err);
    return {
      success: false,
      isAiPowered: false,
      error: err.message || 'Gemini API call failed',
    };
  }
}

export async function handleGeminiAnalysis(body) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      success: false,
      isAiPowered: false,
      error: 'GEMINI_API_KEY is not configured in server environment.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const { context = {}, conversation = [] } = body;

    const transcript = conversation
      .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    const prompt = `
Analyze the following student career guidance conversation and context.
Generate a strictly validated JSON object summarizing the student's profile and preliminary career matches.

STUDENT CONTEXT:
${JSON.stringify(context, null, 2)}

CONVERSATION TRANSCRIPT:
${transcript}

JSON Schema required:
{
  "expressedInterests": ["string"],
  "statedMotivations": ["string"],
  "preferredActivities": ["string"],
  "reportedSkills": ["string"],
  "demonstratedSkills": ["string"],
  "preferredEnvironments": ["string"],
  "statedConcerns": ["string"],
  "careerPreferences": ["string"],
  "remainingUncertainties": ["string"],
  "aiHypotheses": ["string (clearly distinguish AI inferences from explicit student statements)"],
  "dimensionScores": {
    "analytical": number (0-100),
    "creative": number (0-100),
    "technical": number (0-100),
    "social": number (0-100),
    "practical": number (0-100),
    "organizational": number (0-100)
  },
  "summaryNarrative": "A warm, 2-3 paragraph synthesis explaining what makes this student unique, highlighting their natural curiosities and where their strengths point.",
  "suggestedDiscussionTopicsForMentor": ["string"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return {
      success: true,
      isAiPowered: true,
      data: parsed,
      modelUsed: 'gemini-1.5-flash',
    };
  } catch (err) {
    console.error('Gemini Analysis Error:', err);
    return {
      success: false,
      isAiPowered: false,
      error: err.message || 'Gemini analysis failed',
    };
  }
}
