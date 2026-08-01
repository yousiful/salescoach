// Test utilities for AI testing models
export interface TestScenario {
  name: string;
  description: string;
  setup: () => Promise<void>;
  validate: () => boolean;
}

export class AITestingHelper {
  private static instance: AITestingHelper;
  
  static getInstance(): AITestingHelper {
    if (!AITestingHelper.instance) {
      AITestingHelper.instance = new AITestingHelper();
    }
    return AITestingHelper.instance;
  }

  // Simulate user interactions for AI testing
  async simulateUserJourney(scenario: 'new_user' | 'returning_user' | 'premium_user'): Promise<void> {
    const appContext = (window as any).appContext;
    if (!appContext) return;

    switch (scenario) {
      case 'new_user':
        await appContext.resetProgress();
        break;
      
      case 'returning_user':
        await appContext.resetProgress();
        await appContext.simulateUsage(10);
        await appContext.addRolePlaySession(75);
        await appContext.updateProgress('closing-fundamentals');
        break;
      
      case 'premium_user':
        await appContext.resetProgress();
        await appContext.simulateUsage(25);
        await appContext.addRolePlaySession(85);
        await appContext.addRolePlaySession(90);
        await appContext.updateProgress('closing-fundamentals');
        await appContext.updateProgress('nepq-methodology');
        break;
    }
  }

  // Generate test data for various scenarios
  generateTestData(type: 'minimal' | 'moderate' | 'extensive'): any {
    const baseData = {
      id: 'test-id',
      ip: 'test-ip',
      completedModules: [],
      rolePlaySessions: 0,
      averageScore: 0,
      learningStreak: 0,
      lastActive: new Date(),
      premiumFeatures: {},
      aiCoachPreferences: {},
      donationImpact: 0,
      trial_started_at: new Date(),
      trial_completed: false,
      subscription_status: 'trial',
      usage_minutes: 0
    };

    switch (type) {
      case 'minimal':
        return {
          ...baseData,
          usage_minutes: 5,
          rolePlaySessions: 1,
          averageScore: 70
        };
      
      case 'moderate':
        return {
          ...baseData,
          usage_minutes: 15,
          rolePlaySessions: 3,
          averageScore: 80,
          completedModules: ['closing-fundamentals'],
          learningStreak: 2
        };
      
      case 'extensive':
        return {
          ...baseData,
          usage_minutes: 25,
          rolePlaySessions: 8,
          averageScore: 88,
          completedModules: ['closing-fundamentals', 'nepq-methodology', 'objection-handling'],
          learningStreak: 5,
          subscription_status: 'active'
        };
      
      default:
        return baseData;
    }
  }

  // Validate app state for testing
  validateAppState(expectedState: Partial<any>): boolean {
    const appContext = (window as any).appContext;
    if (!appContext) return false;

    const currentState = appContext.userProgress;
    
    for (const [key, expectedValue] of Object.entries(expectedState)) {
      if (currentState[key] !== expectedValue) {
        console.warn(`State validation failed for ${key}: expected ${expectedValue}, got ${currentState[key]}`);
        return false;
      }
    }
    
    return true;
  }

  // Test subscription flow
  async testSubscriptionFlow(): Promise<boolean> {
    try {
      const appContext = (window as any).appContext;
      if (!appContext) return false;

      // Simulate usage limit reached
      appContext.simulateUsage(25);
      
      // Check if subscription prompt appears
      const shouldShow = appContext.shouldShowSubscriptionPrompt();
      
      return shouldShow;
    } catch (error) {
      console.error('Subscription flow test failed:', error);
      return false;
    }
  }

  // Test training progression
  async testTrainingProgression(): Promise<boolean> {
    try {
      const appContext = (window as any).appContext;
      if (!appContext) return false;

      await appContext.resetProgress();
      
      // Complete modules in sequence
      const modules = ['closing-fundamentals', 'nepq-methodology', 'objection-handling', 'advanced-closing'];
      
      for (const module of modules) {
        await appContext.updateProgress(module);
      }
      
      // Validate all modules completed
      return appContext.userProgress.completedModules.length === modules.length;
    } catch (error) {
      console.error('Training progression test failed:', error);
      return false;
    }
  }

  // Export current state for AI analysis
  exportStateForAI(): any {
    const appContext = (window as any).appContext;
    if (!appContext) return null;

    return {
      userProgress: appContext.userProgress,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// Make testing helper available globally for AI testing
(window as any).AITestingHelper = AITestingHelper;

// Expose app context globally for testing
export const exposeAppContextForTesting = (context: any) => {
  if (process.env.NODE_ENV === 'development' || window.location.search.includes('test=true')) {
    (window as any).appContext = context;
  }
};