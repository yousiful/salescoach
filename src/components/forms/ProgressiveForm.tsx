import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  optional?: boolean;
}

interface ProgressiveFormProps {
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  isValid: (stepIndex: number) => boolean;
  children: React.ReactNode;
  showProgress?: boolean;
}

const ProgressiveForm: React.FC<ProgressiveFormProps> = ({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  isValid,
  children,
  showProgress = true
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Mark step as completed if it's valid
    if (isValid(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    } else {
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentStep);
        return newSet;
      });
    }
  }, [currentStep, isValid]);

  const canProceed = () => {
    return isValid(currentStep) || steps[currentStep]?.optional;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      onStepChange(currentStep + 1);
    } else if (currentStep === steps.length - 1 && canProceed()) {
      onSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow jumping to any previous step or next step if current is valid
    if (stepIndex <= currentStep || (stepIndex === currentStep + 1 && canProceed())) {
      onStepChange(stepIndex);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {showProgress && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <span className="text-sm text-slate-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep + 1 || (index === currentStep + 1 && !canProceed())}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    completedSteps.has(index)
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white'
                      : index < currentStep
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {completedSteps.has(index) ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full ${
                    completedSteps.has(index) ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Current Step Info */}
          <div className="text-center">
            <h3 className="font-medium text-slate-900">{steps[currentStep]?.title}</h3>
            {steps[currentStep]?.description && (
              <p className="text-sm text-slate-600 mt-1">{steps[currentStep].description}</p>
            )}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
            currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {steps[currentStep]?.optional && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Skip
            </button>
          )}
          
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {currentStep === steps.length - 1 ? 'Generate Script' : 'Next'}
            </span>
            {currentStep < steps.length - 1 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveForm;