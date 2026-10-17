/**
 * ZHERO Meaningful Learning Streak Service
 * Central principle: A streak represents genuine, demonstrable learning activity,
 * NOT simply opening the application, refreshing the page, or running an empty timer.
 */

export const STREAK_STORAGE_KEYS = {
  EVENTS: 'zhero_learning_streak_events',
  PREFERENCES: 'zhero_learning_streak_preferences',
};

// Valid Meaningful Activity Types
export const VALID_ACTIVITY_TYPES = {
  ROADMAP_TASK_COMPLETED: 'roadmap_task_completed',
  CHECKPOINT_ATTEMPTED: 'checkpoint_attempted',
  CHECKPOINT_PASSED: 'checkpoint_passed',
  SPACED_REPETITION_REVIEW: 'spaced_repetition_review',
  BOUNTY_TASK_COMPLETED: 'bounty_task_completed',
  GITHUB_CONTRIBUTION_WORK: 'github_contribution_work',
  STUDY_ROOM_TASK_COMPLETED: 'study_room_task_completed',
  FOCUS_SESSION_FINISHED: 'focus_session_finished',
};

// Ineligible Activity Types that must NEVER count as learning
export const INELIGIBLE_ACTIVITIES = [
  'dashboard_view',
  'page_refresh',
  'navigation_click',
  'abandoned_timer',
  'login',
  'duplicate_event',
];

class StreakService {
  constructor() {
    this.memoryEvents = [];
    this.memoryPreferences = null;
  }

  // Current local calendar day in YYYY-MM-DD
  getLocalTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format any Date or ISO string into YYYY-MM-DD local
  formatDateToDayString(dateInput) {
    if (!dateInput) return this.getLocalTodayDateString();
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return this.getLocalTodayDateString();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Persistence Accessors ---
  getEvents() {
    if (typeof window === 'undefined') {
      return this.memoryEvents || [];
    }
    try {
      const raw = localStorage.getItem(STREAK_STORAGE_KEYS.EVENTS);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveEvents(events) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STREAK_STORAGE_KEYS.EVENTS, JSON.stringify(events));
      window.dispatchEvent(new Event('zhero_streak_updated'));
    } else {
      this.memoryEvents = events;
    }
    return events;
  }

  // --- Record Meaningful Activity ---
  recordActivity({ type, activityId, title, metadata = {}, timestamp = null }) {
    // 1. Guard against ineligible activity
    if (!type || INELIGIBLE_ACTIVITIES.includes(type) || !Object.values(VALID_ACTIVITY_TYPES).includes(type)) {
      return { recorded: false, reason: 'Activity type is not an eligible meaningful learning event.' };
    }

    const eventDate = timestamp ? new Date(timestamp) : new Date();
    const dayString = this.formatDateToDayString(eventDate);
    const todayString = this.getLocalTodayDateString();

    // Guard against future-dated events
    if (dayString > todayString) {
      return { recorded: false, reason: 'Future-dated activity cannot be recorded.' };
    }

    const events = this.getEvents();

    // Deduplication / Idempotency guard: Prevent duplicate events for the same activity on the same day
    const dedupeKey = `${type}_${activityId || 'default'}_${dayString}`;
    const alreadyLogged = events.some((e) => e.dedupeKey === dedupeKey);
    if (alreadyLogged) {
      return { recorded: false, reason: 'Duplicate event already logged for this activity today.', dedupeKey };
    }

    const newEvent = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dedupeKey,
      type,
      activityId: activityId || `act-${Date.now()}`,
      title: title || 'Completed Learning Milestone',
      dayString,
      timestamp: eventDate.toISOString(),
      metadata,
    };

    events.push(newEvent);
    this.saveEvents(events);

    return { recorded: true, event: newEvent };
  }

  // --- Streak & Calendar Calculations ---
  getStreakSummary() {
    const events = this.getEvents();
    const today = this.getLocalTodayDateString();

    // Map unique active learning days
    const activeDaysSet = new Set();
    events.forEach((e) => {
      if (e.dayString && e.dayString <= today) {
        activeDaysSet.add(e.dayString);
      }
    });

    const activeDaysSorted = Array.from(activeDaysSet).sort().reverse(); // newest first
    const totalMeaningfulDays = activeDaysSet.size;

    // Calculate current streak
    let currentStreak = 0;
    if (activeDaysSorted.length > 0) {
      const yesterday = this.getDaysAgoString(1);

      // A streak is active if the student was active today OR yesterday (healthy grace day)
      const hasToday = activeDaysSet.has(today);
      const hasYesterday = activeDaysSet.has(yesterday);

      if (hasToday || hasYesterday) {
        let checkDate = hasToday ? today : yesterday;
        let dayOffset = hasToday ? 0 : 1;

        while (activeDaysSet.has(checkDate)) {
          currentStreak += 1;
          dayOffset += 1;
          checkDate = this.getDaysAgoString(dayOffset);
        }
      }
    }

    // Calculate longest historical streak
    let longestStreak = 0;
    if (activeDaysSorted.length > 0) {
      const chronological = Array.from(activeDaysSet).sort(); // oldest to newest
      let tempCount = 1;
      longestStreak = 1;

      for (let i = 1; i < chronological.length; i++) {
        const prev = new Date(chronological[i - 1]);
        const curr = new Date(chronological[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempCount += 1;
          if (tempCount > longestStreak) longestStreak = tempCount;
        } else {
          tempCount = 1;
        }
      }
    }

    // Weekly activity dots (Last 7 days: today and previous 6 days)
    const weekDays = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const dStr = this.getDaysAgoString(i);
      const dateObj = new Date(dStr);
      weekDays.push({
        date: dStr,
        dayName: dayNames[dateObj.getDay()],
        isToday: dStr === today,
        hasActivity: activeDaysSet.has(dStr),
      });
    }

    const meaningfulDaysThisWeek = weekDays.filter((w) => w.hasActivity).length;

    // Supportive Wellbeing Messages
    let message = 'Ready to learn? Complete one meaningful milestone today to build your routine.';
    if (currentStreak >= 7) {
      message = `Outstanding dedication! You've maintained consistent focus for ${currentStreak} consecutive days.`;
    } else if (currentStreak >= 3) {
      message = `Great momentum! ${currentStreak} days of genuine learning progress recorded.`;
    } else if (currentStreak === 1) {
      message = 'First step taken! Your effort today laid the groundwork for tomorrow.';
    } else if (activeDaysSorted.length > 0) {
      message = 'Ready to continue? Choose one small task today to get right back into your rhythm.';
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalMeaningfulDays,
      meaningfulDaysThisWeek,
      weekDays,
      recentActivities: events.slice(-5).reverse(),
      supportiveMessage: message,
      wellbeingNote: message,
      hasStudiedToday: activeDaysSet.has(today),
    };
  }

  getDaysAgoString(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export const streakService = new StreakService();
