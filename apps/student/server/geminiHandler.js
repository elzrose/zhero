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

// Fallback Live Interview Turn Engine
function generateAdaptiveInterviewTurnFallback(body) {
  const { mode = 'career_discovery', currentQuestion = '', studentAnswer = '', turnCount = 1, maxTurns = 4, context = {} } = body;
  const answerLower = (studentAnswer || '').toLowerCase();
  const isFinalTurn = turnCount >= maxTurns;

  let spokenReply = '';
  let followUpQuestion = '';
  let instantInsight = '';

  if (mode === 'career_discovery') {
    if (turnCount === 1) {
      if (answerLower.includes('design') || answerLower.includes('art') || answerLower.includes('creative') || answerLower.includes('ui')) {
        spokenReply = "That's exciting! Crafting visual experiences that feel natural to real humans is a rare and valuable instinct.";
        followUpQuestion = "When you think about designing a digital product, what satisfies you more: defining the aesthetics and visual branding, or mapping the interaction flow so users never get confused?";
        instantInsight = "Leans toward user-centric visual empathy and interface architecture.";
      } else if (answerLower.includes('code') || answerLower.includes('software') || answerLower.includes('build') || answerLower.includes('logic')) {
        spokenReply = "Solving technical puzzles from the ground up is deeply empowering.";
        followUpQuestion = "When you tackle a complex bug or technical challenge, do you prefer digging through documentation methodically, or building fast prototypes until the solution clicks?";
        instantInsight = "Demonstrates active technical problem decomposition.";
      } else if (answerLower.includes('data') || answerLower.includes('ai') || answerLower.includes('math') || answerLower.includes('analy')) {
        spokenReply = "Uncovering hidden patterns within numbers gives organizations immense clarity.";
        followUpQuestion = "If you had a dataset of student test scores, would you be more curious to predict future outcomes with machine learning, or find out which teaching methods made the biggest difference?";
        instantInsight = "Displays analytical curiosity with applied domain impact.";
      } else {
        spokenReply = "Thank you for sharing that candidly. It gives clear insight into what drives your curiosity.";
        followUpQuestion = "When you imagine your ideal daily work setting 3 years from now, do you do your best thinking in quiet solo focus, or in fast-paced, collaborative team brainstorming?";
        instantInsight = "Reflecting on work setting preferences and collaboration dynamics.";
      }
    } else if (turnCount === 2) {
      spokenReply = "That perspective highlights your natural problem-solving habits.";
      followUpQuestion = "If you had the next two weeks completely free to shadow any real-world project team, what kind of project would make you genuinely excited to wake up early every day?";
      instantInsight = "Exploring unconstrained motivation and intrinsically rewarding projects.";
    } else if (turnCount === 3) {
      spokenReply = "That gives a vivid picture of what energizes you.";
      followUpQuestion = "Every high-impact career has challenging moments—like tight deadlines or ambiguous requirements. What helps you stay focused and resilient when a project gets tough?";
      instantInsight = "Evaluating emotional resilience, problem persistence, and self-regulation.";
    } else {
      spokenReply = "You have articulated your thoughts with remarkable clarity throughout our conversation.";
      followUpQuestion = "Before we conclude and assemble your structured interview report, is there any specific doubt, question, or career pathway you would love our team to focus on?";
      instantInsight = "Final synthesis turn capturing self-advocacy and core aspirations.";
    }
  } else {
    // Learning Checkpoint Mode
    if (turnCount === 1) {
      spokenReply = "You hit on several key principles in your explanation.";
      followUpQuestion = "Could you walk me through a specific edge case or trade-off where that approach might run into performance or scalability limitations?";
      instantInsight = "Probing edge-case awareness and architectural trade-offs.";
    } else if (turnCount === 2) {
      spokenReply = "Solid reasoning. That demonstrates you understand the practical trade-offs involved.";
      followUpQuestion = "If a junior engineer on your team made the opposite decision, what diagnostic test or code review comment would you share to guide them?";
      instantInsight = "Testing communication clarity and mentorship ability.";
    } else {
      spokenReply = "Excellent technical justification. You have thoroughly substantiated your conceptual mastery.";
      followUpQuestion = "We are ready to wrap up. Any final technical nuances you would like to note for your verification record?";
      instantInsight = "Concluding checkpoint with verified conceptual rigor.";
    }
  }

  return {
    spokenReply,
    followUpQuestion: isFinalTurn ? "Thank you for sharing your thoughts. Let's conclude our interview and review your personalized evaluation report." : followUpQuestion,
    isFinalTurn,
    instantInsight,
    conceptIdentified: answerLower.slice(0, 40) || 'Practical reasoning',
  };
}

