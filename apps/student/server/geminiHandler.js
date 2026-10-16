/**
 * Server-Side Gemini API Handler for ZHERO Student Platform
 * Keeps GEMINI_API_KEY secure on the server side; never bundled into frontend assets.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

function getApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    return process.env.GEMINI_API_KEY;
  }
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), 'apps/student/.env'),
      path.resolve(process.cwd(), '../.env'),
      path.resolve(process.cwd(), '../../.env'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
        if (match && match[1] && match[1].trim() && match[1].trim() !== 'your_gemini_api_key_here') {
          process.env.GEMINI_API_KEY = match[1].trim();
          return match[1].trim();
        }
      }
    }
  } catch {}
  return '';
}

export async function handleGeminiMcqAnalysis(body) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      isAiPowered: false,
      error: 'GEMINI_API_KEY is not configured in server environment.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const { studentInfo = {}, mcqAnswers = [], dimensionScores = {} } = body;

    const prompt = `
You are the expert, empathetic Career Guidance Engine for ZHERO.
Evaluate the following student's profile, including their current class, course, descriptive interests, and scenario-based MCQ assessment results.
Produce a strictly validated JSON object containing the top 5 personalized career matches and holistic insights.

STUDENT INTAKE:
- Current Class / Grade: ${studentInfo.classGrade || 'Not specified'}
- Course / Stream: ${studentInfo.courseStream || 'Not specified'}
- Stated Interests in their own words: "${studentInfo.descriptiveInterests || 'Exploring passions'}"

MCQ COGNITIVE DIMENSION BREAKDOWN:
- Analytical: ${dimensionScores.analytical || 0} / 100
- Creative: ${dimensionScores.creative || 0} / 100
- Technical: ${dimensionScores.technical || 0} / 100
- Social & Mentorship: ${dimensionScores.social || 0} / 100
- Practical & Hands-On: ${dimensionScores.practical || 0} / 100
- Organizational: ${dimensionScores.organizational || 0} / 100

REQUIRED JSON SCHEMA:
{
  "top5Careers": [
    {
      "id": "slug-string",
      "title": "Career Title",
      "matchScore": number (75-98),
      "description": "Clear 2-sentence description of the career",
      "whyFit": "Explain why this career matches their specific descriptive interests AND their MCQ cognitive traits",
      "keyStrengths": ["string"],
      "skillsToDevelop": ["string"],
      "workExample": "Realistic day-in-the-life task or project",
      "mentorDiscussionQuestions": "1 key doubt or question to discuss with the human career mentor in the upcoming Meet"
    }
  ],
  "holisticProfile": {
    "keyTheme": "A concise headline capturing their unique profile (e.g., Creative Problem Solver with High Technical Curiosity)",
    "strengthSummary": "2-3 sentences summarizing their natural strengths based on their descriptive interests and MCQ patterns",
    "recommendedFocusForMeet": "Specific advice on what the student should ask their mentor in the upcoming live video Meet"
  }
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
    console.error('Gemini MCQ Analysis Error:', err);
    return {
      success: false,
      isAiPowered: false,
      error: err.message || 'Gemini MCQ analysis failed',
    };
  }
}

// Backward compatibility for conversational chat if needed
export async function handleGeminiChat(body) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      isAiPowered: false,
      error: 'GEMINI_API_KEY is not configured in server environment.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const { messages = [] } = body;
    const lastMsg = messages[messages.length - 1]?.text || 'Hello';
    const result = await model.generateContent(`You are an empathetic ZHERO career guide. Respond thoughtfully to: ${lastMsg}`);
    return {
      success: true,
      isAiPowered: true,
      reply: result.response.text(),
      modelUsed: 'gemini-2.5-flash',
    };
  } catch (err) {
    return { success: false, isAiPowered: false, error: err.message };
  }
}

export async function handleGeminiAnalysis(body) {
  return handleGeminiMcqAnalysis(body);
}
