// ZHERO — Explainable Rule-Based Course Matching & Assessment Diagnostic Engine
// Note: This is an explainable deterministic heuristic engine designed for the ZHERO platform MVP.
// It uses weighted vector matching across career goals, aptitude questions, and skill intersections.

/**
 * Evaluates assessment answers and computes career profiles, strengths, and skill gaps
 * @param {Array<{ questionId: string, optionIndex: number, selectedOption: any }>} responses
 */
export function evaluateAssessmentResponses(responses) {
  const domainScores = {
    'AI / ML Specialist': 0,
    'Full Stack Engineer': 0,
    'Data Analyst': 0,
    'Cybersecurity Analyst': 0,
    'UI / UX Designer': 0,
    'Embedded Systems Engineer': 0
  };

  const identifiedSkills = new Set();

  responses.forEach(res => {
    if (res.selectedOption) {
      const { domain, score, skills } = res.selectedOption;
      if (domain && domainScores[domain] !== undefined) {
        domainScores[domain] += (score || 10);
      }
      if (Array.isArray(skills)) {
        skills.forEach(s => identifiedSkills.add(s));
      }
    }
  });

  // Calculate percentage affinities (out of total possible points: 50)
  const rankedDomains = Object.entries(domainScores)
    .map(([domain, points]) => ({
      domain,
      points,
      affinityPercentage: Math.round((points / 50) * 100)
    }))
    .sort((a, b) => b.points - a.points);

  const topCareer = rankedDomains[0];
  const secondaryCareer = rankedDomains[1];

  // Derive domain-specific strengths & skill gaps
  const skillStrengths = Array.from(identifiedSkills);
  
  const domainSkillMap = {
    'AI / ML Specialist': {
      core: ['Linear Algebra & Calculus', 'Python', 'Machine Learning Algorithms', 'Deep Learning Architectures', 'Model Deployment'],
      gaps: ['Deep Learning Frameworks (PyTorch/TensorFlow)', 'Data Pipeline Wrangling', 'High-Performance Inference']
    },
    'Full Stack Engineer': {
      core: ['Modern JavaScript/TypeScript', 'Frontend Architecture', 'REST & GraphQL APIs', 'Relational Databases', 'Cloud Deployments'],
      gaps: ['Microservices Communication', 'State Management Patterns', 'Docker Container Orchestration']
    },
    'Data Analyst': {
      core: ['SQL Querying', 'Exploratory Data Analysis', 'BI Dashboards', 'Statistical Hypothesis Testing', 'Storytelling with Data'],
      gaps: ['Advanced DAX in Power BI', 'Predictive Modeling with Scikit-Learn', 'Automated ETL Pipelines']
    },
    'Cybersecurity Analyst': {
      core: ['TCP/IP Network Security', 'Linux System Administration', 'Threat Surface Auditing', 'SIEM Log Monitoring', 'Incident Response'],
      gaps: ['Penetration Testing Frameworks (Burp/Metasploit)', 'OWASP Top 10 Exploitation', 'Zero-Trust Architecture']
    },
    'UI / UX Designer': {
      core: ['Visual Hierarchy & Typography', 'Wireframing & Information Architecture', 'Figma Prototyping', 'User Research', 'Design Systems'],
      gaps: ['Interactive Micro-Animations', 'Quantitative Usability Testing', 'Design Token Handoff to Engineers']
    },
    'Embedded Systems Engineer': {
      core: ['C / Embedded C', 'Microcontroller Architecture (ESP32/ARM)', 'Sensor Interfaces & SPI/I2C', 'PCB Schematic Reading', 'IoT Mesh Protocols'],
      gaps: ['Real-Time Operating Systems (RTOS)', 'Low-Power Sleep Optimization', 'Edge ML Firmware']
    }
  };

  const domainData = domainSkillMap[topCareer.domain] || domainSkillMap['Full Stack Engineer'];

  return {
    topCareer: topCareer.domain,
    topCareerAffinity: Math.max(70, topCareer.affinityPercentage),
    secondaryCareer: secondaryCareer.domain,
    allDomainAffinities: rankedDomains,
    strengths: skillStrengths.length > 0 ? skillStrengths.slice(0, 4) : domainData.core.slice(0, 3),
    skillGaps: domainData.gaps,
    suggestedFocusArea: domainData.core[2] || 'System Architecture'
  };
}

/**
 * Calculates a transparent, deterministic match score between a prospective student/lead and a course
 * @param {Object} student - Student or Lead profile
 * @param {Object} course - Course object from catalogue
 * @returns {Object} { matchScore: number, matchPercentage: number, factors: string[], matchingSkills: string[], skillsToAcquire: string[] }
 */
