/**
 * ZHERO Monorepo Configuration & Shared Constants
 */

const isClient = typeof window !== 'undefined';
const isDev = isClient && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const APPS = {
  STUDENT: {
    name: 'ZHERO Student Portal',
    code: 'student',
    port: 3001,
    url: isDev ? 'http://localhost:3001' : '/',
    isPublic: true,
    description: 'Career assessments, recommendation engine, skill-gap analysis & learning roadmaps',
    targetAudience: 'Students & Job Seekers',
  },
  TUITION_CENTRE: {
    name: 'ZHERO Tuition Centre Portal',
    code: 'tuition-centre',
    port: 3002,
    url: isDev ? 'http://localhost:3002' : '#',
    isPublic: false,
    description: 'Institutional dashboard to manage cohorts, sponsored guidance, and student performance',
    targetAudience: 'Educational Institutions & Coaching Centres',
  },
  ADMIN: {
    name: 'ZHERO Platform Admin',
    code: 'admin',
    port: 3003,
    url: isDev ? 'http://localhost:3003' : '#',
    isPublic: false,
    description: 'Central operations: user management, institution verification, taxonomy, and analytics',
    targetAudience: 'Platform Administrators & Operators',
  },
};

export const BRAND = {
  name: 'ZHERO',
  tagline: 'Empowering Next-Gen Careers Through Institutional Guidance',
  colors: {
    primaryOrange: '#FE6904',
    warmOrange: '#FA9B2A',
    palePeach: '#FFE5CE',
    goldenOrange: '#F39E2A',
    white: '#FFFFFF',
    offWhite: '#F8F8F7',
    nearBlack: '#171717',
    mutedText: '#77736F',
    borders: '#EAE7E2',
  },
};

export const API_ENDPOINTS = {
  // Target API routes for upcoming microservices or mock server
  AUTH: '/api/v1/auth',
  ASSESSMENTS: '/api/v1/assessments',
  CAREERS: '/api/v1/careers',
  INSTITUTIONS: '/api/v1/institutions',
  ANALYTICS: '/api/v1/analytics',
};
