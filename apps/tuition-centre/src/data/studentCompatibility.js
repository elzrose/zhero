// ZHERO — Student Platform Compatibility & Shared Data Model
// Mirrors the Student App's psychometric assessment (16 questions, 6 dimensions),
// 12 career profiles, scoring engine, verbal checkpoints, and spaced repetition engine.

export const ASSESSMENT_DIMENSIONS = [
  { key: 'analytical', label: 'Analytical', color: '#1976D2', desc: 'Logical decomposition, data analysis, quantitative reasoning' },
  { key: 'creative', label: 'Creative', color: '#8C6A05', desc: 'Visual intuition, novel concepts, open-ended problem solving' },
  { key: 'technical', label: 'Technical', color: '#C4971A', desc: 'Digital systems, code architecture, algorithmic tooling' },
  { key: 'social', label: 'Social', color: '#1E7E34', desc: 'Interpersonal empathy, communication, collaborative mentoring' },
  { key: 'practical', label: 'Practical', color: '#B78103', desc: 'Hands-on prototyping, physical mechanisms, tangible construction' },
  { key: 'organizational', label: 'Organizational', color: '#6A1B9A', desc: 'Structured workflows, planning, boundary management' },
];

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    category: 'Problem Decomposition',
    dimensionName: 'Analytical & Technical',
    question: 'When you are confronted with a difficult, multi-step problem, what is your natural first reaction?',
    options: [
      { text: 'Break it down into logical component parts and analyze the data/facts.', scores: { analytical: 3, technical: 2 } },
      { text: 'Brainstorm creative, unconventional solutions that others might overlook.', scores: { creative: 3, analytical: 1 } },
      { text: 'Gather a group of peers to discuss perspectives and solve it collaboratively.', scores: { social: 3, organizational: 1 } },
      { text: 'Immediately start experimenting hands-on with a tangible working trial.', scores: { practical: 3, technical: 1 } }
    ]
  },
  {
    id: 2,
    category: 'Work Environment',
    dimensionName: 'Practical & Social',
    question: 'In which work or study setting do you feel most energized and productive?',
    options: [
      { text: 'A deep-focus, quiet workspace with digital dual monitors and code/data tools.', scores: { technical: 3, analytical: 2 } },
      { text: 'A dynamic, visually inspiring creative studio with whiteboards and moodboards.', scores: { creative: 3, social: 1 } },
      { text: 'An active environment interacting directly with people, mentoring or presenting.', scores: { social: 3, organizational: 2 } },
      { text: 'A hands-on lab, field environment, or maker-space working with physical equipment.', scores: { practical: 3, organizational: 1 } }
    ]
  },
  {
    id: 3,
    category: 'Creative Expression',
    dimensionName: 'Creative & Analytical',
    question: 'If you were given a weekend to create a passion project from scratch, which would you pick?',
    options: [
      { text: 'Design the visual interface and branding for an innovative mobile application.', scores: { creative: 3, technical: 1 } },
      { text: 'Write a script or web app that automates repetitive daily tasks.', scores: { technical: 3, analytical: 2 } },
      { text: 'Organize a community study cohort or charity fundraising campaign.', scores: { social: 3, organizational: 3 } },
      { text: 'Analyze public data to discover surprising trends in sports, finance, or climate.', scores: { analytical: 3, technical: 2 } }
    ]
  },
  {
    id: 4,
    category: 'Technology & Digital Tools',
    dimensionName: 'Technical & Practical',
    question: 'When learning a new technological tool or software framework, how do you approach it?',
    options: [
      { text: 'Read the official documentation and understand the architectural principles thoroughly.', scores: { analytical: 3, technical: 2 } },
      { text: 'Jump directly into building something and troubleshoot errors as they occur.', scores: { practical: 3, technical: 2 } },
      { text: 'Watch video tutorials that highlight visual examples and design possibilities.', scores: { creative: 2, social: 1 } },
      { text: 'Ask an expert or collaborate with a friend to master it together.', scores: { social: 2, organizational: 2 } }
    ]
  },
  {
    id: 5,
    category: 'Collaboration & Team Role',
    dimensionName: 'Social & Organizational',
    question: 'In a group project with 4 peers, what role do you naturally gravitate towards?',
    options: [
      { text: 'The Lead Architect / Developer who builds the core functional engine.', scores: { technical: 3, practical: 2 } },
      { text: 'The Creative Visionary who defines the look, feel, user journey, and pitch.', scores: { creative: 3, social: 2 } },
      { text: 'The Coordinator who keeps milestones organized, tracks deadlines, and ensures delivery.', scores: { organizational: 3, analytical: 2 } },
      { text: 'The Facilitator who maintains morale, handles presentations, and keeps team aligned.', scores: { social: 3, organizational: 1 } }
    ]
  },
  {
    id: 6,
    category: 'Intellectual Curiosity',
    dimensionName: 'Analytical & Creative',
    question: 'Which of the following topics would you most enjoy reading a 20-page deep-dive article about?',
    options: [
      { text: 'How artificial intelligence algorithms learn from massive datasets.', scores: { analytical: 3, technical: 3 } },
      { text: 'The psychological principles behind why people make decisions and buy things.', scores: { social: 2, analytical: 2 } },
      { text: 'How clean energy and sustainable urban engineering can reshape modern cities.', scores: { practical: 2, analytical: 2 } },
      { text: 'The evolution of graphic design, typography, and human-computer interactions.', scores: { creative: 3, practical: 1 } }
    ]
  },
  {
    id: 7,
    category: 'Handling Ambiguity',
    dimensionName: 'Organizational & Creative',
    question: 'When an assignment or project prompt is vague and open-ended, what do you do?',
    options: [
      { text: 'Embrace the freedom and experiment with an imaginative, unique concept.', scores: { creative: 3, practical: 1 } },
      { text: 'Formulate a structured framework and define clear boundary constraints yourself.', scores: { organizational: 3, analytical: 2 } },
      { text: 'Discuss with mentors or peers to understand their expectations and consensus.', scores: { social: 3, organizational: 1 } },
      { text: 'Research established benchmarks and build a reliable prototype to validate.', scores: { practical: 2, technical: 2 } }
    ]
  },
  {
    id: 8,
    category: 'Mathematical & Logical Reasoning',
    dimensionName: 'Analytical',
    question: 'How do you feel when working with numbers, statistics, formulas, or logic puzzles?',
    options: [
      { text: 'I enjoy the clarity and satisfaction of finding an exact, verifiable solution.', scores: { analytical: 3, technical: 2 } },
      { text: 'I like using numbers as evidence to uncover deeper patterns or support stories.', scores: { analytical: 2, creative: 1 } },
      { text: 'I find formulas useful mainly when they help build or fix a tangible physical thing.', scores: { practical: 3, analytical: 1 } },
      { text: 'I prefer narrative, visual, or interpersonal challenges over pure calculations.', scores: { social: 2, creative: 2 } }
    ]
  },
  {
    id: 9,
    category: 'Hands-on Construction',
    dimensionName: 'Practical & Technical',
    question: 'Have you ever taken something apart just to understand how the internal mechanism works?',
    options: [
      { text: 'Yes, physical devices, gadgets, electronics, or bicycle parts fascinated me.', scores: { practical: 3, technical: 2 } },
      { text: 'Yes, software code, website scripts, or game modifications fascinated me.', scores: { technical: 3, analytical: 2 } },
      { text: 'More than physical objects, I analyze why stories, ads, or companies succeed.', scores: { analytical: 2, creative: 2 } },
      { text: 'I am more curious about human behavior and interpersonal relationships.', scores: { social: 3, analytical: 1 } }
    ]
  },
  {
    id: 10,
    category: 'Communication Style',
    dimensionName: 'Social & Creative',
    question: 'When explaining a complex idea to someone who is unfamiliar with it, you usually:',
    options: [
      { text: 'Use visual diagrams, sketches, or analogies to make it intuitive.', scores: { creative: 3, social: 1 } },
      { text: 'Walk through clear step-by-step logic and structured bullet points.', scores: { organizational: 2, analytical: 2 } },
      { text: 'Ask them questions to understand their current knowledge and adapt patiently.', scores: { social: 3, organizational: 1 } },
      { text: 'Show a live demonstration or prototype in action.', scores: { practical: 3, technical: 1 } }
    ]
  },
  {
    id: 11,
    category: 'Values & Motivation',
    dimensionName: 'Purpose & Meaning',
    question: 'At the end of a long work day, what kind of accomplishment makes you feel proudest?',
    options: [
      { text: 'Knowing that I built a smooth, high-performing software feature or system.', scores: { technical: 3, practical: 2 } },
      { text: 'Knowing that I directly helped a student or person overcome a real struggle.', scores: { social: 3, organizational: 1 } },
      { text: 'Knowing that I uncovered a non-obvious insight through rigorous analysis.', scores: { analytical: 3, organizational: 1 } },
      { text: 'Knowing that I created something beautiful, original, and visually inspiring.', scores: { creative: 3, practical: 1 } }
    ]
  },
  {
    id: 12,
    category: 'Detail Orientation',
    dimensionName: 'Organizational & Practical',
    question: 'How do you organize your study schedule, personal tasks, and notes?',
    options: [
      { text: 'Carefully organized folders, clear calendars, and color-coded priority lists.', scores: { organizational: 3, analytical: 1 } },
      { text: 'Digital bookmarks, markdown notes, and automated notification reminders.', scores: { technical: 2, organizational: 2 } },
      { text: 'Flexible, organic notes with mindmaps, sketches, and sticky reminders.', scores: { creative: 2, practical: 1 } },
      { text: 'I keep priorities mostly in my head and focus on immediate physical tasks.', scores: { practical: 2, social: 1 } }
    ]
  },
  {
    id: 13,
    category: 'Stress & Pressure',
    dimensionName: 'Decision Making',
    question: 'Under sudden deadline pressure or an unexpected system failure, how do you react?',
    options: [
      { text: 'Stay calm, systematically diagnose root causes, and isolate the bug.', scores: { analytical: 3, technical: 2 } },
      { text: 'Take charge, delegate responsibilities clearly, and reassure the team.', scores: { organizational: 3, social: 2 } },
      { text: 'Improvise a clever temporary workaround to keep things moving forward.', scores: { creative: 2, practical: 2 } },
      { text: 'Roll up my sleeves and do the manual heavy lifting to get it completed.', scores: { practical: 3, organizational: 1 } }
    ]
  },
  {
    id: 14,
    category: 'Feedback & Critique',
    dimensionName: 'Growth Orientation',
    question: 'When receiving critical feedback on your work or creative project, what is your mindset?',
    options: [
      { text: 'I examine the objective criteria to find measurable areas for improvement.', scores: { analytical: 2, organizational: 2 } },
      { text: 'I appreciate learning how different people perceive and feel about my creation.', scores: { social: 2, creative: 2 } },
      { text: 'I test different iterations rapidly until the performance numbers improve.', scores: { practical: 2, technical: 2 } },
      { text: 'I rework the visual or storytelling concept to make it even more compelling.', scores: { creative: 3, analytical: 1 } }
    ]
  },
  {
    id: 15,
    category: 'Future Aspirations',
    dimensionName: 'Long-term Goals',
    question: 'In 5 years, which kind of professional achievement excites you the most?',
    options: [
      { text: 'Leading the technical architecture of a software platform used by millions.', scores: { technical: 3, analytical: 2 } },
      { text: 'Running my own creative agency or directing design for iconic products.', scores: { creative: 3, organizational: 2 } },
      { text: 'Managing a thriving educational institute or high-impact community initiative.', scores: { social: 3, organizational: 3 } },
      { text: 'Solving complex data, scientific, or environmental problems with global impact.', scores: { analytical: 3, practical: 2 } }
    ]
  },
  {
    id: 16,
    category: 'Learning Preferences',
    dimensionName: 'Cognitive Style',
    question: 'Which method helps you retain knowledge most effectively when studying a new concept?',
    options: [
      { text: 'Building a working project or interactive experiment from scratch.', scores: { practical: 3, technical: 2 } },
      { text: 'Drawing visual concept maps, diagrams, and illustrative flowcharts.', scores: { creative: 2, analytical: 2 } },
      { text: 'Explaining and teaching the concept to a study partner or group.', scores: { social: 3, organizational: 2 } },
      { text: 'Synthesizing comprehensive summary notes and structured reference sheets.', scores: { organizational: 3, analytical: 2 } }
    ]
  }
];

