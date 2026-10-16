/**
 * ZHERO Career Interest & Aptitude Assessment
 * 16 balanced questions exploring 6 psychological and cognitive dimensions:
 * - Analytical
 * - Creative
 * - Technical
 * - Social
 * - Practical
 * - Organizational
 */

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
    category: 'Collaboration & Leadership',
    dimensionName: 'Social & Organizational',
    question: 'In a group project, what role do you naturally fall into most comfortably?',
    options: [
      { text: 'The Planner: Setting deadlines, organizing milestones, and keeping everyone on track.', scores: { organizational: 3, analytical: 1 } },
      { text: 'The Communicator: Motivating team members, resolving disagreements, and presenting.', scores: { social: 3, creative: 1 } },
      { text: 'The Specialist: Taking on the hardest technical or numerical portion alone.', scores: { technical: 3, analytical: 2 } },
      { text: 'The Visionary: Pitching creative ideas and shaping the aesthetic presentation.', scores: { creative: 3, social: 1 } }
    ]
  },
  {
    id: 6,
    category: 'Curiosity & Interests',
    dimensionName: 'Analytical & Scientific',
    question: 'Which of the following topics would you most enjoy reading an in-depth article about?',
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
