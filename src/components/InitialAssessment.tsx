import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Brain, Target, Users, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const assessmentQuestions = [
  {
    question: "A prospect says 'Your price is too high.' What's your best response?",
    options: [
      "I can offer you a discount",
      "What makes you feel the price is too high?",
      "Our competitors are more expensive",
      "Let me show you our features"
    ],
    correct: 1,
    explanation: "NEPQ methodology focuses on understanding the prospect's perspective rather than immediately defending or discounting."
  },
  {
    question: "When is the best time to discuss pricing?",
    options: [
      "At the very beginning",
      "Whenever the prospect asks",
      "After establishing value and pain points",
      "At the end of the presentation"
    ],
    correct: 2,
    explanation: "Price should be discussed after establishing value and understanding the prospect's needs and pain points."
  },
  {
    question: "What's the primary goal of discovery questions?",
    options: [
      "To qualify the prospect quickly",
      "To demonstrate product knowledge",
      "To uncover emotional drivers and pain points",
      "To set up the presentation"
    ],
    correct: 2,
    explanation: "Discovery questions should focus on understanding the prospect's emotional drivers and pain points."
  },
  {
    question: "How should you handle a prospect who says 'I need to think about it'?",
    options: [
      "Give them a deadline to decide",
      "Offer a special discount",
      "Ask what specific aspects they need to consider",
      "Tell them to call when ready"
    ],
    correct: 2,
    explanation: "Understanding their specific concerns helps address the real reasons behind their hesitation."
  },
  {
    question: "What's the most effective way to build rapport?",
    options: [
      "Share personal stories",
      "Ask meaningful questions and listen actively",
      "Give a thorough product demo",
      "Highlight company achievements"
    ],
    correct: 1,
    explanation: "Active listening and meaningful questions create genuine connections and trust."
  }
];

const InitialAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { addRolePlaySession, updateProgress, startTrial } = useAppContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === assessmentQuestions[index].correct) {
        correct++;
      }
    });
    
    const score = Math.round((correct / assessmentQuestions.length) * 100);
    await addRolePlaySession(score);
    setShowResults(true);
    
    if (score >= 70) {
      toast.success('Great job! You show strong sales fundamentals.');
    } else {
      toast.success('Thanks for completing the assessment. We\'ll help you improve!');
    }
  };

  const getSkillLevel = (score: number) => {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Intermediate';
    if (score >= 60) return 'Basic';
    return 'Beginner';
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === assessmentQuestions[index].correct) correct++;
    });
    return Math.round((correct / assessmentQuestions.length) * 100);
  };

  const handleStartTraining = async () => {
    // Start with the first module
    const firstModuleId = 'closing-fundamentals';
    await updateProgress(firstModuleId);
    await startTrial();
    
    // Show success message
    toast.success('Starting with Closing Fundamentals');
    
    // Navigate to training hub with the first module active
    navigate('/training');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Skills Assessment</h1>
        <p className="text-lg text-slate-600">
          Let's evaluate your current sales skills to personalize your learning journey.
        </p>
      </div>

      {!showResults ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-slate-500">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}% Complete
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium text-slate-900 mb-4">
                {assessmentQuestions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      showExplanation
                        ? index === assessmentQuestions[currentQuestion].correct
                          ? 'bg-green-50 border-green-200 text-green-900'
                          : answers[currentQuestion] === index
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                        : answers[currentQuestion] === index
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <div className="mb-6">
                <div className={`p-4 rounded-lg ${
                  answers[currentQuestion] === assessmentQuestions[currentQuestion].correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-start">
                    {answers[currentQuestion] === assessmentQuestions[currentQuestion].correct ? (
                      <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-2" />
                    ) : (
                      <AlertTriangle className="text-amber-500 w-5 h-5 mt-0.5 mr-2" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        answers[currentQuestion] === assessmentQuestions[currentQuestion].correct
                          ? 'text-green-800'
                          : 'text-amber-800'
                      }`}>
                        {answers[currentQuestion] === assessmentQuestions[currentQuestion].correct
                          ? 'Correct!'
                          : 'Not quite right'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        answers[currentQuestion] === assessmentQuestions[currentQuestion].correct
                          ? 'text-green-700'
                          : 'text-amber-700'
                      }`}>
                        {assessmentQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                showExplanation
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion < assessmentQuestions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
              <p className="text-slate-600">
                Based on your responses, here's an analysis of your sales skills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">Score</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{calculateScore()}%</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">Skill Level</span>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{getSkillLevel(calculateScore())}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">Areas to Focus</span>
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-lg font-medium text-slate-900">
                  {calculateScore() < 70 ? 'Core Fundamentals' : 'Advanced Techniques'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStartTraining}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Start with Closing Fundamentals
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers([]);
                }}
                className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialAssessment;