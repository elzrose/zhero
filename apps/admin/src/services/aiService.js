import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const AiService = {
  async getAiConfig() {
    const live = await apiRequest('/api/v1/admin/ai/config');
    if (live) return live;
    return StorageService.getAiConfig();
  },

  async updateAssessmentSettings(settings) {
    const config = StorageService.getAiConfig();
    const updated = {
      ...config,
      assessmentGenerationSettings: {
        ...(config.assessmentGenerationSettings || {}),
        ...settings,
      },
    };
    StorageService.saveAiConfig(updated);
    StorageService.logAudit('AI_ASSESSMENT_CONFIG', 'Assessment Generator Settings', 'Updated global question-generation requirements.');
    return updated;
  },

  async updatePrompts(prompts) {
    const config = StorageService.getAiConfig();
    const updated = {
      ...config,
      prompts: {
        ...config.prompts,
        ...prompts,
      },
    };
    StorageService.saveAiConfig(updated);
    StorageService.logAudit('AI_PROMPT_CALIBRATION', 'AI Engine Prompts', 'Updated system prompt templates.');
    return updated;
  },

  async updateModelConfig(modelSettings) {
    const config = StorageService.getAiConfig();
    const updated = {
      ...config,
      ...modelSettings,
    };
    StorageService.saveAiConfig(updated);
    StorageService.logAudit(
      'AI_MODEL_CONFIG',
      `Model: ${modelSettings.activeModel || config.activeModel}`,
      `Temperature: ${modelSettings.temperature ?? config.temperature}, MaxTokens: ${modelSettings.maxTokens ?? config.maxTokens}`
    );
    return updated;
  },

  async toggleFeature(featureKey, enabled) {
    const config = StorageService.getAiConfig();
    const updated = {
      ...config,
      featuresEnabled: {
        ...config.featuresEnabled,
        [featureKey]: enabled,
      },
    };
    StorageService.saveAiConfig(updated);
    StorageService.logAudit('AI_FEATURE_TOGGLE', featureKey, `Feature ${enabled ? 'enabled' : 'disabled'}`);
    return updated;
  },

  async testGenerateSample(promptType) {
    // Simulated safe client test that logs telemetry to observability without leaking keys
    const config = StorageService.getAiConfig();
    const isSuccess = Math.random() > 0.05;
    const latency = Math.floor(450 + Math.random() * 600);
    const newLog = {
      id: `AI-LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action: promptType,
      model: config.activeModel,
      promptTokens: 520,
      completionTokens: isSuccess ? 280 : 0,
      latencyMs: latency,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      statusCode: isSuccess ? 200 : 503,
      errorMessage: isSuccess ? undefined : 'Simulated upstream gateway timeout (test run)',
      studentId: 'Admin Sandbox Diagnostic',
    };

    const updatedConfig = {
      ...config,
      stats: {
        ...config.stats,
        totalRequests: config.stats.totalRequests + 1,
        last24HoursVolume: config.stats.last24HoursVolume + 1,
      },
      recentLogs: [newLog, ...(config.recentLogs || []).slice(0, 9)],
    };

    StorageService.saveAiConfig(updatedConfig);
    return newLog;
  },
};
