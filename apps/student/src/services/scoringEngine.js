/**
 * ZHERO Assessment Scoring Engine
 * Deterministic psychometric mapping engine that matches student preferences
 * to career profiles based on multi-dimensional cognitive alignment.
 */

import { CAREERS_DATA } from '../data/careersData';
import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';

export function calculateAssessmentResults(answersMap) {
  // 1. Initialize raw dimension totals
  const dimensions = {
    analytical: 0,
    creative: 0,
    technical: 0,
    social: 0,
    practical: 0,
    organizational: 0,
  };

  // 2. Accumulate scores from chosen options
  ASSESSMENT_QUESTIONS.forEach((q) => {
    const selectedOptionIndex = answersMap[q.id];
    if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex]) {
      const optionScores = q.options[selectedOptionIndex].scores || {};
      Object.keys(optionScores).forEach((dim) => {
        if (dimensions[dim] !== undefined) {
          dimensions[dim] += optionScores[dim];
        }
      });
    }
  });

  // 3. Normalize dimensions to 0 - 100 scale
  // Max possible raw points per dimension across 16 questions is ~18-24
  const normalizedDimensions = {};
  const maxBenchmark = 20;

  Object.keys(dimensions).forEach((dim) => {
    const scorePct = Math.min(100, Math.round((dimensions[dim] / maxBenchmark) * 100));
    normalizedDimensions[dim] = Math.max(15, scorePct); // Baseline of 15 for aesthetics
  });

  // 4. Calculate match score against all careers
  const scoredCareers = CAREERS_DATA.map((career) => {
    const cDim = career.dimensions;

    // Weighted distance calculation
    let totalDiff = 0;
    let weightSum = 0;

    Object.keys(normalizedDimensions).forEach((dim) => {
      const studentVal = normalizedDimensions[dim];
      const careerVal = cDim[dim] || 50;
      // High importance given to dimensions where career demands 70+
      const weight = careerVal > 70 ? 1.5 : 1.0;
      const diff = Math.abs(studentVal - careerVal);
      totalDiff += diff * weight;
      weightSum += weight;
    });

    const avgDiff = totalDiff / weightSum;
    // Base match bounded between 62% and 98%
    const rawMatch = 100 - (avgDiff * 0.7);
    const matchScore = Math.min(98, Math.max(62, Math.round(rawMatch)));

    // Generate deterministic explanations
    const topStudentDims = Object.entries(normalizedDimensions)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    const primaryStrength = topStudentDims[0];
    const secondaryStrength = topStudentDims[1];

    const matchReason = `Your strong ${capitalize(primaryStrength)} (${normalizedDimensions[primaryStrength]}%) and ${capitalize(secondaryStrength)} (${normalizedDimensions[secondaryStrength]}%) preferences directly align with the core day-to-day requirements of a ${career.title}.`;

    return {
      ...career,
      matchScore,
      matchReason,
      alignedStrengths: [capitalize(primaryStrength), capitalize(secondaryStrength)],
      developmentAreas: career.requiredSkills.slice(0, 2).map((s) => s.name),
    };
  });

  // 5. Sort descending by match score and pick top 5
  scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
  const topRecommendations = scoredCareers.slice(0, 5);

  return {
    dimensions: normalizedDimensions,
    topRecommendations,
    completedAt: new Date().toISOString(),
    primaryInterest: capitalize(
      Object.entries(normalizedDimensions).sort((a, b) => b[1] - a[1])[0][0]
    ),
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
