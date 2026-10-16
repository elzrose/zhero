import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const AssessmentService = {
  async getAllAssessments() {
    const live = await apiRequest('/api/v1/assessments');
    if (live && Array.isArray(live)) return live;
    return StorageService.getAssessments();
  },

  async createAssessment(data) {
    const newAssessment = {
      id: `ASM-${(StorageService.getAssessments().length + 1).toString().padStart(2, '0')}`,
      slug: (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status: 'DRAFT',
      version: '1.0',
      totalAttempts: 0,
      avgScore: 0,
      completionRate: '0%',
      questions: [],
      durationMinutes: 30,
      passingScore: 60,
      totalMarks: 100,
      ...data,
    };

    const list = StorageService.getAssessments();
    const updated = [newAssessment, ...list];
    StorageService.saveAssessments(updated);
    StorageService.logAudit('ASSESSMENT_CREATED', `${newAssessment.title} (${newAssessment.id})`, `Created draft assessment profile.`);
    return newAssessment;
  },

  async updateAssessment(id, updates) {
    const list = StorageService.getAssessments();
    const current = list.find(a => a.id === id);

    // Preserve historical versioning: if critical criteria change, bump minor version
    let updatedVersion = current?.version || '1.0';
    if (updates.passingScore !== undefined && updates.passingScore !== current?.passingScore) {
      const [major, minor] = updatedVersion.split('.').map(Number);
      updatedVersion = `${major}.${(minor || 0) + 1}`;
    }

    const updated = list.map(a => {
      if (a.id === id) {
        return {
          ...a,
          ...updates,
          version: updatedVersion,
        };
      }
      return a;
    });

    StorageService.saveAssessments(updated);
    StorageService.logAudit('ASSESSMENT_UPDATED', `${current?.title || id}`, `Updated criteria (version: ${updatedVersion})`);
    return updated;
  },

  async duplicateAssessment(id) {
    const list = StorageService.getAssessments();
    const source = list.find(a => a.id === id);
    if (!source) return null;

    const copy = {
      ...source,
      id: `ASM-${(list.length + 1).toString().padStart(2, '0')}`,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy`,
      status: 'DRAFT',
      version: '1.0',
      totalAttempts: 0,
      avgScore: 0,
      completionRate: '0%',
      questions: source.questions.map(q => ({
        ...q,
        id: `Q-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`,
      })),
    };

    const updated = [copy, ...list];
    StorageService.saveAssessments(updated);
    StorageService.logAudit('ASSESSMENT_DUPLICATED', `${copy.title} (${copy.id})`, `Duplicated from ${source.title}`);
    return copy;
  },

  async togglePublish(id) {
    const list = StorageService.getAssessments();
    const target = list.find(a => a.id === id);
    const newStatus = target?.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    return this.updateAssessment(id, { status: newStatus });
  },

  async addQuestion(assessmentId, questionData) {
    const list = StorageService.getAssessments();
    const target = list.find(a => a.id === assessmentId);
    if (!target) return null;

    const newQuestion = {
      id: `Q-${Date.now().toString().slice(-4)}`,
      text: questionData.text,
      options: questionData.options || ['', '', '', ''],
      correctOptionIndex: Number(questionData.correctOptionIndex ?? 0),
      skillMapped: questionData.skillMapped || 'General',
      marks: Number(questionData.marks || 5),
      difficulty: questionData.difficulty || 'Medium',
      explanation: questionData.explanation || '',
    };

    const updatedQuestions = [...(target.questions || []), newQuestion];
    await this.updateAssessment(assessmentId, { questions: updatedQuestions });
    StorageService.logAudit('QUESTION_ADDED', `${target.title}`, `Added question (${newQuestion.id}) evaluating ${newQuestion.skillMapped}`);
    return newQuestion;
  },

  async updateQuestion(assessmentId, questionId, questionData) {
    const list = StorageService.getAssessments();
    const target = list.find(a => a.id === assessmentId);
    if (!target) return null;

    const updatedQuestions = (target.questions || []).map(q => {
      if (q.id === questionId) {
        return { ...q, ...questionData };
      }
      return q;
    });

    await this.updateAssessment(assessmentId, { questions: updatedQuestions });
    return updatedQuestions;
  },

  async deleteQuestion(assessmentId, questionId) {
    const list = StorageService.getAssessments();
    const target = list.find(a => a.id === assessmentId);
    if (!target) return null;

    const updatedQuestions = (target.questions || []).filter(q => q.id !== questionId);
    await this.updateAssessment(assessmentId, { questions: updatedQuestions });
    StorageService.logAudit('QUESTION_DELETED', `${target.title}`, `Removed question ${questionId}`);
    return updatedQuestions;
  },

  async deleteAssessment(id) {
    const list = StorageService.getAssessments();
    const target = list.find(a => a.id === id);
    const updated = list.filter(a => a.id !== id);
    StorageService.saveAssessments(updated);
    StorageService.logAudit('ASSESSMENT_DELETED', `${target?.title || id}`, `Assessment catalog record removed.`);
    return updated;
  },
};
