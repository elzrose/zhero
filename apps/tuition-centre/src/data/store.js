// ZHERO — Tuition Centre Reactive Persistent Local Store
import { useState, useEffect } from 'react';
import {
  INITIAL_CENTRE_PROFILE,
  INITIAL_COURSES,
  INITIAL_BATCHES,
  INITIAL_CAMPAIGNS,
  INITIAL_LEADS,
  INITIAL_STUDENTS,
  INITIAL_ENROLLMENTS,
  INITIAL_FOLLOW_UPS
} from './mockData';
import {
  INITIAL_BOUNTIES,
  VERBAL_CHECKPOINTS_DATA,
  SPACED_REPETITION_COHORT_DATA,
  INITIAL_STUDY_SESSIONS,
  MENTOR_OPPORTUNITIES
} from './studentCompatibility';

const STORAGE_KEY = 'zhero_tc_store_v1';
const STORE_EVENT = 'zhero_tc_store_change';

// Attempt to read Student Platform keys from localStorage to provide seamless cross-app continuity
function getCrossAppStudentData() {
  if (typeof window === 'undefined') return null;
  try {
    const rawProfile = localStorage.getItem('zhero_student_profile');
    const rawResults = localStorage.getItem('zhero_assessment_results');
    const rawRoadmap = localStorage.getItem('zhero_active_roadmap');
    const rawSimulations = localStorage.getItem('zhero_simulation_results');
    const rawMentorReview = localStorage.getItem('zhero_stage4_mentor_review');
    const rawCalibration = localStorage.getItem('zhero_learning_calibration_state');

    return {
      profile: rawProfile ? JSON.parse(rawProfile) : null,
      results: rawResults ? JSON.parse(rawResults) : null,
      roadmap: rawRoadmap ? JSON.parse(rawRoadmap) : null,
      simulations: rawSimulations ? JSON.parse(rawSimulations) : null,
      mentorReview: rawMentorReview ? JSON.parse(rawMentorReview) : null,
      calibration: rawCalibration ? JSON.parse(rawCalibration) : null,
    };
  } catch (err) {
    console.warn('Could not read Student Platform cross-app keys:', err);
    return null;
  }
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.courses && parsed.batches) {
        // Ensure new modules exist
        return {
          profile: parsed.profile || INITIAL_CENTRE_PROFILE,
          courses: parsed.courses || INITIAL_COURSES,
          batches: parsed.batches || INITIAL_BATCHES,
          campaigns: parsed.campaigns || INITIAL_CAMPAIGNS,
          leads: parsed.leads || INITIAL_LEADS,
          students: parsed.students || INITIAL_STUDENTS,
          enrollments: parsed.enrollments || INITIAL_ENROLLMENTS,
          followUps: parsed.followUps || INITIAL_FOLLOW_UPS,
          bounties: parsed.bounties || INITIAL_BOUNTIES,
          checkpoints: parsed.checkpoints || VERBAL_CHECKPOINTS_DATA,
          retentionQueue: parsed.retentionQueue || SPACED_REPETITION_COHORT_DATA,
          studySessions: parsed.studySessions || INITIAL_STUDY_SESSIONS,
          mentorOpportunities: parsed.mentorOpportunities || MENTOR_OPPORTUNITIES
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved tuition centre data, falling back to defaults:', err);
  }

  return {
    profile: INITIAL_CENTRE_PROFILE,
    courses: INITIAL_COURSES,
    batches: INITIAL_BATCHES,
    campaigns: INITIAL_CAMPAIGNS,
    leads: INITIAL_LEADS,
    students: INITIAL_STUDENTS,
    enrollments: INITIAL_ENROLLMENTS,
    followUps: INITIAL_FOLLOW_UPS,
    bounties: INITIAL_BOUNTIES,
    checkpoints: VERBAL_CHECKPOINTS_DATA,
    retentionQueue: SPACED_REPETITION_COHORT_DATA,
    studySessions: INITIAL_STUDY_SESSIONS,
    mentorOpportunities: MENTOR_OPPORTUNITIES
  };
}

let memoryState = loadInitialState();

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
  } catch (e) {
    console.error('Error saving state to localStorage', e);
  }
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