export function calculateCourseMatch(student, course) {
  if (!student || !course) {
    return { matchScore: 0, matchPercentage: 0, factors: ['Insufficient record data'], matchingSkills: [], skillsToAcquire: [] };
  }

  let totalScore = 0;
  const factors = [];
  const targetCareer = student.targetCareer || '';
  const studentStrengths = Array.isArray(student.strengths) ? student.strengths : [];
  const studentGaps = Array.isArray(student.skillGaps) ? student.skillGaps : [];

  // Factor 1: Career Alignment (50% max)
  const isDirectCareerMatch = course.relatedCareers.some(rc => 
    rc.toLowerCase().includes(targetCareer.toLowerCase()) || 
    targetCareer.toLowerCase().includes(rc.toLowerCase())
  );

  if (isDirectCareerMatch) {
    totalScore += 50;
    factors.push(`Primary Career Alignment: Course directly prepares for target role "${targetCareer}" (+50%)`);
  } else {
    // Check partial category alignment
    const isCategoryRelated = (
      (targetCareer.includes('AI') && course.category.includes('Intelligence')) ||
      (targetCareer.includes('Data') && course.category.includes('Analytics')) ||
      (targetCareer.includes('Full Stack') && course.category.includes('Software')) ||
      (targetCareer.includes('Security') && course.category.includes('Security')) ||
      (targetCareer.includes('Designer') && course.category.includes('Design')) ||
      (targetCareer.includes('Embedded') && course.category.includes('Hardware'))
    );
    if (isCategoryRelated) {
      totalScore += 35;
      factors.push(`Secondary Career Synergy: Course domain overlaps with chosen field (+35%)`);
    } else {
      totalScore += 15;
      factors.push(`General Skill Development: Provides cross-functional technical foundation (+15%)`);
    }
  }

  // Factor 2: Skill Intersection & Gap Coverage (35% max)
  const matchingSkills = [];
  const skillsToAcquire = [];

  course.skills.forEach(courseSkill => {
    const matchesStrength = studentStrengths.some(str => 
      str.toLowerCase().includes(courseSkill.toLowerCase()) || 
      courseSkill.toLowerCase().includes(str.toLowerCase())
    );
    const bridgesGap = studentGaps.some(gap =>
      gap.toLowerCase().includes(courseSkill.toLowerCase()) ||
      courseSkill.toLowerCase().includes(gap.toLowerCase())
    );

    if (matchesStrength) {
      matchingSkills.push(courseSkill);
    } else {
      skillsToAcquire.push(courseSkill + (bridgesGap ? ' (Bridges Gap)' : ''));
    }
  });

  const skillMatchPoints = Math.min(35, Math.round((matchingSkills.length * 8) + (skillsToAcquire.length * 4)));
  totalScore += skillMatchPoints;

  if (matchingSkills.length > 0) {
    factors.push(`Skill Synergy: Leverages ${matchingSkills.length} existing competencies (${matchingSkills.slice(0, 2).join(', ')}) (+${skillMatchPoints}%)`);
  } else {
    factors.push(`High Skill Acquisition Potential: Covers ${skillsToAcquire.length} new high-demand competencies (+${skillMatchPoints}%)`);
  }

  // Factor 3: Readiness & Prerequisite Fit (15% max)
  const readiness = student.readinessScore || 70;
  let readinessPoints = 10;
  if (course.difficulty === 'Beginner' || course.difficulty === 'Beginner to Advanced') {
    readinessPoints = 15;
    factors.push(`Prerequisite Eligibility: Course welcome to foundational learners (+15%)`);
  } else if (readiness >= 75) {
    readinessPoints = 15;
    factors.push(`Aptitude Match: Student diagnostic score (${readiness}%) satisfies intermediate prerequisites (+15%)`);
  } else {
    readinessPoints = 10;
    factors.push(`Moderate Challenge: Core foundation suggested alongside course pace (+10%)`);
  }
  totalScore += readinessPoints;

  // Cap between 40% and 98%
  const finalScore = Math.min(98, Math.max(40, totalScore));

  return {
    matchScore: finalScore,
    matchPercentage: finalScore,
    factors,
    matchingSkills,
    skillsToAcquire
  };
}

/**
 * Returns sorted recommendations for a given student or lead across all available courses
 */
export function getRecommendedCourses(student, allCourses = []) {
  if (!student || !allCourses.length) return [];

  return allCourses
    .map(course => {
      const match = calculateCourseMatch(student, course);
      return {
        course,
        ...match
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