export const CAREERS_CATALOGUE = [
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Software Engineer',
    category: 'Technology',
    badge: 'High Demand',
    description: 'Designs, develops, and maintains scalable web applications spanning client-side interfaces, server-side APIs, and cloud databases.',
    dimensions: { analytical: 85, creative: 65, technical: 95, social: 60, practical: 80, organizational: 70 },
    avgSalary: '₹8.5 – 18 LPA',
    growthRate: '+24% YoY',
    simulationPrompt: 'Design a microservice schema for high-concurrency event registration and optimize MongoDB query latency.',
    requiredSkills: [
      { name: 'JavaScript & React', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Node.js & Express API Design', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'SQL & Database Architecture', category: 'Technical', targetLevel: 3, importance: 'High' },
      { name: 'Git & Version Control', category: 'Practical', targetLevel: 4, importance: 'Crucial' },
    ],
    starterProject: {
      title: 'Full-Stack Task & Notes Web App',
      description: 'Build a full-stack CRUD application with React on the frontend, Node/Express on the backend, and PostgreSQL database storage with user authentication.',
    },
    defaultRoadmap: [
      {
        phase: 'Phase 1: Web Fundamentals',
        tasks: [
          { id: 'fs-1', title: 'Master HTML5 Semantic Elements & CSS Flexbox/Grid', duration: '1 week', completed: true },
          { id: 'fs-2', title: 'Modern JavaScript ES6+ (Async/Await, Promises, Closures)', duration: '2 weeks', completed: true },
          { id: 'fs-3', title: 'Git & GitHub Workflow (branching, commits, pull requests)', duration: '3 days', completed: true }
        ]
      },
      {
        phase: 'Phase 2: Frontend Engineering',
        tasks: [
          { id: 'fs-4', title: 'Build interactive SPA components using React & Hooks', duration: '2 weeks', completed: false },
          { id: 'fs-5', title: 'State management & API consumption with Fetch / Axios', duration: '1 week', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ai-engineer',
    title: 'AI & Data Scientist',
    category: 'Artificial Intelligence',
    badge: 'Exponential Growth',
    description: 'Develops predictive machine learning models, statistical neural nets, and generative AI pipelines to solve complex business and scientific challenges.',
    dimensions: { analytical: 95, creative: 60, technical: 90, social: 45, practical: 65, organizational: 75 },
    avgSalary: '₹10 – 22 LPA',
    growthRate: '+38% YoY',
    simulationPrompt: 'Evaluate training loss convergence for a transformer fine-tuning experiment and diagnose gradient vanishing.',
    requiredSkills: [
      { name: 'Python & Data Analysis (Pandas, NumPy)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Linear Algebra & Multivariable Calculus', category: 'Analytical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Machine Learning Algorithms (Scikit-Learn)', category: 'Technical', targetLevel: 3, importance: 'High' },
      { name: 'Deep Learning Frameworks (PyTorch)', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Student Performance Prediction Model',
      description: 'Train a regression and classification model using scikit-learn on historical student engagement data to predict test readiness.'
    },
    defaultRoadmap: [
      {
        phase: 'Phase 1: Foundations',
        tasks: [
          { id: 'ai-1', title: 'Python for Data Analysis: NumPy arrays & Pandas DataFrames', duration: '2 weeks', completed: true },
          { id: 'ai-2', title: 'Essential Statistics: Probability distributions, hypothesis testing', duration: '2 weeks', completed: true }
        ]
      },
      {
        phase: 'Phase 2: Model Training',
        tasks: [
          { id: 'ai-3', title: 'Supervised Learning: Linear regression, decision trees, random forests', duration: '3 weeks', completed: false },
          { id: 'ai-4', title: 'Deep Learning fundamentals with PyTorch tensors', duration: '3 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'Design & Product',
    badge: 'Creative Tech',
    description: 'Researches user behavior, maps intuitive journeys, and crafts high-fidelity interactive interfaces for web and mobile software.',
    dimensions: { analytical: 60, creative: 95, technical: 65, social: 85, practical: 75, organizational: 70 },
    avgSalary: '₹7.5 – 16 LPA',
    growthRate: '+19% YoY',
    simulationPrompt: 'Redesign a multi-step student onboarding checkout flow to reduce drop-off on mobile devices.',
    requiredSkills: [
      { name: 'Figma & Auto-Layout Prototyping', category: 'Creative', targetLevel: 4, importance: 'Crucial' },
      { name: 'User Research & Journey Mapping', category: 'Social', targetLevel: 4, importance: 'Crucial' },
      { name: 'Design Systems & Token Architecture', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Tuition Centre Mobile App Redesign',
      description: 'Create an accessible, modern design system and clickable prototype for parents and students in Figma.'
    },
    defaultRoadmap: [
      {
        phase: 'Phase 1: Design Fundamentals',
        tasks: [
          { id: 'ui-1', title: 'Visual Hierarchy, Typography scales & Color Psychology', duration: '1 week', completed: true },
          { id: 'ui-2', title: 'Mastering Figma Components, Auto-Layout & Variants', duration: '2 weeks', completed: true }
        ]
      },
      {
        phase: 'Phase 2: UX Methodologies',
        tasks: [
          { id: 'ui-3', title: 'Conducting Qualitative Usability Interviews & Synthesizing Personas', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity & Defense Analyst',
    category: 'Security',
    badge: 'Critical Infrastructure',
    description: 'Protects enterprise digital networks, audits system vulnerabilities, conducts ethical penetration tests, and handles threat responses.',
    dimensions: { analytical: 90, creative: 55, technical: 95, social: 50, practical: 85, organizational: 80 },
    avgSalary: '₹9 – 20 LPA',
    growthRate: '+31% YoY',
    simulationPrompt: 'Analyze Wireshark packet capture PCAP to isolate an unauthorized ARP spoofing attempt.',
    requiredSkills: [
      { name: 'TCP/IP Networking & Linux Administration', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Penetration Testing Frameworks', category: 'Practical', targetLevel: 3, importance: 'High' },
      { name: 'SIEM Log Auditing', category: 'Analytical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Home Lab Network Vulnerability Audit',
      description: 'Configure a virtual private network range, scan with Nmap, and document security remediation steps.'
    },
    defaultRoadmap: [
      {
        phase: 'Phase 1: Network & OS Core',
        tasks: [
          { id: 'sec-1', title: 'Master Linux Terminal, File Permissions & Shell Scripting', duration: '2 weeks', completed: true },
          { id: 'sec-2', title: 'Deep Dive into OSI Model, TCP Handshakes & Routing Protocols', duration: '2 weeks', completed: true }
        ]
      }
    ]
  },
  {
    id: 'embedded-systems-engineer',
    title: 'Robotics & Embedded Systems Engineer',
    category: 'Hardware & IoT',
    badge: 'Physical Computing',
    description: 'Programs microcontrollers, designs sensory circuits, and interfaces autonomous hardware mechanisms for robotics and IoT.',
    dimensions: { analytical: 85, creative: 55, technical: 90, social: 40, practical: 95, organizational: 65 },
    avgSalary: '₹7.5 – 17 LPA',
    growthRate: '+18% YoY',
    simulationPrompt: 'Configure an ESP32 sensor interrupt over I2C and transmit telemetry via low-power MQTT payload.',
    requiredSkills: [
      { name: 'Embedded C / C++', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Circuit Schematic Reading & Soldering', category: 'Practical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Microcontroller Architecture', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Smart Classroom Climate & Air Quality Monitor',
      description: 'Build an IoT sensory node logging CO2 and temperature to a local dashboard.'
    },
    defaultRoadmap: [
      {
        phase: 'Phase 1: Electronics Foundations',
        tasks: [
          { id: 'emb-1', title: 'Ohm’s Law, Voltage Dividers & Transistor Switching', duration: '1 week', completed: true },
          { id: 'emb-2', title: 'Embedded C syntax, Memory Pointers & Registers', duration: '2 weeks', completed: true }
        ]
      }
    ]
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    category: 'Infrastructure',
    badge: 'High Enterprise Demand',
    description: 'Automates deployment pipelines, manages cloud server infrastructure (AWS/GCP), and ensures 99.99% system availability.',
    dimensions: { analytical: 80, creative: 50, technical: 95, social: 55, practical: 85, organizational: 85 },
    avgSalary: '₹9.5 – 21 LPA',
    growthRate: '+27% YoY',
    simulationPrompt: 'Write a Dockerfile and Kubernetes Deployment manifest with readiness and liveness health checks.',
    requiredSkills: [
      { name: 'Docker & Containerization', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'CI/CD Pipelines (GitHub Actions)', category: 'Practical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Cloud Architecture (AWS / GCP)', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Automated Multi-Container Deployment',
      description: 'Containerize a React + Node app with Docker Compose and set up automated testing GitHub Actions.'
    },
    defaultRoadmap: [
      {
        phase: 'Phase 1: Linux & Containers',
        tasks: [
          { id: 'ops-1', title: 'Linux System Administration & SSH Key Security', duration: '2 weeks', completed: true },
          { id: 'ops-2', title: 'Building Multi-Stage Docker Images', duration: '1 week', completed: true }
        ]
      }
    ]
  }
];

/**
 * Calculates psychometric results matching the student platform's scoring engine
 */
export function calculateStudentAssessmentResults(answersMap) {
  const dimensions = {
    analytical: 0,
    creative: 0,
    technical: 0,
    social: 0,
    practical: 0,
    organizational: 0,
  };

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

  const normalizedDimensions = {};
  const maxBenchmark = 20;

  Object.keys(dimensions).forEach((dim) => {
    const scorePct = Math.min(100, Math.round((dimensions[dim] / maxBenchmark) * 100));
    normalizedDimensions[dim] = Math.max(15, scorePct);
  });

  const scoredCareers = CAREERS_CATALOGUE.map((career) => {
    const cDim = career.dimensions;
    let totalDiff = 0;
    let weightSum = 0;

    Object.keys(normalizedDimensions).forEach((dim) => {
      const studentVal = normalizedDimensions[dim];
      const careerVal = cDim[dim] || 50;
      const weight = careerVal > 70 ? 1.5 : 1.0;
      const diff = Math.abs(studentVal - careerVal);
      totalDiff += diff * weight;
      weightSum += weight;
    });

    const avgDiff = totalDiff / weightSum;
    const rawMatch = 100 - (avgDiff * 0.7);
    const matchScore = Math.min(98, Math.max(62, Math.round(rawMatch)));

    const topStudentDims = Object.entries(normalizedDimensions)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    const primaryStrength = topStudentDims[0];
    const secondaryStrength = topStudentDims[1];

    const matchReason = `Strong ${primaryStrength} (${normalizedDimensions[primaryStrength]}%) and ${secondaryStrength} (${normalizedDimensions[secondaryStrength]}%) preferences directly align with ${career.title} competencies.`;

    return {
      ...career,
      matchScore,
      matchReason,
      alignedStrengths: [primaryStrength, secondaryStrength],
      developmentAreas: career.requiredSkills.slice(0, 2).map((s) => s.name),
    };
  });

  scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
  const topRecommendations = scoredCareers.slice(0, 5);

  return {
    dimensions: normalizedDimensions,
    topRecommendations,
    completedAt: new Date().toISOString(),
    primaryInterest: Object.entries(normalizedDimensions).sort((a, b) => b[1] - a[1])[0][0],
  };
}

// Checkpoint knowledge base for AI verbal checkpoints between modules
export const VERBAL_CHECKPOINTS_DATA = [
  {
    id: 'chk-html5-fs1',
    milestoneId: 'fs-1',
    milestoneTitle: 'Master HTML5 Semantic Elements & CSS Flexbox/Grid',
    studentName: 'Ananya Sharma',
    studentId: 'stu-dev-01',
    submittedAt: '2 days ago',
    questionPrompt: 'Explain how `justify-content` and `align-items` behave when `flex-direction` is changed from `row` to `column`.',
    studentResponse: 'When you change flex-direction to column, the main axis becomes vertical and the cross axis becomes horizontal. So justify-content now aligns items along the column vertically, while align-items controls the horizontal cross axis.',
    score: 92,
    passed: true,
    rubricScores: {
      conceptualAccuracy: 95,
      practicalJustification: 90,
      absenceOfMisconceptions: 92,
    },
    strengths: ['Accurate axis swap understanding', 'Clear technical vocabulary'],
    misconceptions: [],
    remediationNeeded: false,
    remediationRecommendation: 'Ready for dynamic grid layout milestone.',
    mentorReviewStatus: 'Verified by Dr. Radhika Sen',
    isSpeedrunRisk: false,
    completionTimeSeconds: 48,
  },
  {
    id: 'chk-js-fs2',
    milestoneId: 'fs-2',
    milestoneTitle: 'Modern JavaScript ES6+ (Async/Await, Promises, Closures)',
    studentName: 'Sneha Patel',
    studentId: 'STU-105',
    submittedAt: 'Yesterday',
    questionPrompt: 'If a script contains a `setTimeout(..., 0)` and a `Promise.resolve().then(...)`, which executes first and why?',
    studentResponse: 'setTimeout executes first because zero milliseconds means it runs immediately without waiting for anything else.',
    score: 48,
    passed: false,
    rubricScores: {
      conceptualAccuracy: 40,
      practicalJustification: 50,
      absenceOfMisconceptions: 55,
    },
    strengths: ['Attempted explanation'],
    misconceptions: ['Confused macrotask (setTimeout) with microtask (Promise) queue precedence'],
    remediationNeeded: true,
    remediationRecommendation: 'Schedule 15-minute 1-on-1 tutoring on JavaScript Event Loop microtask queues before proceeding to async fetching.',
    mentorReviewStatus: 'Needs Mentor Follow-Up',
    isSpeedrunRisk: true,
    completionTimeSeconds: 12, // Submitted in 12s with misconception
  },
  {
    id: 'chk-git-fs3',
    milestoneId: 'fs-3',
    milestoneTitle: 'Git & GitHub Workflow (branching, commits, pull requests)',
    studentName: 'Rohit Menon',
    studentId: 'STU-102',
    submittedAt: '3 days ago',
    questionPrompt: 'Why do software engineering teams create feature branches instead of committing directly to the main branch?',
    studentResponse: 'Feature branches isolate ongoing changes so unfinished work or bugs do not break the stable production branch. They also allow team members to review pull requests and run automated tests before merging.',
    score: 96,
    passed: true,
    rubricScores: {
      conceptualAccuracy: 98,
      practicalJustification: 95,
      absenceOfMisconceptions: 95,
    },
    strengths: ['Production stability awareness', 'CI/CD pull request review workflow'],
    misconceptions: [],
    remediationNeeded: false,
    remediationRecommendation: 'Outstanding engineering hygiene. Ready for team project.',
    mentorReviewStatus: 'Verified by Er. Sandeep Pillai',
    isSpeedrunRisk: false,
    completionTimeSeconds: 55,
  }
];

// Spaced repetition queue concepts mirroring SM-2 engine
export const SPACED_REPETITION_COHORT_DATA = [
  {
    id: 'rep-1',
    concept: 'CSS Flexbox Main vs Cross Axis Alignment',
    milestoneTitle: 'HTML5 & CSS Flexbox',
    dueStudentsCount: 4,
    averageRecallScore: 88,
    decayStatus: 'Fresh', // Fresh, Due, Critical
    nextReviewDue: 'Today',
    easeFactor: 2.5,
    commonStruggle: 'Swapping justify-content and align-items on flex-direction: column'
  },
  {
    id: 'rep-2',
    concept: 'JavaScript Event Loop & Microtask Precedence',
    milestoneTitle: 'Modern JS ES6+',
    dueStudentsCount: 9,
    averageRecallScore: 61,
    decayStatus: 'Critical',
    nextReviewDue: 'Overdue by 2 days',
    easeFactor: 2.1,
    commonStruggle: 'Assuming setTimeout(0) runs ahead of Promise.then microtask queue'
  },
  {
    id: 'rep-3',
    concept: 'SQL INNER JOIN vs LEFT JOIN Null Filtering',
    milestoneTitle: 'Database Architecture',
    dueStudentsCount: 6,
    averageRecallScore: 74,
    decayStatus: 'Due',
    nextReviewDue: 'Tomorrow',
    easeFactor: 2.3,
    commonStruggle: 'Unintended filtering of null rows in WHERE clause on outer joins'
  },
  {
    id: 'rep-4',
    concept: 'React Component Lifecycle & Dependency Arrays',
    milestoneTitle: 'React SPA Engineering',
    dueStudentsCount: 12,
    averageRecallScore: 68,
    decayStatus: 'Due',
    nextReviewDue: 'Today',
    easeFactor: 2.2,
    commonStruggle: 'Missing function dependencies causing stale closure bugs in useEffect'
  }
];

// Real-world bounties & mentor-reviewed projects
export const INITIAL_BOUNTIES = [
  {
    id: 'bty-01',
    title: 'Kochi Heritage Tourism Micro-Portal',
    organization: 'Kerala Tourism Community Initiative',
    category: 'Full Stack Web & UI/UX',
    difficulty: 'Intermediate',
    stipend: '₹8,000 Verified Bounty',
    deadline: '2026-11-20',
    assignedMentor: 'Er. Sandeep Pillai',
    assignedStudent: 'Ananya Sharma',
    studentId: 'stu-dev-01',
    status: 'In Progress', // Draft, Open, In Progress, Submitted, Mentor Approved, Client Accepted
    description: 'Build a mobile-responsive bilingual directory showcasing local artisans and walking tour routes in Fort Kochi with interactive maps.',
    deliverables: [
      { id: 'del-1', name: 'Figma Mobile & Desktop UI Wireframes', completed: true },
      { id: 'del-2', name: 'Interactive React Prototype with Leaflet Maps', completed: true },
      { id: 'del-3', name: 'PostgreSQL Database Schema & REST API', completed: false },
      { id: 'del-4', name: 'Final Client Acceptance Review', completed: false }
    ],
    mentorNotes: 'Ananya delivered exceptional Figma components with auto-layout. Currently implementing Leaflet maps.',
    clientAcceptanceStatus: 'Pending Final Submission',
    portfolioSkills: ['React', 'Leaflet GIS', 'Figma', 'PostgreSQL', 'Client Communication']
  },
  {
    id: 'bty-02',
    title: 'Apex Academy Batch Attendance Mobile App',
    organization: 'Apex Coaching Academy (Internal)',
    category: 'Mobile / PWA & Backend',
    difficulty: 'Intermediate',
    stipend: '₹6,000 Institutional Grant',
    deadline: '2026-11-10',
    assignedMentor: 'Dr. Radhika Sen',
    assignedStudent: 'Meera Joseph',
    studentId: 'STU-103',
    status: 'Mentor Approved',
    description: 'Create a lightweight QR scanner PWA for classroom instructors to log student attendance directly into the centre database.',
    deliverables: [
      { id: 'del-1', name: 'Camera QR Code Scanning Engine', completed: true },
      { id: 'del-2', name: 'Offline Storage Sync with IndexedDB', completed: true },
      { id: 'del-3', name: 'Mentor Code Quality Review', completed: true }
    ],
    mentorNotes: 'Approved with honors. Clean modular code, zero console errors, offline sync verified.',
    clientAcceptanceStatus: 'Accepted by Director',
    portfolioSkills: ['PWA', 'IndexedDB', 'HTML5 Camera API', 'REST API Integration']
  },
  {
    id: 'bty-03',
    title: 'Solar Rooftop ROI & Feasibility Calculator',
    organization: 'CleanEnergy Kerala Coalition',
    category: 'Data Science & Applied Math',
    difficulty: 'Beginner to Intermediate',
    stipend: '₹5,000 Sustainability Award',
    deadline: '2026-11-25',
    assignedMentor: 'Sarah Thomas',
    assignedStudent: 'Rohit Menon',
    studentId: 'STU-102',
    status: 'In Progress',
    description: 'Develop a statistical calculator in Python/Streamlit estimating monthly electrical bill savings based on roof area and irradiation data.',
    deliverables: [
      { id: 'del-1', name: 'Data Pipeline for Kerala Solar Radiation Dataset', completed: true },
      { id: 'del-2', name: 'Interactive UI Slider Calculation Model', completed: false },
      { id: 'del-3', name: 'Exportable PDF Savings Report', completed: false }
    ],
    mentorNotes: 'Data cleaning completed. Assisted Rohit with mathematical solar tariff formula.',
    clientAcceptanceStatus: 'In Progress',
    portfolioSkills: ['Python', 'Streamlit', 'Data Modeling', 'Mathematical Formulations']
  },
  {
    id: 'bty-04',
    title: 'EdTech Feature PRD & Usability Prototype',
    organization: 'Zhero Product Labs',
    category: 'Product Management & UI/UX',
    difficulty: 'Intermediate',
    stipend: '₹7,500 Innovation Bounty',
    deadline: '2026-12-05',
    assignedMentor: 'Anjali Thomas',
    assignedStudent: 'Vikram Mohan',
    studentId: 'STU-106',
    status: 'Open',
    description: 'Draft a Product Requirement Document (PRD) and Figma prototype for a collaborative study-together audio room feature.',
    deliverables: [
      { id: 'del-1', name: 'User Persona Interviews (5 students)', completed: false },
      { id: 'del-2', name: 'Figma Low-Fi Wireframe Flows', completed: false },
      { id: 'del-3', name: 'Functional PRD Specification', completed: false }
    ],
    mentorNotes: 'Assigned to Vikram. Kickoff meeting scheduled for Thursday.',
    clientAcceptanceStatus: 'Unassigned / Open',
    portfolioSkills: ['Product Management', 'PRD Authoring', 'User Research', 'Figma']
  }
];

// Online Study-Together Sessions
export const INITIAL_STUDY_SESSIONS = [
  {
    id: 'session-01',
    title: 'Weekend Deep-Work Room: React Hooks & Microservices',
    mentorName: 'Er. Sandeep Pillai',
    mentorRole: 'Lead Full-Stack Mentor',
    scheduledTime: 'Saturday, 10:00 AM – 1:00 PM',
    roomLink: 'https://meet.zhero.edu/room/apex-weekend-deep-work',
    participantCount: 16,
    maxParticipants: 25,
    status: 'Scheduled',
    agenda: 'Focus sprint: 50m pomodoro sessions, live debugging assistance, and verbal checkpoint preparation.'
  },
  {
    id: 'session-02',
    title: 'AI Calculus & Neural Net Convergence Office Hours',
    mentorName: 'Dr. Radhika Sen',
    mentorRole: 'Director & AI Lead',
    scheduledTime: 'Sunday, 3:00 PM – 5:00 PM',
    roomLink: 'https://meet.zhero.edu/room/apex-ai-office-hours',
    participantCount: 11,
    maxParticipants: 20,
    status: 'Scheduled',
    agenda: 'Demystifying backpropagation gradients and loss curves for Mission 2026 AI cohorts.'
  },
  {
    id: 'session-03',
    title: 'UI/UX Portfolio Critique & Figma Auto-Layout Lab',
    mentorName: 'Anjali Thomas',
    mentorRole: 'Product Design Mentor',
    scheduledTime: 'Tuesday, 6:30 PM – 8:00 PM',
    roomLink: 'https://meet.zhero.edu/room/apex-design-critique',
    participantCount: 8,
    maxParticipants: 15,
    status: 'Scheduled',
    agenda: 'Live screen sharing and constructive critique of student bounty prototypes and case studies.'
  }
];

// Mentor Opportunities and Employment Pathways (Clearly labeled prototype)
export const MENTOR_OPPORTUNITIES = [
  {
    id: 'opp-01',
    title: 'Senior STEM Mentor (Full Stack & Cloud)',
    organization: 'Apex Career Academy & KSUM Network',
    type: 'Part-Time / Weekend Fellow',
    stipendRange: '₹35,000 – ₹55,000 / month',
    location: 'Kochi (Hybrid)',
    description: 'Mentor high-performing high school and college cohorts through verified project bounties and verbal AI checkpoints.',
    requirements: ['3+ years in React/Node/Cloud', 'Passionate about youth career enablement', 'Strong communication'],
    status: 'Actively Interviewing'
  },
  {
    id: 'opp-02',
    title: 'Curriculum Evaluator & Bounty Reviewer',
    organization: 'Zhero Institutional Operations',
    type: 'Contract / Per-Project',
    stipendRange: '₹1,500 / verified bounty review',
    location: 'Remote',
    description: 'Audit code submissions and project deliverables against client rubrics and grant industry verification badges.',
    requirements: ['Hands-on software or data engineering background', 'Clear written feedback discipline'],
    status: 'Open Applications'
  },
  {
    id: 'opp-03',
    title: 'Career Discovery Lead & Interview Specialist',
    organization: 'Kerala EdTech Consortium',
    type: 'Full-Time Academic Faculty',
    stipendRange: '₹6.5 – 9.0 LPA',
    location: 'Ernakulam Campus',
    description: 'Lead 1-on-1 career discovery interviews with students and parents based on Zhero AI assessment diagnostic profiles.',
    requirements: ['Background in engineering, psychology, or career counseling', 'Empathetic listener'],
    status: 'Demo Opening'
  }
];

// Aliases for unified ecosystem access
export const SPACED_REPETITION_QUEUE = SPACED_REPETITION_COHORT_DATA;
export const PROJECT_BOUNTIES = INITIAL_BOUNTIES;
export const STUDY_TOGETHER_SESSIONS = INITIAL_STUDY_SESSIONS;
