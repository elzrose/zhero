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

// Local intelligent rubric evaluator fallback
function evaluateCheckpointLocally(milestoneTitle, keyConcepts = [], studentResponse = '') {
  const text = (studentResponse || '').trim().toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 8) {
    return {
      score: 40,
      passed: false,
      rubricScores: {
        conceptualAccuracy: 45,
        practicalJustification: 30,
        absenceOfMisconceptions: 50,
      },
      feedback: 'Your explanation is very brief. To demonstrate complete understanding, explain the reasoning behind your choice and how the mechanics work.',
      identifiedStrengths: ['Initial attempt submitted'],
      identifiedMisconceptions: ['Insufficient technical depth to evaluate mastery'],
      followUpQuestion: null,
      remediationNeeded: true,
      remediationRecommendation: `Review the recommended documentation for ${milestoneTitle} and explain with a concrete code or architecture example.`,
    };
  }

  // Match key concept keywords
  const matchedConcepts = keyConcepts.filter((c) => {
    const words = c.toLowerCase().split(/\s+/);
    return words.some((w) => w.length > 3 && text.includes(w));
  });

  const conceptCoverage = keyConcepts.length > 0 ? (matchedConcepts.length / keyConcepts.length) : 0.8;
  const hasReasoning = text.includes('because') || text.includes('since') || text.includes('why') || text.includes('allows') || text.includes('instead') || text.includes('helps');

  let conceptualAccuracy = Math.min(95, Math.max(55, Math.round(50 + conceptCoverage * 40)));
  let practicalJustification = Math.min(95, Math.max(50, Math.round((hasReasoning ? 75 : 55) + Math.min(20, wordCount * 0.4))));
  let absenceOfMisconceptions = 90;

  if (wordCount > 35 && hasReasoning) {
    conceptualAccuracy = Math.min(98, conceptualAccuracy + 10);
    practicalJustification = Math.min(96, practicalJustification + 10);
  }

  const score = Math.round((conceptualAccuracy * 0.4) + (practicalJustification * 0.4) + (absenceOfMisconceptions * 0.2));
  const passed = score >= 70;

  return {
    score,
    passed,
    rubricScores: {
      conceptualAccuracy,
      practicalJustification,
      absenceOfMisconceptions,
    },
    feedback: passed
      ? `Strong explanation! You demonstrated solid command of ${keyConcepts.slice(0, 2).join(' and ') || 'the core principles'} and justified your practical approach well.`
      : `You have the right general idea, but need to provide a deeper explanation of the underlying mechanics before clearing this milestone.`,
    identifiedStrengths: matchedConcepts.length > 0
      ? matchedConcepts.map((c) => `Clear grasp of ${c}`)
      : ['Clear explanation of the problem context'],
    identifiedMisconceptions: passed ? [] : ['Lacks detailed justification on why this solution is optimal'],
    followUpQuestion: !passed && score >= 55 ? `Could you give a specific example of how you would handle this in a real-world project?` : null,
    remediationNeeded: !passed && score < 55,
    remediationRecommendation: !passed ? `Review the curated MDN & practical tutorials linked in this milestone.` : null,
  };
}

// Verbal AI Course Checkpoint Evaluation
export async function handleGeminiCheckpointEvaluation(body) {
  const {
    milestoneTitle = '',
    keyConcepts = [],
    checkpointPrompt = '',
    studentResponse = '',
  } = body;

  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `
You are the expert Technical Evaluator for ZHERO's adaptive learning checkpoints.
The student has submitted an explanation (either spoken aloud and transcribed, or typed) for a learning milestone.
Evaluate their response using this transparent 3-part rubric:
1. Conceptual Accuracy (0-100%): Did they correctly describe the underlying principles and technical mechanics?
2. Practical Justification & Depth (0-100%): Did they explain *why* this approach is used, trade-offs, or real-world application?
3. Absence of Misconceptions (0-100%): Did they avoid conflating concepts or stating inaccurate assumptions?

CRITICAL INSTRUCTIONS:
- Identify genuine understanding vs superficial memorization.
- Do NOT penalize brevity or speed if the core technical rationale is sound.
- If the student shows solid understanding (overall >= 70%), pass them.
- If they are close (50-69%), provide a targeted follow-up question.
- If they have significant misconceptions (< 50%), recommend remediation and allow retry.

MILESTONE: ${milestoneTitle}
EXPECTED KEY CONCEPTS: ${keyConcepts.join(', ')}
CHECKPOINT SCENARIO PROMPT: "${checkpointPrompt}"
STUDENT'S EXPLANATION: "${studentResponse}"

REQUIRED JSON SCHEMA:
{
  "score": number (0-100),
  "passed": boolean (score >= 70),
  "rubricScores": {
    "conceptualAccuracy": number (0-100),
    "practicalJustification": number (0-100),
    "absenceOfMisconceptions": number (0-100)
  },
  "feedback": "2-3 sentences of clear, encouraging, specific feedback",
  "identifiedStrengths": ["string"],
  "identifiedMisconceptions": ["string"],
  "followUpQuestion": string or null,
  "remediationNeeded": boolean,
  "remediationRecommendation": string or null
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      return {
        success: true,
        isAiPowered: true,
        data: parsed,
        modelUsed: 'gemini-2.5-flash',
      };
    } catch (err) {
      console.warn('Gemini Checkpoint Evaluation API error, falling back to local heuristic evaluator:', err);
    }
  }

  // Fallback intelligent evaluation engine
  return {
    success: true,
    isAiPowered: false,
    data: evaluateCheckpointLocally(milestoneTitle, keyConcepts, studentResponse),
    modelUsed: 'heuristic-rubric-engine',
  };
}

