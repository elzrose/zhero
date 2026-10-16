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

const STORAGE_KEY = 'zhero_tc_store_v1';
const STORE_EVENT = 'zhero_tc_store_change';

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.courses && parsed.batches) {
        return parsed;
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
    followUps: INITIAL_FOLLOW_UPS
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
      followUps: INITIAL_FOLLOW_UPS
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
    // Also remove associated batches
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

  // Enrollments (with validation: capacity limit, course-batch consistency)
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

    // Check if student already enrolled
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
        readinessScore: 75,
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
      // Update existing student with new course/batch
      student.courseId = course.id;
      student.courseTitle = course.title;
      student.batchId = batch.id;
      student.batchName = batch.name;
    }

    // Increment counts
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    batch.enrolledCount = (batch.enrolledCount || 0) + 1;
    memoryState.profile.usedSeats = Math.min(memoryState.profile.allocatedSeats, (memoryState.profile.usedSeats || 0) + 1);

    // Create Enrollment Record
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

    // If there was an associated lead, mark them Enrolled
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
  }
};