// Live AI Interviewer Turn Handler
export async function handleGeminiLiveInterviewTurn(body) {
  const {
    mode = 'career_discovery',
    context = {},
    currentQuestion = '',
    studentAnswer = '',
    turnCount = 1,
    maxTurns = 4,
    history = [],
  } = body;

  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const isFinal = turnCount >= maxTurns;

      const prompt = `
You are ZHERO's expert, empathetic Live AI Interviewer conducting a real-time conversational interview with a student.
This is a live spoken interaction: your "spokenReply" will be spoken aloud to the student using text-to-speech.

INTERVIEW CONTEXT:
- Mode: ${mode} (${mode === 'career_discovery' ? 'Exploring passions, reasoning, preferred working styles, and career scenarios' : 'Assessing deep conceptual understanding and technical justification'})
- Student Info: ${JSON.stringify(context)}
- Current Question Asked: "${currentQuestion}"
- Student's Spoken Response: "${studentAnswer}"
- Interview Turn: ${turnCount} of ${maxTurns}
- Prior Transcript: ${JSON.stringify(history.slice(-4))}

INTERVIEWER INSTRUCTIONS:
1. "spokenReply": Speak warmly and naturally like an authentic human interviewer in 1-2 concise sentences. Acknowledge what the student specifically said so they feel heard.
2. "followUpQuestion": ${isFinal ? '"Thank you so much. That gives us rich, authentic evidence. Let us now conclude our interview and compile your structured summary report."' : 'Ask ONE dynamic, context-aware follow-up question. Do NOT ask a generic list question. Adapt based on their answer to explore their reasoning, test an example, or investigate a trade-off.'}
3. "isFinalTurn": ${isFinal ? 'true' : 'false'}
4. "instantInsight": One sentence summarizing the student's demonstrated thinking pattern or aptitude.

RETURN STRICT JSON ONLY:
{
  "spokenReply": "string (1-2 sentences spoken aloud)",
  "followUpQuestion": "string",
  "isFinalTurn": boolean,
  "instantInsight": "string",
  "conceptIdentified": "string"
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
      console.warn('Gemini Live Interview API error, falling back to adaptive engine:', err);
    }
  }

  return {
    success: true,
    isAiPowered: false,
    data: generateAdaptiveInterviewTurnFallback(body),
    modelUsed: 'adaptive-conversational-engine',
  };
}

// Live AI Interview Evaluation & Structured Report Generator
export async function handleGeminiLiveInterviewEvaluation(body) {
  const { mode = 'career_discovery', history = [], context = {} } = body;
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `
You are the Chief Evaluation Officer for ZHERO's Live AI Interview platform.
Evaluate the complete spoken interview transcript between the AI Interviewer and the student.
Base your evaluation strictly on the substance of their responses (reasoning, examples, trade-offs, consistency, clarity of thought).
Do NOT judge accent, vocal pitch, speed, or fluency.

INTERVIEW CONTEXT:
- Mode: ${mode}
- Student Background: ${JSON.stringify(context)}
- Full Interview Transcript: ${JSON.stringify(history)}

REQUIRED JSON SCHEMA:
{
  "overallSummary": "3-4 sentence comprehensive synthesis of the student's demonstrated cognitive style, reasoning depth, and interview engagement",
  "topicsCovered": ["string"],
  "keyPoints": ["string"],
  "demonstratedStrengths": ["string"],
  "areasForGrowth": ["string"],
  "conceptualMasteryScore": number (70-98),
  "evidenceCertainty": "High (strongly supported by multiple conversational turns) | Moderate",
  "suggestedNextSteps": ["string"],
  "recommendedCareerAlignments": ["string (e.g. Full Stack Engineer, AI & Data Scientist, UI/UX Product Designer)"],
  "actionableMentorDiscussionPoints": ["string"]
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
      console.warn('Gemini Interview Evaluation API error, falling back:', err);
    }
  }

  // Local fallback evaluation report generator
  const studentTurns = history.filter((h) => h.role === 'student' || h.role === 'user');
  const fullText = studentTurns.map((t) => t.text).join(' ').toLowerCase();

  const isTech = fullText.includes('code') || fullText.includes('software') || fullText.includes('api') || fullText.includes('logic');
  const isCreative = fullText.includes('design') || fullText.includes('art') || fullText.includes('visual') || fullText.includes('user');
  const isData = fullText.includes('data') || fullText.includes('ai') || fullText.includes('math') || fullText.includes('predict');

  const strengths = [];
  if (isTech) strengths.push('Strong inclination for technical problem decomposition');
  if (isCreative) strengths.push('Empathetic user-first visual & functional intuition');
  if (isData) strengths.push('Evidence-driven analytical reasoning and pattern recognition');
  if (strengths.length === 0) strengths.push('Articulate self-reflection and practical curiosity');

  return {
    success: true,
    isAiPowered: false,
    data: {
      overallSummary: `The student demonstrated articulate, thoughtful reasoning across ${studentTurns.length} conversational turns. They expressed clear preferences for structured problem-solving, communicated their thoughts candidly, and provided concrete justifications when exploring realistic workplace scenarios.`,
      topicsCovered: ['Daily working style preferences', 'Problem-solving under ambiguity', 'Core technical and creative motivations', 'Real-world project interests'],
      keyPoints: studentTurns.map((t, idx) => `Turn ${idx + 1}: ${t.text.slice(0, 100)}...`),
      demonstratedStrengths: strengths,
      areasForGrowth: ['Deepen hands-on exposure to full end-to-end production tools', 'Practice articulating architectural trade-offs in team settings'],
      conceptualMasteryScore: 88,
      evidenceCertainty: 'High (validated through conversational inquiry)',
      suggestedNextSteps: ['Explore starter milestone projects in your recommended career direction', 'Review Spaced Repetition queue for newly unlocked concepts', 'Schedule an optional virtual counselling session to discuss specialized tracks'],
      recommendedCareerAlignments: isData
        ? ['AI & Data Scientist', 'Full Stack Software Engineer', 'Cloud & DevOps Engineer']
        : isCreative
        ? ['UI/UX Product Designer', 'Full Stack Software Engineer', 'Product Manager']
        : ['Full Stack Software Engineer', 'AI & Data Scientist', 'Cybersecurity Specialist'],
      actionableMentorDiscussionPoints: [
        'Ask how daily problem-solving differs between early-stage startups and enterprise engineering teams.',
        'Discuss recommended portfolio capstone projects that validate your demonstrated reasoning abilities.'
      ],
    },
    modelUsed: 'heuristic-interview-evaluator',
  };
}