// React Hook to subscribe to store state
export function useTuitionStore() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    const handler = () => {
      setState({ ...memoryState });
    };
    window.addEventListener(STORE_EVENT, handler);
    return () => window.removeEventListener(STORE_EVENT, handler);
  }, []);

  return state;
}

// Read helper for cross-app student inspection
export function useCrossAppStudentSync() {
  const [crossAppData, setCrossAppData] = useState(() => getCrossAppStudentData());

  useEffect(() => {
    const interval = setInterval(() => {
      setCrossAppData(getCrossAppStudentData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return crossAppData;
}

// CRUD Actions
export const storeActions = {
  // Reset store to fresh initial state
  resetAll: () => {
    memoryState = {
      profile: INITIAL_CENTRE_PROFILE,
      courses: INITIAL_COURSES,
      batches: INITIAL_BATCHES,
      campaigns: INITIAL_CAMPAIGNS,
      leads: INITIAL_LEADS,
      students: INITIAL_STUDENTS,
      enrollments: INITIAL_ENROLLMENTS,
      followUps: INITIAL_FOLLOW_UPS,
      bounties: INITIAL_BOUNTIES,
      checkpoints: VERBAL_CHECKPOINTS_DATA,
      retentionQueue: SPACED_REPETITION_COHORT_DATA,
      studySessions: INITIAL_STUDY_SESSIONS,
      mentorOpportunities: MENTOR_OPPORTUNITIES
    };
    persistState();
  },

  // Profile
  updateProfile: (updatedProfile) => {
    memoryState.profile = { ...memoryState.profile, ...updatedProfile };
    persistState();
  },

  // Courses
  saveCourse: (course) => {
    if (course.id) {
      const idx = memoryState.courses.findIndex(c => c.id === course.id);
      if (idx !== -1) {
        memoryState.courses[idx] = { ...memoryState.courses[idx], ...course };
      } else {
        memoryState.courses.unshift(course);
      }
    } else {
      const newCourse = {
        ...course,
        id: `crs-${Date.now().toString().slice(-4)}`,
        enrolledCount: 0,
        status: course.status || 'Active'
      };
      memoryState.courses.unshift(newCourse);
    }
    persistState();
  },

  deleteCourse: (courseId) => {
    memoryState.courses = memoryState.courses.filter(c => c.id !== courseId);
    memoryState.batches = memoryState.batches.filter(b => b.courseId !== courseId);
    persistState();
  },

  // Batches
  saveBatch: (batch) => {
    const course = memoryState.courses.find(c => c.id === batch.courseId);
    const enriched = {
      ...batch,
      courseTitle: course ? course.title : batch.courseTitle || 'Unassigned Course'
    };

    if (enriched.id) {
      const idx = memoryState.batches.findIndex(b => b.id === enriched.id);
      if (idx !== -1) {
        memoryState.batches[idx] = { ...memoryState.batches[idx], ...enriched };
      } else {
        memoryState.batches.unshift(enriched);
      }
    } else {
      const newBatch = {
        ...enriched,
        id: `batch-${Date.now().toString().slice(-4)}`,
        enrolledCount: 0,
        status: enriched.status || 'Upcoming'
      };
      memoryState.batches.unshift(newBatch);
    }
    persistState();
  },

  deleteBatch: (batchId) => {
    memoryState.batches = memoryState.batches.filter(b => b.id !== batchId);
    persistState();
  },

  // Campaigns
  saveCampaign: (campaign) => {
    if (campaign.id) {
      const idx = memoryState.campaigns.findIndex(c => c.id === campaign.id);
      if (idx !== -1) {
        memoryState.campaigns[idx] = { ...memoryState.campaigns[idx], ...campaign };
      } else {
        memoryState.campaigns.unshift(campaign);
      }
    } else {
      const newCampaign = {
        ...campaign,
        id: `cmp-${Date.now().toString().slice(-4)}`,
        metrics: { qrScans: 0, testStarts: 0, completions: 0, qualifiedLeads: 0, courseEnquiries: 0, enrolled: 0 },
        status: 'Active'
      };
      memoryState.campaigns.unshift(newCampaign);
    }
    persistState();
  },

  // Leads & Enquiries
  saveLead: (lead) => {
    if (lead.id) {
      const idx = memoryState.leads.findIndex(l => l.id === lead.id);
      if (idx !== -1) {
        memoryState.leads[idx] = { ...memoryState.leads[idx], ...lead };
      } else {
        memoryState.leads.unshift(lead);
      }
    } else {
      const newLead = {
        ...lead,
        id: `lead-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split('T')[0],
        status: lead.status || 'New'
      };
      memoryState.leads.unshift(newLead);
    }
    persistState();
  },

  updateLeadStatus: (leadId, newStatus) => {
    const lead = memoryState.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      persistState();
    }
  },

  // Students
  saveStudent: (student) => {
    if (student.id) {
      const idx = memoryState.students.findIndex(s => s.id === student.id);
      if (idx !== -1) {
        memoryState.students[idx] = { ...memoryState.students[idx], ...student };
      } else {
        memoryState.students.unshift(student);
      }
    } else {
      const newStudent = {
        ...student,
        id: `STU-${Math.floor(100 + Math.random() * 900)}`,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Enrolled',
        attendanceRate: 100,
        engagementCategory: 'Healthy'
      };
      memoryState.students.unshift(newStudent);
    }
    persistState();
  },

  updateStudentEngagement: (studentId, engagementCategory) => {
    const student = memoryState.students.find(s => s.id === studentId);
    if (student) {
      student.engagementCategory = engagementCategory;
      persistState();
    }
  },

  // Record Mentor Interview notes for a student
  saveInterviewNotes: (studentId, interviewData) => {
    const student = memoryState.students.find(s => s.id === studentId);
    if (student) {
      student.interviewNotes = interviewData.notes;
      student.interviewDate = interviewData.date || new Date().toISOString().split('T')[0];
      student.interviewStatus = 'Completed';
      student.mentorFeedback = interviewData.feedback;
      student.agreedNextSteps = interviewData.agreedNextSteps;
      student.suggestedSkillFocus = interviewData.suggestedSkillFocus;
    }

    // Also mirror to student platform localStorage key if available
    try {
      localStorage.setItem('zhero_stage4_mentor_review', JSON.stringify({
        counselorName: interviewData.mentorName || 'Dr. Radhika Sen',
        counselorRole: 'Director & Lead STEM Mentor',
        meetingDate: new Date().toISOString(),
        verifiedReadinessScore: interviewData.readinessScore || 85,
        careerFitSummary: interviewData.feedback || 'Candidate shows strong architectural problem-solving and self-driven coding discipline.',
        suggestedSkillFocus: interviewData.suggestedSkillFocus || 'Explore real-world client bounties and complete Phase 2 React components.',
        agreedNextMilestone: interviewData.agreedNextSteps || 'Complete introductory wireframing and submit bounty proposal.',
      }));
    } catch {
      // safe fallback
    }

    persistState();
  },

  // Enrollments
  createEnrollment: (payload) => {
    const { studentName, studentEmail, studentPhone, courseId, batchId, feePaid, sponsorship, notes } = payload;
    const course = memoryState.courses.find(c => c.id === courseId);
    const batch = memoryState.batches.find(b => b.id === batchId);

    if (!course) throw new Error('Selected course does not exist.');
    if (!batch) throw new Error('Selected batch does not exist.');
    if (batch.courseId !== courseId) throw new Error('Selected batch does not belong to the selected course.');
    if (batch.capacity && batch.enrolledCount >= batch.capacity) {
      throw new Error(`Batch "${batch.name}" is already at full capacity (${batch.capacity} seats).`);
    }

    let student = memoryState.students.find(s => s.email.toLowerCase() === studentEmail.toLowerCase());
    if (!student) {
      student = {
        id: `STU-${Math.floor(100 + Math.random() * 900)}`,
        name: studentName,
        email: studentEmail,
        phone: studentPhone || '+91 90000 00000',
        batchId: batch.id,
        batchName: batch.name,
        courseId: course.id,
        courseTitle: course.title,
        targetCareer: course.relatedCareers[0] || 'Technical Specialist',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Enrolled',
        assessmentStatus: 'Completed',
        readinessScore: 78,
        attendanceRate: 100,
        engagementCategory: 'Healthy',
        lastActive: 'Just now',
        completedModules: 0,
        totalModules: 12,
        notes: notes || 'Enrolled from centre admissions',
        sponsored: true
      };
      memoryState.students.unshift(student);
    } else {
      student.courseId = course.id;
      student.courseTitle = course.title;
      student.batchId = batch.id;
      student.batchName = batch.name;
    }

    course.enrolledCount = (course.enrolledCount || 0) + 1;
    batch.enrolledCount = (batch.enrolledCount || 0) + 1;
    memoryState.profile.usedSeats = Math.min(memoryState.profile.allocatedSeats, (memoryState.profile.usedSeats || 0) + 1);

    const enrollment = {
      id: `enr-${Date.now().toString().slice(-4)}`,
      studentId: student.id,
      studentName: student.name,
      courseId: course.id,
      courseTitle: course.title,
      batchId: batch.id,
      batchName: batch.name,
      enrolledAt: new Date().toISOString().split('T')[0],
      feePaid: Number(feePaid) || course.fee,
      feeStatus: Number(feePaid) >= course.fee ? 'Paid' : 'Partial',
      sponsorship: sponsorship || 'Tuition Centre Sponsored Cohort',
      notes: notes || ''
    };

    memoryState.enrollments.unshift(enrollment);

    const matchingLead = memoryState.leads.find(l => l.email.toLowerCase() === studentEmail.toLowerCase());
    if (matchingLead) {
      matchingLead.status = 'Enrolled';
    }

    persistState();
    return enrollment;
  },

  // Follow Ups
  saveFollowUp: (followUp) => {
    if (followUp.id) {
      const idx = memoryState.followUps.findIndex(f => f.id === followUp.id);
      if (idx !== -1) {
        memoryState.followUps[idx] = { ...memoryState.followUps[idx], ...followUp };
      }
    } else {
      const newFollowUp = {
        ...followUp,
        id: `flw-${Date.now().toString().slice(-4)}`,
        status: 'Pending'
      };
      memoryState.followUps.unshift(newFollowUp);
    }
    persistState();
  },

  toggleFollowUpStatus: (followUpId) => {
    const f = memoryState.followUps.find(x => x.id === followUpId);
    if (f) {
      f.status = f.status === 'Completed' ? 'Pending' : 'Completed';
      persistState();
    }
  },

  // Real-World Bounties Management
  saveBounty: (bounty) => {
    if (bounty.id) {
      const idx = memoryState.bounties.findIndex(b => b.id === bounty.id);
      if (idx !== -1) {
        memoryState.bounties[idx] = { ...memoryState.bounties[idx], ...bounty };
      } else {
        memoryState.bounties.unshift(bounty);
      }
    } else {
      const newBty = {
        ...bounty,
        id: `bty-${Date.now().toString().slice(-4)}`,
        status: bounty.status || 'Open'
      };
      memoryState.bounties.unshift(newBty);
    }
    persistState();
  },

  updateBountyStatus: (bountyId, status, mentorNotes) => {
    const bty = memoryState.bounties.find(b => b.id === bountyId);
    if (bty) {
      bty.status = status;
      if (mentorNotes) bty.mentorNotes = mentorNotes;
      if (status === 'Mentor Approved') bty.mentorApprovedAt = new Date().toISOString().split('T')[0];
      if (status === 'Client Accepted') bty.clientAcceptedAt = new Date().toISOString().split('T')[0];
      persistState();
    }
  },

  // Verbal Checkpoints Review
  saveCheckpointReview: (checkpointId, reviewNotes, isVerified = true) => {
    const chk = memoryState.checkpoints.find(c => c.id === checkpointId);
    if (chk) {
      chk.mentorReviewStatus = isVerified ? 'Verified by Mentor' : 'Remediation Requested';
      chk.mentorReviewNotes = reviewNotes;
      chk.reviewedAt = new Date().toISOString().split('T')[0];
      persistState();
    }
  },

  // Study Sessions
  saveStudySession: (session) => {
    if (session.id) {
      const idx = memoryState.studySessions.findIndex(s => s.id === session.id);
      if (idx !== -1) {
        memoryState.studySessions[idx] = { ...memoryState.studySessions[idx], ...session };
      } else {
        memoryState.studySessions.unshift(session);
      }
    } else {
      const newSession = {
        ...session,
        id: `session-${Date.now().toString().slice(-4)}`,
        status: 'Scheduled',
        participantCount: 0
      };
      memoryState.studySessions.unshift(newSession);
    }
    persistState();
  }
};
