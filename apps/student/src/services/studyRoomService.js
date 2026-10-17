/**
 * ZHERO Collaborative Study Rooms Service
 * Manages study rooms, shared goals, task checklists, focus timer tracking,
 * peer updates, and session reflections with honest prototype boundaries.
 */

import { streakService, VALID_ACTIVITY_TYPES } from './streakService.js';

export const STUDY_ROOM_STORAGE_KEYS = {
  ROOMS: 'zhero_study_rooms',
  MEMBERSHIPS: 'zhero_study_room_memberships',
  FOCUS_SESSIONS: 'zhero_study_room_focus_sessions',
};

// Curated Starter Study Rooms (Realistic subject groups with clear learning goals)
export const CURATED_STUDY_ROOMS = [
  {
    id: 'room-dsa-101',
    name: 'DSA Problem-Solving Sprint',
    description: 'Weekly peer review group solving dynamic programming and graph problems.',
    topic: 'Algorithms & Data Structures',
    careerFocus: 'software-engineer',
    difficulty: 'intermediate',
    goal: 'Solve 2 graph traversal problems (BFS/DFS) and explain space complexity trade-offs.',
    targetDate: '2026-10-31',
    durationMinutes: 45,
    maxParticipants: 6,
    visibility: 'public', // 'public' | 'invite_only'
    guidelines: 'Be constructive, share edge case discoveries, and explain logic without spoiling solutions.',
    creatorId: 'peer-aditi',
    creatorName: 'Aditi Rao',
    status: 'available', // 'available' | 'session_active' | 'completed'
    isLocalPrototype: true,
    tasks: [
      { id: 't1', title: 'Implement Breadth-First Search (BFS) graph traversal', isGroupTask: true, completed: false },
      { id: 't2', title: 'Solve Course Schedule topological sort problem', isGroupTask: true, completed: false },
      { id: 't3', title: 'Review time & space complexity analysis with group', isGroupTask: true, completed: false },
    ],
    resourceLinks: [
      { id: 'r1', title: 'Graph Traversal Visualizer', url: 'https://visualgo.net/en/dfsbfs', addedBy: 'Aditi Rao' },
    ],
    createdAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'room-react-102',
    name: 'React Component & Custom Hooks Lab',
    description: 'Hands-on pair programming room refining reusable hooks and unit tests.',
    topic: 'Frontend Engineering',
    careerFocus: 'full-stack-engineer',
    difficulty: 'intermediate',
    goal: 'Build an accessible useLocalStorage hook with TypeScript definitions and test coverage.',
    targetDate: '2026-11-05',
    durationMinutes: 30,
    maxParticipants: 5,
    visibility: 'public',
    guidelines: 'Focus on clean architecture, avoid unnecessary re-renders, and comment on edge cases.',
    creatorId: 'peer-rahul',
    creatorName: 'Rahul Sen',
    status: 'available',
    isLocalPrototype: true,
    tasks: [
      { id: 't1', title: 'Draft hook function signature and event listener sync', isGroupTask: true, completed: false },
      { id: 't2', title: 'Implement JSON error boundary fallback', isGroupTask: true, completed: false },
      { id: 't3', title: 'Write React Testing Library test cases for sync events', isGroupTask: true, completed: false },
    ],
    resourceLinks: [
      { id: 'r1', title: 'React Hooks API Reference', url: 'https://react.dev/reference/react', addedBy: 'Rahul Sen' },
    ],
    createdAt: '2026-10-12T14:30:00Z',
  },
  {
    id: 'room-python-ai-103',
    name: 'Python & Clinical Dataset Exploration',
    description: 'Exploratory data analysis group examining synthetic patient health metrics.',
    topic: 'AI & Data Science',
    careerFocus: 'ai-data-scientist',
    difficulty: 'beginner',
    goal: 'Generate exploratory histograms and compute Pearson correlations for blood pressure factors.',
    targetDate: '2026-11-10',
    durationMinutes: 60,
    maxParticipants: 8,
    visibility: 'public',
    guidelines: 'Prioritize data hygiene, document assumptions, and maintain clean visual charts.',
    creatorId: 'peer-priya',
    creatorName: 'Priya Sharma',
    status: 'available',
    isLocalPrototype: true,
    tasks: [
      { id: 't1', title: 'Load synthetic CSV dataset into Pandas DataFrame', isGroupTask: true, completed: false },
      { id: 't2', title: 'Inspect missing values and compute IQR outlier bounds', isGroupTask: true, completed: false },
      { id: 't3', title: 'Plot distribution scatter matrix with Seaborn / Matplotlib', isGroupTask: true, completed: false },
    ],
    resourceLinks: [
      { id: 'r1', title: 'Pandas EDA Guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html', addedBy: 'Priya Sharma' },
    ],
    createdAt: '2026-10-14T09:00:00Z',
  },
  {
    id: 'room-exam-prep-104',
    name: 'Board Exam Science Revision (PCMB)',
    description: 'Quiet focus session for high-yield Physics and Chemistry formula derivation and review.',
    topic: 'Academic Syllabus Protection',
    careerFocus: 'core-academic',
    difficulty: 'beginner',
    goal: 'Derive Electromagnetic Induction formulas and complete 10 spaced-retrieval flashcards.',
    targetDate: '2026-10-25',
    durationMinutes: 45,
    maxParticipants: 10,
    visibility: 'public',
    guidelines: 'Mute distractions, stay on academic syllabus goals, and review derivations thoroughly.',
    creatorId: 'peer-vikram',
    creatorName: 'Vikram Menon',
    status: 'available',
    isLocalPrototype: true,
    tasks: [
      { id: 't1', title: 'Review Faraday & Lenz laws of electromagnetic induction', isGroupTask: true, completed: false },
      { id: 't2', title: 'Complete 3 numerical problem sets from NCERT exemplar', isGroupTask: true, completed: false },
    ],
    resourceLinks: [],
    createdAt: '2026-10-15T11:00:00Z',
  },
];

class StudyRoomService {
  constructor() {
    this.memoryRooms = null;
    this.memoryMemberships = [];
    this.memoryFocusSessions = [];
  }

  // --- Rooms Catalogue & CRUD ---
  getAllRooms() {
    let custom = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STUDY_ROOM_STORAGE_KEYS.ROOMS);
        custom = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(custom)) custom = [];
      } catch {
        custom = [];
      }
    } else {
      custom = this.memoryRooms || [];
    }

    // Merge curated with student-created custom rooms
    return [...CURATED_STUDY_ROOMS, ...custom];
  }

  saveCustomRooms(rooms) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STUDY_ROOM_STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
      window.dispatchEvent(new Event('zhero_study_room_updated'));
    } else {
      this.memoryRooms = rooms;
    }
    return rooms;
  }

  getRoomById(id) {
    const all = this.getAllRooms();
    return all.find((r) => r.id === id) || null;
  }

  getRooms(filters = {}) {
    let list = this.getAllRooms();

    if (filters.topic && filters.topic !== 'all') {
      const topLower = filters.topic.toLowerCase();
      list = list.filter((r) => r.topic && r.topic.toLowerCase().includes(topLower));
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter((r) => r.difficulty === filters.difficulty);
    }

    if (filters.careerFocus && filters.careerFocus !== 'all') {
      list = list.filter((r) => r.careerFocus === filters.careerFocus);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.topic.toLowerCase().includes(q) ||
          r.goal.toLowerCase().includes(q)
      );
    }

    return list;
  }

  createRoom({
    name,
    description,
    topic,
    careerFocus = 'general',
    difficulty = 'intermediate',
    goal,
    targetDate = '',
    durationMinutes = 30,
    maxParticipants = 8,
    visibility = 'public',
    guidelines = '',
    creatorId = 'current-student',
    creatorName = 'Student',
  }) {
    if (!name || name.trim().length < 3) {
      throw new Error('Study room name must be at least 3 characters long.');
    }
    if (!goal || goal.trim().length < 5) {
      throw new Error('Please define a specific, measurable study goal for the room.');
    }

    const maxCap = Math.max(2, Math.min(25, Number(maxParticipants) || 8));
    const now = new Date().toISOString();
    const id = `room-custom-${Date.now()}`;

    const newRoom = {
      id,
      name: name.trim(),
      description: description ? description.trim() : '',
      topic: topic ? topic.trim() : 'General Learning',
      careerFocus,
      difficulty,
      goal: goal.trim(),
      targetDate: targetDate || '',
      durationMinutes: Number(durationMinutes) || 30,
      maxParticipants: maxCap,
      visibility: visibility === 'invite_only' ? 'invite_only' : 'public',
      guidelines: guidelines ? guidelines.trim() : 'Be respectful, stay focused on goals, and support peers.',
      creatorId,
      creatorName,
      status: 'available',
      isLocalPrototype: true,
      tasks: [],
      resourceLinks: [],
      createdAt: now,
    };

    let custom = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STUDY_ROOM_STORAGE_KEYS.ROOMS);
        custom = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(custom)) custom = [];
      } catch {
        custom = [];
      }
    } else {
      custom = this.memoryRooms || [];
    }

    custom.unshift(newRoom);
    this.saveCustomRooms(custom);

    // Auto-join creator
    this.joinRoom(id, { memberId: creatorId, memberName: creatorName });

    return newRoom;
  }

  updateRoom(roomId, updates = {}) {
    const isCurated = CURATED_STUDY_ROOMS.some((r) => r.id === roomId);
    if (isCurated) {
      // Create local overlay for curated room if modified
      const current = this.getRoomById(roomId);
      const updated = { ...current, ...updates };
      let custom = [];
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(STUDY_ROOM_STORAGE_KEYS.ROOMS);
          custom = raw ? JSON.parse(raw) : [];
        } catch {
          custom = [];
        }
      } else {
        custom = this.memoryRooms || [];
      }
      const existingIdx = custom.findIndex((r) => r.id === roomId);
      if (existingIdx !== -1) {
        custom[existingIdx] = updated;
      } else {
        custom.push(updated);
      }
      this.saveCustomRooms(custom);
      return updated;
    }

    let custom = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STUDY_ROOM_STORAGE_KEYS.ROOMS);
        custom = raw ? JSON.parse(raw) : [];
      } catch {
        custom = [];
      }
    } else {
      custom = this.memoryRooms || [];
    }

    const idx = custom.findIndex((r) => r.id === roomId);
    if (idx === -1) return null;

    custom[idx] = { ...custom[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveCustomRooms(custom);
    return custom[idx];
  }

  // --- Membership Management ---
  getMemberships() {
    if (typeof window === 'undefined') {
      return this.memoryMemberships || [];
    }
    try {
      const raw = localStorage.getItem(STUDY_ROOM_STORAGE_KEYS.MEMBERSHIPS);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveMemberships(list) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STUDY_ROOM_STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(list));
      window.dispatchEvent(new Event('zhero_study_room_updated'));
    } else {
      this.memoryMemberships = list;
    }
    return list;
  }

  getRoomMembers(roomId) {
    const memberships = this.getMemberships();
    return memberships.filter((m) => m.roomId === roomId && m.active);
  }

  joinRoom(roomId, { memberId = 'current-student', memberName = 'Student' } = {}) {
    const room = this.getRoomById(roomId);
    if (!room) throw new Error('Study room not found.');

    const memberships = this.getMemberships();
    const existing = memberships.find((m) => m.roomId === roomId && m.memberId === memberId);

    if (existing && existing.active) {
      return existing; // Already joined, idempotent
    }

    // Capacity enforcement
    const currentMembers = memberships.filter((m) => m.roomId === roomId && m.active);
    if (currentMembers.length >= room.maxParticipants) {
      throw new Error(`Room has reached maximum capacity (${room.maxParticipants} students).`);
    }

    const now = new Date().toISOString();
    if (existing) {
      existing.active = true;
      existing.rejoinedAt = now;
      this.saveMemberships(memberships);
      return existing;
    }

    const newMembership = {
      id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      roomId,
      memberId,
      memberName,
      joinedAt: now,
      active: true,
      personalNotes: '',
      completedPersonalTaskIds: [],
      reflections: [],
    };

    memberships.push(newMembership);
    this.saveMemberships(memberships);
    return newMembership;
  }

  leaveRoom(roomId, memberId = 'current-student') {
    const memberships = this.getMemberships();
    const membership = memberships.find((m) => m.roomId === roomId && m.memberId === memberId);
    if (membership) {
      membership.active = false;
      membership.leftAt = new Date().toISOString();
      this.saveMemberships(memberships);
      return true;
    }
    return false;
  }

  isMember(roomId, memberId = 'current-student') {
    const memberships = this.getMemberships();
    return memberships.some((m) => m.roomId === roomId && m.memberId === memberId && m.active);
  }

  getJoinedRooms(memberId = 'current-student') {
    const memberships = this.getMemberships();
    const joinedRoomIds = memberships.filter((m) => m.memberId === memberId && m.active).map((m) => m.roomId);
    return this.getAllRooms().filter((r) => joinedRoomIds.includes(r.id));
  }

  getMyRooms(memberId = 'current-student') {
    return this.getJoinedRooms(memberId);
  }

  // --- Task Management (Group Tasks vs Personal Tasks) ---
  addTask(roomId, { title, isGroupTask = true, assignedMemberId = null }) {
    if (!title || title.trim().length === 0) throw new Error('Task title cannot be empty.');

    const room = this.getRoomById(roomId);
    if (!room) throw new Error('Study room not found.');

    const newTask = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      isGroupTask: !!isGroupTask,
      assignedMemberId: isGroupTask ? null : assignedMemberId || 'current-student',
      completed: false,
      completedBy: null,
      completedAt: null,
    };

    const currentTasks = room.tasks || [];
    this.updateRoom(roomId, { tasks: [...currentTasks, newTask] });
    return newTask;
  }

  toggleTask(roomId, taskId, memberId = 'current-student') {
    const room = this.getRoomById(roomId);
    if (!room) return null;

    const currentTasks = room.tasks || [];
    const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return null;

    const task = currentTasks[taskIndex];

    // For personal tasks: Ensure completing one member's task does NOT complete another student's task
    if (!task.isGroupTask && task.assignedMemberId && task.assignedMemberId !== memberId) {
      throw new Error("Cannot modify another student's personal task.");
    }

    const nextCompleted = !task.completed;
    const now = new Date().toISOString();

    currentTasks[taskIndex] = {
      ...task,
      completed: nextCompleted,
      completedBy: nextCompleted ? memberId : null,
      completedAt: nextCompleted ? now : null,
    };

    this.updateRoom(roomId, { tasks: currentTasks });

    // When genuinely completing a task, record to the Meaningful Streak Service
    if (nextCompleted) {
      streakService.recordActivity({
        type: VALID_ACTIVITY_TYPES.STUDY_ROOM_TASK_COMPLETED,
        activityId: `room-${roomId}-task-${taskId}`,
        title: `Completed study room task: "${task.title}"`,
        metadata: { roomId, roomName: room.name, taskId },
      });
    }

    return currentTasks[taskIndex];
  }

  // --- Resource Links with Validation ---
  addResourceLink(roomId, { title, url, addedBy = 'Student' }) {
    if (!url || typeof url !== 'string') throw new Error('Resource URL is required.');
    const trimmed = url.trim();

    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('URL must start with http:// or https://');
      }
    } catch {
      throw new Error('Invalid URL format. Please provide a valid web address starting with https://');
    }

    const room = this.getRoomById(roomId);
    if (!room) throw new Error('Study room not found.');

    const newLink = {
      id: `link-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: title && title.trim().length > 0 ? title.trim() : trimmed,
      url: trimmed,
      addedBy,
      addedAt: new Date().toISOString(),
    };

    const currentLinks = room.resourceLinks || [];
    this.updateRoom(roomId, { resourceLinks: [...currentLinks, newLink] });
    return newLink;
  }

  // --- Focus Timer Tracking ---
  logFocusSession({
    roomId,
    durationMinutes = 25,
    goal = '',
    completed = true,
    abandoned = false,
  }) {
    const sessionRecord = {
      id: `focus-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      roomId,
      durationMinutes: Number(durationMinutes) || 25,
      goal: goal || 'Focused Study Session',
      completed: !abandoned && !!completed,
      abandoned: !!abandoned,
      timestamp: new Date().toISOString(),
    };

    // If genuinely completed (not abandoned), reward meaningful learning streak
    if (sessionRecord.completed && !sessionRecord.abandoned) {
      streakService.recordActivity({
        type: VALID_ACTIVITY_TYPES.FOCUS_SESSION_FINISHED,
        activityId: sessionRecord.id,
        title: `Completed ${sessionRecord.durationMinutes}m focus study session`,
        metadata: { roomId, goal: sessionRecord.goal },
      });
    }

    return sessionRecord;
  }

  // --- Notes & Reflection Privacy ---
  saveReflection(roomId, memberId = 'current-student', {
    learnedText = '',
    difficultyText = '',
    nextStepsText = '',
    visibility = 'private', // 'private' (default) | 'shared_with_room'
  } = {}) {
    const memberships = this.getMemberships();
    const membership = memberships.find((m) => m.roomId === roomId && m.memberId === memberId);
    if (!membership) throw new Error('You must be a member of this room to save reflections.');

    const reflectionEntry = {
      id: `ref-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      learned: learnedText.trim(),
      difficulty: difficultyText.trim(),
      nextSteps: nextStepsText.trim(),
      visibility: visibility === 'shared_with_room' ? 'shared_with_room' : 'private',
    };

    membership.reflections = [...(membership.reflections || []), reflectionEntry];
    this.saveMemberships(memberships);
    return reflectionEntry;
  }

  getReflectionsForRoom(roomId, memberId = 'current-student') {
    const memberships = this.getMemberships().filter((m) => m.roomId === roomId);
    const visibleReflections = [];

    memberships.forEach((m) => {
      (m.reflections || []).forEach((ref) => {
        // Private reflections only visible to their author
        if (ref.visibility === 'shared_with_room' || m.memberId === memberId) {
          visibleReflections.push({
            ...ref,
            authorId: m.memberId,
            authorName: m.memberName,
            isOwn: m.memberId === memberId,
          });
        }
      });
    });

    return visibleReflections.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export const studyRoomService = new StudyRoomService();
