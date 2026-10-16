/**
 * ZHERO Student Platform — Comprehensive Career Catalogue
 * 18+ diverse, realistic career profiles across emerging & core domains
 */

export const CAREERS_DATA = [
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Software Engineer',
    category: 'Technology',
    badge: 'High Demand',
    description: 'Designs, develops, and maintains scalable web applications spanning client-side interfaces, server-side APIs, and cloud databases.',
    typicalDay: 'Collaborating in agile standups, building responsive frontend components, implementing REST/GraphQL APIs, optimizing database queries, and writing automated unit tests.',
    dimensions: { analytical: 85, creative: 65, technical: 95, social: 60, practical: 80, organizational: 70 },
    avgSalary: '₹8.5 – 18 LPA',
    growthRate: '+24% YoY',
    educationPathways: [
      'B.Tech / B.E. in Computer Science or IT',
      'BCA / MCA degrees with focused modern web projects',
      'Intensive Full-Stack Coding Bootcamps & Verified GitHub Portfolio',
      'Self-taught pathway with open-source contributions'
    ],
    requiredSkills: [
      { name: 'JavaScript & React', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Node.js & Express API Design', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'SQL & Database Architecture', category: 'Technical', targetLevel: 3, importance: 'High' },
      { name: 'Git & Version Control', category: 'Practical', targetLevel: 4, importance: 'Crucial' },
      { name: 'System Decomposition & Problem Solving', category: 'Analytical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Agile Team Communication', category: 'Social', targetLevel: 3, importance: 'Moderate' }
    ],
    starterProject: {
      title: 'Full-Stack Task & Notes Web App',
      description: 'Build a full-stack CRUD application with React on the frontend, Node/Express on the backend, and PostgreSQL database storage with user authentication.',
      timeEstimate: '2 – 3 weeks'
    },
    relatedCareers: ['cloud-devops-engineer', 'ui-ux-designer', 'ai-engineer'],
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
      },
      {
        phase: 'Phase 3: Backend & Persistence',
        tasks: [
          { id: 'fs-6', title: 'Create RESTful APIs using Node.js & Express', duration: '2 weeks', completed: false },
          { id: 'fs-7', title: 'Database schema design and queries using PostgreSQL / MongoDB', duration: '2 weeks', completed: false }
        ]
      },
      {
        phase: 'Phase 4: Capstone & Deployment',
        tasks: [
          { id: 'fs-8', title: 'Deploy full-stack project to Vercel / Render with CI/CD', duration: '1 week', completed: false },
          { id: 'fs-9', title: 'Draft technical writeup and document architecture on GitHub', duration: '3 days', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ai-data-scientist',
    title: 'AI & Data Scientist',
    category: 'Data & AI',
    badge: 'Exponential Growth',
    description: 'Uncovers actionable business and scientific insights by analyzing complex datasets, engineering predictive machine learning models, and fine-tuning AI algorithms.',
    typicalDay: 'Cleaning messy raw data, training regression and classification models in Python, evaluating loss metrics, visualizing feature correlations, and presenting findings to stakeholders.',
    dimensions: { analytical: 95, creative: 60, technical: 90, social: 50, practical: 75, organizational: 70 },
    avgSalary: '₹10 – 22 LPA',
    growthRate: '+36% YoY',
    educationPathways: [
      'B.Tech / B.Sc in Computer Science, Data Science, or Mathematics',
      'M.Sc in Statistics, Economics, or Applied Machine Learning',
      'Specialized online Nanodegrees (Fast.ai, DeepLearning.AI, Coursera)',
      'Competitive Kaggle rankings and open-source ML contributions'
    ],
    requiredSkills: [
      { name: 'Python (NumPy, Pandas, Scikit-Learn)', category: 'Technical', targetLevel: 5, importance: 'Crucial' },
      { name: 'Linear Algebra & Probability', category: 'Analytical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Data Visualization & Storytelling', category: 'Creative', targetLevel: 3, importance: 'High' },
      { name: 'SQL Querying for Complex Aggregations', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Deep Learning Frameworks (PyTorch/TensorFlow)', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Student Performance Prediction Model',
      description: 'Analyze an open educational dataset, perform exploratory data analysis (EDA), engineer predictive features, and train a model predicting student exam milestones.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['full-stack-engineer', 'cloud-devops-engineer', 'business-analyst'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Foundations',
        tasks: [
          { id: 'ds-1', title: 'Python Programming Essentials (Data Structures, OOP)', duration: '2 weeks', completed: false },
          { id: 'ds-2', title: 'Descriptive & Inferential Statistics Fundamentals', duration: '2 weeks', completed: false }
        ]
      },
      {
        phase: 'Phase 2: Data Wrangling & EDA',
        tasks: [
          { id: 'ds-3', title: 'Data Manipulation using Pandas and NumPy', duration: '2 weeks', completed: false },
          { id: 'ds-4', title: 'Interactive Visualizations using Seaborn & Plotly', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 3: Machine Learning',
        tasks: [
          { id: 'ds-5', title: 'Train Classical Supervised Models (Regression, Decision Trees)', duration: '3 weeks', completed: false },
          { id: 'ds-6', title: 'Model Evaluation Metrics (Precision, Recall, ROC-AUC)', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 4: Capstone & Portfolio',
        tasks: [
          { id: 'ds-7', title: 'Publish an end-to-end Kaggle Notebook with documented insights', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'Design & Creative',
    badge: 'Popular',
    description: 'Crafts intuitive, visually engaging, and accessible digital user experiences across mobile apps and web platforms through research, wireframing, and interactive prototyping.',
    typicalDay: 'Interviewing target users, mapping customer journey flows, designing pixel-perfect screens in Figma, building reusable design system components, and conducting usability testing.',
    dimensions: { analytical: 70, creative: 95, technical: 65, social: 80, practical: 80, organizational: 65 },
    avgSalary: '₹7.5 – 16 LPA',
    growthRate: '+19% YoY',
    educationPathways: [
      'B.Des / B.Sc in Interaction Design, Visual Communication, or HCI',
      'Fine Arts / Architecture / Computer Science transitions',
      'Professional UI/UX Bootcamps & Google UX Certificate',
      'High-impact Figma case study portfolio'
    ],
    requiredSkills: [
      { name: 'Figma & Design Systems', category: 'Creative', targetLevel: 5, importance: 'Crucial' },
      { name: 'User Research & Personas', category: 'Social', targetLevel: 4, importance: 'Crucial' },
      { name: 'Wireframing & Information Architecture', category: 'Analytical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Visual Design & Typography Hierarchy', category: 'Creative', targetLevel: 4, importance: 'Crucial' },
      { name: 'Interactive Micro-prototyping', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Tuition Centre Mobile App Redesign',
      description: 'Audit an existing educational mobile app, conduct 3 user interviews, design low-fi wireframes, and build an interactive Figma prototype with a clean design token system.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['full-stack-engineer', 'product-manager', 'digital-marketer'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Design Principles',
        tasks: [
          { id: 'ux-1', title: 'Study Visual Hierarchy, Color Theory, and Typography', duration: '1 week', completed: false },
          { id: 'ux-2', title: 'Master Figma Tools (Auto-layout, Components, Variants)', duration: '2 weeks', completed: false }
        ]
      },
      {
        phase: 'Phase 2: UX Research & IA',
        tasks: [
          { id: 'ux-3', title: 'User Interview Techniques and Empathy Mapping', duration: '1 week', completed: false },
          { id: 'ux-4', title: 'Information Architecture and User Flow Mapping', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 3: Prototyping & Testing',
        tasks: [
          { id: 'ux-5', title: 'Build High-Fidelity UI Screens for Mobile & Web', duration: '2 weeks', completed: false },
          { id: 'ux-6', title: 'Create Interactive Clickable Prototypes with Micro-interactions', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 4: Case Study Publication',
        tasks: [
          { id: 'ux-7', title: 'Write an end-to-end Notion / Behance Design Case Study', duration: '1 week', completed: false }
        ]
      }
    ]
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    category: 'Technology',
    badge: 'Critical Infrastructure',
    description: 'Automates software delivery pipelines, manages cloud infrastructure (AWS/GCP), and ensures high system availability, security, and scalability.',
    typicalDay: 'Writing Dockerfiles, configuring Kubernetes clusters, automating GitHub Actions CI/CD pipelines, provisioning infrastructure via Terraform, and monitoring uptime telemetry.',
    dimensions: { analytical: 85, creative: 50, technical: 95, social: 55, practical: 90, organizational: 80 },
    avgSalary: '₹9 – 20 LPA',
    growthRate: '+28% YoY',
    educationPathways: [
      'B.Tech in Computer Science, Systems Engineering, or Electronics',
      'System Admin / Backend Developer career advancement',
      'Industry Certifications (AWS Certified Solutions Architect, CKA)',
      'Hands-on home lab and cloud sandbox projects'
    ],
    requiredSkills: [
      { name: 'Linux Command Line & Bash Scripting', category: 'Practical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Containerization with Docker', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'CI/CD Pipelines (GitHub Actions / GitLab)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Cloud Providers (AWS or GCP)', category: 'Technical', targetLevel: 3, importance: 'High' },
      { name: 'Infrastructure as Code (Terraform)', category: 'Technical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Automated Multi-Container Deployment',
      description: 'Dockerize a React + Node.js application, set up a local Docker Compose environment, and create a GitHub Actions workflow that automatically lints and builds on pull requests.',
      timeEstimate: '1 – 2 weeks'
    },
    relatedCareers: ['full-stack-engineer', 'cybersecurity-analyst'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Linux & Networking',
        tasks: [
          { id: 'do-1', title: 'Linux Administration, Permissions, and Shell Scripting', duration: '2 weeks', completed: false },
          { id: 'do-2', title: 'Computer Networking Basics (DNS, HTTP/S, TCP/IP, SSH)', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 2: Containers & Orchestration',
        tasks: [
          { id: 'do-3', title: 'Docker Containerization & Multi-stage Builds', duration: '2 weeks', completed: false },
          { id: 'do-4', title: 'Docker Compose for Local Multi-Service Development', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 3: CI/CD & Cloud',
        tasks: [
          { id: 'do-5', title: 'Automated CI/CD with GitHub Actions', duration: '2 weeks', completed: false },
          { id: 'do-6', title: 'Deploy Containerized App to AWS ECS or Render', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity & Defense Analyst',
    category: 'Technology',
    badge: 'Critical Defense',
    description: 'Safeguards organizational networks, cloud systems, and sensitive user data from intrusion, malware, vulnerabilities, and cyberattacks.',
    typicalDay: 'Monitoring security information logs (SIEM), performing vulnerability scans, testing network firewalls, simulating phishing defense, and ensuring compliance standards.',
    dimensions: { analytical: 90, creative: 60, technical: 90, social: 55, practical: 85, organizational: 80 },
    avgSalary: '₹8 – 18 LPA',
    growthRate: '+31% YoY',
    educationPathways: [
      'B.Tech / B.Sc in Information Security, Computer Science, or IT',
      'Certifications (CompTIA Security+, CEH, Cisco CCNA)',
      'TryHackMe / HackTheBox capture-the-flag competitions'
    ],
    requiredSkills: [
      { name: 'Network Security & Packet Analysis (Wireshark)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Vulnerability Assessment (Nmap, Burp Suite)', category: 'Practical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Operating System Internals (Linux & Windows)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Security Incident Documentation', category: 'Organizational', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Home Lab Network Vulnerability Audit',
      description: 'Set up an isolated virtual machine lab, conduct an authorized port scan using Nmap, analyze network traffic in Wireshark, and write an audit report.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['cloud-devops-engineer', 'full-stack-engineer'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Networking & Fundamentals',
        tasks: [
          { id: 'sec-1', title: 'Networking Fundamentals & OSI Model Deep Dive', duration: '2 weeks', completed: false },
          { id: 'sec-2', title: 'Linux Command Line for Security Professionals', duration: '2 weeks', completed: false }
        ]
      },
      {
        phase: 'Phase 2: Security Assessment',
        tasks: [
          { id: 'sec-3', title: 'Packet Sniffing and Traffic Analysis with Wireshark', duration: '1 week', completed: false },
          { id: 'sec-4', title: 'Web App Security: OWASP Top 10 Vulnerabilities', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'product-manager',
    title: 'Digital Product Manager',
    category: 'Business & Finance',
    badge: 'Strategic Leadership',
    description: 'Guides the vision, roadmap, and feature execution of digital software products by balancing user needs, technological feasibility, and business viability.',
    typicalDay: 'Prioritizing sprint backlogs with engineers, reviewing user analytics, conducting customer discovery interviews, defining product requirement documents (PRDs), and aligning leadership.',
    dimensions: { analytical: 80, creative: 75, technical: 70, social: 90, practical: 70, organizational: 95 },
    avgSalary: '₹12 – 26 LPA',
    growthRate: '+22% YoY',
    educationPathways: [
      'Engineering, Design, or Business undergraduate degrees',
      'MBA in Product Strategy or Tech Management',
      'Associate Product Manager (APM) cohorts & startup internships'
    ],
    requiredSkills: [
      { name: 'Product Discovery & User Empathy', category: 'Social', targetLevel: 5, importance: 'Crucial' },
      { name: 'Metrics & Data Analytics (Mixpanel, SQL)', category: 'Analytical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Roadmap Prioritization Frameworks (RICE)', category: 'Organizational', targetLevel: 4, importance: 'Crucial' },
      { name: 'Agile Sprint Management (Jira, Linear)', category: 'Organizational', targetLevel: 4, importance: 'High' }
    ],
    starterProject: {
      title: 'EdTech Feature PRD & Prototype',
      description: 'Identify a major friction point in existing student learning apps, write a 4-page Product Requirement Document (PRD), and design wireframes with success metrics.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['ui-ux-designer', 'business-analyst'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Product Fundamentals',
        tasks: [
          { id: 'pm-1', title: 'Understand Product Lifecycle and Agile Methodologies', duration: '2 weeks', completed: false },
          { id: 'pm-2', title: 'Master Writing Clear User Stories & Acceptance Criteria', duration: '1 week', completed: false }
        ]
      },
      {
        phase: 'Phase 2: Analytics & Prioritization',
        tasks: [
          { id: 'pm-3', title: 'Product Metrics: DAU, Retention, Conversion Funnels', duration: '2 weeks', completed: false },
          { id: 'pm-4', title: 'Draft a Comprehensive PRD for a Real-world Feature', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'business-analyst',
    title: 'Business & Operations Analyst',
    category: 'Business & Finance',
    badge: 'High Industry Demand',
    description: 'Bridges business requirements with technological solutions by modeling operational workflows, analyzing financial impact, and optimizing company processes.',
    typicalDay: 'Eliciting requirements from department heads, mapping BPMN workflow diagrams, building interactive Power BI dashboards, and preparing executive cost-benefit models.',
    dimensions: { analytical: 90, creative: 55, technical: 70, social: 80, practical: 75, organizational: 90 },
    avgSalary: '₹7 – 15 LPA',
    growthRate: '+18% YoY',
    educationPathways: [
      'B.Com, BBA, B.Sc Mathematics, or Engineering degrees',
      'Certifications (CBAP, Microsoft Power BI Certified Data Analyst)',
      'Corporate analyst internships'
    ],
    requiredSkills: [
      { name: 'Advanced Excel & Financial Modeling', category: 'Practical', targetLevel: 5, importance: 'Crucial' },
      { name: 'SQL Querying for Reporting', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Dashboard Building (Power BI / Tableau)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Business Process Mapping (BPMN)', category: 'Organizational', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Tuition Centre Profitability & Churn Dashboard',
      description: 'Model a simulated educational institute’s student enrollment data in Excel/Power BI, identify seasonal churn trends, and present recommendations.',
      timeEstimate: '10 days'
    },
    relatedCareers: ['product-manager', 'ai-data-scientist'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Quantitative Tools',
        tasks: [
          { id: 'ba-1', title: 'Master Advanced Excel (XLOOKUP, Pivot Tables, Macros)', duration: '2 weeks', completed: false },
          { id: 'ba-2', title: 'SQL Fundamentals for Business Intelligence', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'clinical-healthcare-specialist',
    title: 'Healthcare Informatics Specialist',
    category: 'Healthcare',
    badge: 'Growing Frontier',
    description: 'Integrates patient medical records, clinical workflows, and digital health software to improve hospital care delivery, diagnostic accuracy, and patient safety.',
    typicalDay: 'Auditing electronic health records (EHR) configurations, optimizing clinical data pipelines, ensuring medical privacy compliance, and training doctors on diagnostic software.',
    dimensions: { analytical: 85, creative: 50, technical: 75, social: 75, practical: 80, organizational: 90 },
    avgSalary: '₹6.5 – 14 LPA',
    growthRate: '+25% YoY',
    educationPathways: [
      'B.Sc in Nursing, Biotechnology, Pharmacy, or Allied Health',
      'Postgraduate Diploma in Health Informatics / Healthcare Management',
      'Hospital IT system certifications'
    ],
    requiredSkills: [
      { name: 'Health Information Systems (HL7 / FHIR Standards)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Medical Terminology & Clinical Workflows', category: 'Organizational', targetLevel: 4, importance: 'Crucial' },
      { name: 'Patient Data Privacy & Security Regulations', category: 'Organizational', targetLevel: 4, importance: 'Crucial' }
    ],
    starterProject: {
      title: 'Digital Clinic Patient Triage Flowchart',
      description: 'Map out an outpatient consultation and diagnostic workflow using standardized EHR data points to reduce patient wait times by 20%.',
      timeEstimate: '10 days'
    },
    relatedCareers: ['business-analyst', 'ai-data-scientist'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Healthcare Basics',
        tasks: [
          { id: 'hc-1', title: 'Overview of Electronic Health Records & Digital Health', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sustainability-engineer',
    title: 'Renewable Energy & Sustainability Engineer',
    category: 'Sustainability',
    badge: 'Impact Career',
    description: 'Designs, evaluates, and implements solar, wind, clean mobility, and energy-efficient systems to reduce carbon emissions and accelerate the green transition.',
    typicalDay: 'Conducting site solar irradiance surveys, calculating energy yields, designing electrical grid integration schematics, and analyzing life-cycle carbon footprints.',
    dimensions: { analytical: 85, creative: 65, technical: 85, social: 65, practical: 90, organizational: 75 },
    avgSalary: '₹7 – 16 LPA',
    growthRate: '+33% YoY',
    educationPathways: [
      'B.Tech in Electrical, Mechanical, Chemical, or Environmental Engineering',
      'M.Tech in Renewable Energy Systems or Energy Management',
      'Green Building certifications (LEED Green Associate, GRIHA)'
    ],
    requiredSkills: [
      { name: 'Solar PV System Sizing & Energy Yield Calculation', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'AutoCAD / Engineering CAD Modeling', category: 'Practical', targetLevel: 4, importance: 'High' },
      { name: 'Carbon Accounting & Life Cycle Assessment (LCA)', category: 'Analytical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: 'Rooftop Solar Feasibility Assessment',
      description: 'Calculate the solar power generation potential, battery backup capacity, and economic payback period for a 2,000 sq ft institutional rooftop.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['robotics-automation-engineer'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Energy Principles',
        tasks: [
          { id: 'sus-1', title: 'Solar PV & Wind Energy Generation Principles', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'robotics-automation-engineer',
    title: 'Robotics & Embedded Systems Engineer',
    category: 'Engineering',
    badge: 'High Precision',
    description: 'Builds intelligent physical hardware, microcontrollers, IoT sensor networks, and autonomous robotics for industrial manufacturing, drones, and automation.',
    typicalDay: 'Writing embedded C/C++ firmware, designing custom PCB schematics in KiCAD, testing motor drivers and ultrasonic sensors, and debugging serial communication protocols.',
    dimensions: { analytical: 90, creative: 70, technical: 95, social: 45, practical: 95, organizational: 70 },
    avgSalary: '₹8 – 19 LPA',
    growthRate: '+26% YoY',
    educationPathways: [
      'B.Tech in Electronics & Communication, Mechatronics, or Electrical Engineering',
      'Robotics clubs and competitive hackathons (e-Yantra, Formula Student)',
      'Hardware prototyping portfolios with ESP32 / STM32'
    ],
    requiredSkills: [
      { name: 'Embedded C / C++ Programming', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Microcontroller Architecture (ARM / ESP32)', category: 'Technical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Circuit Design & Schematics (KiCad)', category: 'Practical', targetLevel: 3, importance: 'High' },
      { name: 'Sensor Integration (I2C, SPI, UART)', category: 'Technical', targetLevel: 4, importance: 'Crucial' }
    ],
    starterProject: {
      title: 'Smart Classroom Climate & Air Quality Monitor',
      description: 'Program an ESP32 microcontroller with temperature, humidity, and CO2 sensors that transmits live telemetry over Wi-Fi to a web dashboard.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['cloud-devops-engineer', 'sustainability-engineer'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Electronics Foundations',
        tasks: [
          { id: 'rob-1', title: 'Digital Electronics, Logic Gates, and Ohm’s Law', duration: '2 weeks', completed: false }
        ]
      }
    ]
  },
  {
    id: 'digital-marketer',
    title: 'Growth & Digital Content Strategist',
    category: 'Design & Creative',
    badge: 'Creative & Analytical',
    description: 'Drives customer acquisition and brand visibility through targeted digital campaigns, search engine optimization (SEO), viral social content, and email funnels.',
    typicalDay: 'Analyzing Google Analytics conversion funnels, crafting high-converting ad copy, designing visual carousels, writing educational newsletters, and running A/B experiments.',
    dimensions: { analytical: 75, creative: 90, technical: 65, social: 85, practical: 80, organizational: 80 },
    avgSalary: '₹5.5 – 12 LPA',
    growthRate: '+20% YoY',
    educationPathways: [
      'BA in Journalism, Mass Media, Marketing, or Humanities',
      'Self-driven digital creators with proven audience growth',
      'Certifications (HubSpot Inbound, Google Ads & Analytics)'
    ],
    requiredSkills: [
      { name: 'Content Writing & Storytelling', category: 'Creative', targetLevel: 5, importance: 'Crucial' },
      { name: 'SEO & Search Intent Research', category: 'Analytical', targetLevel: 4, importance: 'Crucial' },
      { name: 'Social Media Strategy & Short-form Video', category: 'Creative', targetLevel: 4, importance: 'High' },
      { name: 'A/B Testing & Funnel Analytics', category: 'Analytical', targetLevel: 3, importance: 'High' }
    ],
    starterProject: {
      title: '30-Day Growth Campaign for a Local Coaching Center',
      description: 'Create an editorial calendar, design 8 educational LinkedIn/Instagram carousels, and write a high-converting landing page email sequence.',
      timeEstimate: '10 days'
    },
    relatedCareers: ['ui-ux-designer', 'product-manager'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Marketing Fundamentals',
        tasks: [
          { id: 'mkt-1', title: 'Audience Persona Research and Content Funnels', duration: '1 week', completed: false }
        ]
      }
    ]
  },
  {
    id: 'academic-counselor',
    title: 'Educational Mentor & Career Counselor',
    category: 'Education',
    badge: 'Human Centric',
    description: 'Empowers students to navigate academic choices, overcome exam anxiety, align personal interests with educational pathways, and build fulfilling career goals.',
    typicalDay: 'Conducting one-on-one student advising sessions, reviewing aptitude profiles, hosting parent-student career workshops, and recommending relevant higher education degrees.',
    dimensions: { analytical: 65, creative: 65, technical: 40, social: 95, practical: 75, organizational: 85 },
    avgSalary: '₹5 – 11 LPA',
    growthRate: '+16% YoY',
    educationPathways: [
      'BA / B.Sc in Psychology, Sociology, or Education',
      'M.Sc / MA in Counseling Psychology or Guidance & Counseling',
      'Certified Career Counselor accreditations'
    ],
    requiredSkills: [
      { name: 'Active Listening & Empathetic Communication', category: 'Social', targetLevel: 5, importance: 'Crucial' },
      { name: 'Educational Pathways & Entrance Exam Knowledge', category: 'Organizational', targetLevel: 4, importance: 'Crucial' },
      { name: 'Aptitude & Personality Profile Interpretation', category: 'Analytical', targetLevel: 4, importance: 'Crucial' }
    ],
    starterProject: {
      title: 'Comprehensive High School Career Guidebook',
      description: 'Draft a student-friendly guide comparing 10 emerging engineering, design, and commerce careers with prerequisites and local college entrance deadlines.',
      timeEstimate: '2 weeks'
    },
    relatedCareers: ['product-manager', 'digital-marketer'],
    defaultRoadmap: [
      {
        phase: 'Phase 1: Counseling Foundations',
        tasks: [
          { id: 'cou-1', title: 'Principles of Student Development and Cognitive Psychology', duration: '2 weeks', completed: false }
        ]
      }
    ]
  }
];
