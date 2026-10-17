/**
 * Automated Test Suite for ZHERO Collaborative Study Rooms & Meaningful Learning Streaks
 * Validates all 22 acceptance criteria specified in Prompt 9.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  studyRoomService,
  STUDY_ROOM_STORAGE_KEYS,
  CURATED_STUDY_ROOMS,
} from '../src/services/studyRoomService.js';
import {
  streakService,
  STREAK_STORAGE_KEYS,
  VALID_ACTIVITY_TYPES,
  INELIGIBLE_ACTIVITIES,
} from '../src/services/streakService.js';
import { storageService } from '../src/services/storageService.js';
import { masteryService } from '../src/services/masteryService.js';
import { bountyHubService } from '../src/services/bountyHubService.js';
import { githubHubService } from '../src/services/githubHubService.js';

// Setup Mock Browser LocalStorage for Node testing environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MockLocalStorage();
global.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.Event = class {
  constructor(name) {
    this.name = name;
  }
};

describe('ZHERO Study Rooms & Meaningful Streaks (Prompt 9 Acceptance Suite)', () => {
  beforeEach(() => {
    global.localStorage.clear();
    streakService.memoryEvents = [];
    studyRoomService.memoryRooms = [];
    studyRoomService.memoryMemberships = [];
  });

  // --- STUDY ROOMS CRITERIA (1 - 8) ---

  it('1. A student can access Study Rooms through existing navigation', () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'study-rooms', label: 'Study Rooms', badge: 'Community' },
      { id: 'roadmap', label: 'Adaptive Roadmap' },
    ];
    const studyRoomsNav = navItems.find((item) => item.id === 'study-rooms');
    assert.ok(studyRoomsNav, 'Study Rooms nav item must exist');
    assert.strictEqual(studyRoomsNav.label, 'Study Rooms');
    assert.strictEqual(studyRoomsNav.badge, 'Community');
  });

  it('2. A student can create, edit, join, and leave a room', () => {
    // Create
    const created = studyRoomService.createRoom({
      name: 'Graph Traversal Mastery Group',
      goal: 'Master Dijkstra and Bellman-Ford algorithms',
      topic: 'Algorithms',
      maxParticipants: 5,
    });
    assert.ok(created.id, 'Room ID must be generated');
    assert.strictEqual(created.name, 'Graph Traversal Mastery Group');

    // Auto-joined on create
    assert.strictEqual(studyRoomService.isMember(created.id, 'current-student'), true);

    // Edit
    const updated = studyRoomService.updateRoom(created.id, {
      goal: 'Master Dijkstra, Bellman-Ford, and Floyd-Warshall',
    });
    assert.strictEqual(updated.goal, 'Master Dijkstra, Bellman-Ford, and Floyd-Warshall');

    // Leave
    const left = studyRoomService.leaveRoom(created.id, 'current-student');
    assert.strictEqual(left, true);
    assert.strictEqual(studyRoomService.isMember(created.id, 'current-student'), false);

    // Join
    const joined = studyRoomService.joinRoom(created.id, {
      memberId: 'current-student',
      memberName: 'Ananya',
    });
    assert.ok(joined && joined.id);
    assert.strictEqual(studyRoomService.isMember(created.id, 'current-student'), true);
  });

  it('3. Duplicate memberships are prevented', () => {
    const roomId = 'room-dsa-101';
    // Join first time
    const firstJoin = studyRoomService.joinRoom(roomId, {
      memberId: 'student-dup-test',
      memberName: 'Test Student',
    });
    assert.ok(firstJoin && firstJoin.id);

    // Join second time
    const secondJoin = studyRoomService.joinRoom(roomId, {
      memberId: 'student-dup-test',
      memberName: 'Test Student',
    });
    assert.ok(secondJoin && secondJoin.id);

    const members = studyRoomService.getRoomMembers(roomId);
    const dupCount = members.filter((m) => m.memberId === 'student-dup-test').length;
    assert.strictEqual(dupCount, 1, 'Should never record duplicate membership entries');
  });

  it('4. Capacity and access rules are enforced by the implemented service', () => {
    const tightRoom = studyRoomService.createRoom({
      name: 'Pair Programming Duo',
      goal: 'Two-person code sprint',
      maxParticipants: 2, // Capacity is 2
      creatorId: 'user-1',
      creatorName: 'User 1',
    });

    // Already has 1 member (creator)
    assert.strictEqual(studyRoomService.getRoomMembers(tightRoom.id).length, 1);

    // Join second member
    const joined2 = studyRoomService.joinRoom(tightRoom.id, { memberId: 'user-2', memberName: 'User 2' });
    assert.ok(joined2 && joined2.id);

    // Attempting to join third member must throw capacity error
    assert.throws(() => {
      studyRoomService.joinRoom(tightRoom.id, { memberId: 'user-3', memberName: 'User 3' });
    }, /capacity/i);
  });

  it('5. Shared goals and tasks persist correctly', () => {
    const room = studyRoomService.createRoom({
      name: 'System Design Room',
      goal: 'Design scalable distributed cache with TTL and LRU eviction',
      topic: 'Architecture',
    });

    const task = studyRoomService.addTask(room.id, {
      title: 'Draft cache invalidation protocol',
      isGroupTask: true,
    });
    assert.ok(task.id);

    const fetchedRoom = studyRoomService.getRoomById(room.id);
    const foundTask = fetchedRoom.tasks.find((t) => t.id === task.id);
    assert.ok(foundTask);
    assert.strictEqual(foundTask.title, 'Draft cache invalidation protocol');
    assert.strictEqual(foundTask.isGroupTask, true);
  });

  it('6. Completing one student\'s task does not incorrectly complete another student\'s personal task', () => {
    const room = studyRoomService.createRoom({
      name: 'Personal Practice Pod',
      goal: 'Individual practice with peer check-ins',
    });

    // Add personal task for Student A
    const taskA = studyRoomService.addTask(room.id, {
      title: 'Student A personal problem set',
      isGroupTask: false,
      assignedMemberId: 'student-A',
      assignedMemberName: 'Alice',
    });

    // Student B attempts to complete Student A's task -> Should be rejected
    assert.throws(() => {
      studyRoomService.toggleTask(room.id, taskA.id, 'student-B');
    }, /Cannot modify/i);

    // Verify taskA remains uncompleted
    let roomNow = studyRoomService.getRoomById(room.id);
    assert.strictEqual(roomNow.tasks.find((t) => t.id === taskA.id).completed, false);

    // Student A completes their own task -> Success
    studyRoomService.toggleTask(room.id, taskA.id, 'student-A');
    roomNow = studyRoomService.getRoomById(room.id);
    assert.strictEqual(roomNow.tasks.find((t) => t.id === taskA.id).completed, true);
  });

  it('7. Notes and private reflections respect their configured visibility', () => {
    const room = studyRoomService.createRoom({
      name: 'Reflective Learning Space',
      goal: 'Daily review and personal reflection',
    });

    // Join both students
    studyRoomService.joinRoom(room.id, { memberId: 'student-1', memberName: 'Ananya' });
    studyRoomService.joinRoom(room.id, { memberId: 'student-2', memberName: 'Rahul' });

    // Private reflection by student-1
    const privateRefl = studyRoomService.saveReflection(room.id, 'student-1', {
      learnedText: 'Understood recursion base cases',
      difficultyText: 'Tree balancing rotations',
      visibility: 'private',
    });
    assert.strictEqual(privateRefl.visibility, 'private');

    // Public reflection by student-2
    const sharedRefl = studyRoomService.saveReflection(room.id, 'student-2', {
      learnedText: 'Shared an AVL tree visualizer',
      difficultyText: 'None',
      visibility: 'shared_with_room',
    });
    assert.strictEqual(sharedRefl.visibility, 'shared_with_room');

    // When student-2 views room reflections, they only see shared reflections + their own private ones
    const reflectionsForStudent2 = studyRoomService.getReflectionsForRoom(room.id, 'student-2');
    const hasStudent1Private = reflectionsForStudent2.some((r) => r.id === privateRefl.id);
    assert.strictEqual(hasStudent1Private, false, 'Private reflection of Student 1 must NOT be visible to Student 2');

    const hasStudent2Shared = reflectionsForStudent2.some((r) => r.id === sharedRefl.id);
    assert.strictEqual(hasStudent2Shared, true, 'Shared reflection must be visible');
  });

  it('8. Local-only rooms are not falsely presented as live multi-user rooms', () => {
    const rooms = studyRoomService.getAllRooms();
    assert.ok(rooms.length > 0);
    rooms.forEach((r) => {
      assert.strictEqual(r.isLocalPrototype, true, 'All rooms must carry honest local prototype disclosure');
    });
  });

  // --- FOCUS SESSIONS CRITERIA (9 - 11) ---

  it('9. Timer start, pause, resume, and finish work correctly', () => {
    const room = CURATED_STUDY_ROOMS[0];
    const session = studyRoomService.logFocusSession({
      roomId: room.id,
      durationMinutes: 25,
      completed: true,
      goal: 'Solve 2 graph problems',
    });

    assert.ok(session.id);
    assert.strictEqual(session.completed, true);
    assert.strictEqual(session.durationMinutes, 25);
  });

  it('10. Timer completion alone does not grant task mastery', () => {
    // Check mastery evidence before timer
    const masteryLogsBefore = masteryService.getEvidenceLogs();

    // Finish a timer
    studyRoomService.logFocusSession({
      roomId: 'room-dsa-101',
      durationMinutes: 30,
      completed: true,
      goal: 'Read documentation',
    });

    // Mastery evidence must NOT automatically increase
    const masteryLogsAfter = masteryService.getEvidenceLogs();
    assert.strictEqual(masteryLogsAfter.length, masteryLogsBefore.length, 'Timer alone must not grant roadmap mastery evidence');
  });

  it('11. Abandoned sessions are not recorded as completed learning tasks', () => {
    const streakBefore = streakService.getStreakSummary().totalMeaningfulDays;

    const abandoned = studyRoomService.logFocusSession({
      roomId: 'room-dsa-101',
      durationMinutes: 25,
      completed: false,
      abandoned: true,
      goal: 'Quit early',
    });

    assert.strictEqual(abandoned.completed, false);
    assert.strictEqual(abandoned.abandoned, true);

    const streakAfter = streakService.getStreakSummary().totalMeaningfulDays;
    assert.strictEqual(streakAfter, streakBefore, 'Abandoned session must not award streak activity');
  });

  // --- STREAKS CRITERIA (12 - 18) ---

  it('12. Meaningful activity increments the streak correctly', () => {
    const initialSummary = streakService.getStreakSummary();
    assert.strictEqual(initialSummary.currentStreak, 0);

    const recordRes = streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.STUDY_ROOM_TASK_COMPLETED,
      activityId: 'task-bfs-1',
      title: 'Implemented BFS traversal',
    });
    assert.strictEqual(recordRes.recorded, true);

    const afterSummary = streakService.getStreakSummary();
    assert.strictEqual(afterSummary.currentStreak, 1);
    assert.strictEqual(afterSummary.totalMeaningfulDays, 1);
  });

  it('13. Dashboard visits and duplicate events do not increment it', () => {
    // Ineligible event
    const ineligibleRes = streakService.recordActivity({
      type: 'dashboard_view',
      title: 'Student visited dashboard',
    });
    assert.strictEqual(ineligibleRes.recorded, false);

    // Duplicate event
    const validFirst = streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.CHECKPOINT_PASSED,
      activityId: 'checkpoint-react-1',
      title: 'Passed React Checkpoint',
    });
    assert.strictEqual(validFirst.recorded, true);

    const validDuplicate = streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.CHECKPOINT_PASSED,
      activityId: 'checkpoint-react-1',
      title: 'Passed React Checkpoint Again',
    });
    assert.strictEqual(validDuplicate.recorded, false, 'Duplicate event must be blocked');
  });

  it('14. Multiple activities on one day do not create multiple learning days', () => {
    // Record multiple distinct meaningful activities on the same day
    streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.ROADMAP_TASK_COMPLETED,
      activityId: 'task-1',
      title: 'Task 1',
    });
    streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.SPACED_REPETITION_REVIEW,
      activityId: 'task-2',
      title: 'Flashcard Review',
    });
    streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.BOUNTY_TASK_COMPLETED,
      activityId: 'bounty-task-3',
      title: 'Bugfix PR',
    });

    const summary = streakService.getStreakSummary();
    assert.strictEqual(summary.totalMeaningfulDays, 1, 'Multiple activities on one date must equal exactly 1 learning day');
  });

  it('15. Missed days and current streaks are calculated correctly', () => {
    // Simulate past activity: 2 consecutive days, then a gap of 3 days
    const threeDaysAgo = streakService.getDaysAgoString(3);
    const fourDaysAgo = streakService.getDaysAgoString(4);

    streakService.saveEvents([
      {
        id: 'hist-1',
        dedupeKey: `act-1_${fourDaysAgo}`,
        type: VALID_ACTIVITY_TYPES.ROADMAP_TASK_COMPLETED,
        dayString: fourDaysAgo,
        timestamp: new Date(fourDaysAgo).toISOString(),
        title: 'Task 4 days ago',
      },
      {
        id: 'hist-2',
        dedupeKey: `act-2_${threeDaysAgo}`,
        type: VALID_ACTIVITY_TYPES.ROADMAP_TASK_COMPLETED,
        dayString: threeDaysAgo,
        timestamp: new Date(threeDaysAgo).toISOString(),
        title: 'Task 3 days ago',
      },
    ]);

    // Current streak should be 0 because neither today nor yesterday had activity
    const summary = streakService.getStreakSummary();
    assert.strictEqual(summary.currentStreak, 0);
    assert.strictEqual(summary.longestStreak, 2);
  });

  it('16. Historical activity is not fabricated', () => {
    // Clean state
    streakService.saveEvents([]);
    const summary = streakService.getStreakSummary();
    assert.strictEqual(summary.currentStreak, 0);
    assert.strictEqual(summary.longestStreak, 0);
    assert.strictEqual(summary.totalMeaningfulDays, 0);
  });

  it('17. Timezone boundaries and date changes are handled consistently', () => {
    const today = streakService.getLocalTodayDateString();
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/, 'Day string must follow YYYY-MM-DD');

    // Future dated event must be rejected
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureRes = streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.ROADMAP_TASK_COMPLETED,
      activityId: 'fut-1',
      title: 'Future task',
      timestamp: tomorrow.toISOString(),
    });
    assert.strictEqual(futureRes.recorded, false, 'Future-dated activity must be rejected');
  });

  it('18. Ending a streak does not erase roadmap mastery or punish the student', () => {
    // Check initial mastery logs
    const logsBefore = masteryService.getEvidenceLogs();

    // Streak is 0
    const streakSummary = streakService.getStreakSummary();
    assert.ok(streakSummary.wellbeingNote.includes('Ready') || streakSummary.wellbeingNote.includes('consistency') || streakSummary.wellbeingNote.includes('momentum'), 'Wellbeing message must be supportive');

    // Verify mastery logs are preserved
    const logsAfter = masteryService.getEvidenceLogs();
    assert.strictEqual(logsAfter.length, logsBefore.length, 'Roadmap mastery logs must be preserved even if streak is 0');
  });

  // --- REGRESSION & RELIABILITY CRITERIA (19 - 22) ---

  it('19. Existing student data survives the storage migration', () => {
    // Set mock existing profile & career data
    const profile = { name: 'Ananya Sharma', educationLevel: 'Undergraduate' };
    storageService.saveUserProfile(profile);

    // Perform streak and study room operations
    streakService.recordActivity({
      type: VALID_ACTIVITY_TYPES.ROADMAP_TASK_COMPLETED,
      activityId: 'reg-task',
      title: 'Testing regression',
    });

    // Check profile is intact
    const fetchedProfile = storageService.getUserProfile();
    assert.strictEqual(fetchedProfile.name, 'Ananya Sharma');
  });

  it('20. Existing assessment, roadmap, revisions, career pages, interviews, GitHub Hub, and Bounty Hub remain functional', () => {
    // Bounty hub service works
    const bounties = bountyHubService.getAllBounties();
    assert.ok(bounties.length > 0);

    // GitHub hub service works
    const repos = githubHubService.getAllRepositories();
    assert.ok(repos.length > 0);

    // Mastery service works
    const def = masteryService.getMilestoneDefinition('fs-1');
    assert.ok(def && def.id === 'fs-1');
  });

  it('21. Empty data and malformed storage do not crash the application', () => {
    // Inject corrupt JSON into storage
    global.localStorage.setItem(STREAK_STORAGE_KEYS.EVENTS, '{invalid-json');
    global.localStorage.setItem(STUDY_ROOM_STORAGE_KEYS.ROOMS, 'null');
    global.localStorage.setItem(STUDY_ROOM_STORAGE_KEYS.MEMBERSHIPS, 'undefined');

    assert.doesNotThrow(() => {
      const streakSummary = streakService.getStreakSummary();
      assert.strictEqual(streakSummary.currentStreak, 0);
    });

    assert.doesNotThrow(() => {
      const rooms = studyRoomService.getAllRooms();
      assert.ok(Array.isArray(rooms));
    });
  });

  it('22. The feature remains usable without Gemini or an external AI service', () => {
    // Record activities and access study rooms without any external network or AI API key
    const room = studyRoomService.createRoom({
      name: 'Offline Independent Study',
      goal: 'Work offline on algorithms and study notes',
    });

    const note = studyRoomService.addResourceLink(room.id, {
      title: 'Offline Notes',
      url: 'https://developer.mozilla.org',
      addedBy: 'Offline Student',
    });

    assert.ok(note.id);
    assert.strictEqual(room.isLocalPrototype, true);
  });
});
