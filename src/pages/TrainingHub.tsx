import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useGame } from '../contexts/GameContext';
import { CheckCircle, Lock, Play, BookOpen, Award, Star, BarChart2, AlertTriangle, X, Brain, Shield, Clock, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import InitialAssessment from '../components/InitialAssessment';
import GameStatsWidget from '../components/gamification/GameStatsWidget';

const TrainingHub: React.FC = () => {
  const { userProgress, updateProgress } = useAppContext();
  const { addPoints, checkAchievements, earnBadge } = useGame();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    const hasNoCompletedModules = !userProgress?.completedModules?.length;
    setShowAssessment(hasNoCompletedModules);
  }, [userProgress?.completedModules]);

  const trainingModules = [
    {
      id: 'closing-fundamentals',
      title: 'Closing Fundamentals',
      description: 'Learn the core principles of effective closing techniques',
      duration: '25 min',
      level: 'Beginner',
      points: 200,
      icon: <BookOpen size={20} />,
      lessons: [
        'Understanding the psychology of closing',
        'The importance of timing in sales',
        'Building value before closing',
        'Reading buying signals'
      ],
      quiz: [
        {
          question: 'What is the most important factor in timing a close?',
          options: [
            'When you feel like closing',
            'After identifying buying signals',
            'At the end of your presentation',
            'When the customer stops talking'
          ],
          correct: 1
        },
        {
          question: 'Which is NOT a valid buying signal?',
          options: [
            'Asking detailed questions',
            'Discussing implementation',
            'Checking their phone frequently',
            'Requesting pricing information'
          ],
          correct: 2
        }
      ]
    },
    {
      id: 'nepq-methodology',
      title: 'NEPQ Methodology',
      description: "Master Jeremy Miner's Neuro-Emotional Persuasion Questions",
      duration: '45 min',
      level: 'Intermediate',
      points: 300,
      icon: <Brain size={20} />,
      lessons: [
        'Introduction to NEPQ',
        'Creating emotional connections',
        'The 4 types of NEPQ questions',
        'Building your NEPQ framework',
        'Case studies and examples'
      ],
      quiz: [
        {
          question: 'What is the primary goal of NEPQ?',
          options: [
            'To manipulate customers',
            'To create emotional awareness of problems',
            'To close deals quickly',
            'To present product features'
          ],
          correct: 1
        }
      ]
    },
    {
      id: 'objection-handling',
      title: 'Objection Handling Mastery',
      description: 'Learn to overcome common and difficult sales objections',
      duration: '35 min',
      level: 'Advanced',
      points: 350,
      icon: <Shield size={20} />,
      lessons: [
        'Anticipating objections',
        'The objection handling framework',
        'Price objections: turning cost into value',
        'Timing objections: creating urgency',
        'Authority objections: reaching decision makers'
      ],
      quiz: [
        {
          question: 'What should you do first when handling an objection?',
          options: [
            'Immediately counter it',
            'Listen and acknowledge',
            'Offer a discount',
            'Change the subject'
          ],
          correct: 1
        }
      ]
    },
    {
      id: 'advanced-closing',
      title: 'Advanced Closing Techniques',
      description: 'Take your closing skills to the next level',
      duration: '40 min',
      level: 'Advanced',
      points: 400,
      icon: <Award size={20} />,
      lessons: [
        'Non-manipulative closing strategies',
        'The reverse psychology close',
        'The summary close technique',
        'Trial closes throughout the sales process',
        'Closing in different sales environments'
      ],
      quiz: [
        {
          question: 'When is the best time to use a trial close?',
          options: [
            'Only at the end of the presentation',
            'Throughout the sales conversation',
            'When the customer is ready to buy',
            'After handling objections'
          ],
          correct: 1
        }
      ]
    }
  ];

  const isModuleCompleted = (moduleId: string) => {
    return userProgress?.completedModules?.includes(moduleId) || false;
  };

  const isModuleLocked = (index: number) => {
    if (index === 0) return false;
    return !isModuleCompleted(trainingModules[index - 1].id);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers({});
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex.toString()
    }));
  };

  const calculateQuizScore = (moduleId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    if (!module || !module.quiz) return 0;

    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (parseInt(quizAnswers[i]) === q.correct) correct++;
    });

    return Math.round((correct / module.quiz.length) * 100);
  };

  const handleCompleteModule = async (moduleId: string) => {
    const score = calculateQuizScore(moduleId);
    const module = trainingModules.find(m => m.id === moduleId);
    
    if (score >= 80) {
      await updateProgress(moduleId);
      
      // Add points for completing module
      if (module) {
        addPoints(module.points, `completing "${module.title}"`);
      }
      
      // Check for perfect score badge
      if (score === 100) {
        earnBadge('perfectionist');
      }
      
      // Check for speed completion badge (simulated)
      const completionTime = Math.random() * 30; // Simulate completion time
      if (completionTime < 15) {
        earnBadge('speed_demon');
      }
      
      // Check achievements
      checkAchievements();
      
      toast.success(`🎉 Module completed! You scored ${score}% and earned ${module?.points || 0} points!`);
      setActiveModule(null);
      setShowQuiz(false);
    } else {
      toast.error('You need to score at least 80% to complete this module');
    }
  };

  if (showAssessment) {
    return <InitialAssessment />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Training Hub</h1>
        <p className="text-lg text-slate-600">
          Master sales techniques and objection handling with our comprehensive training modules.
        </p>
        
        {/* Progress Overview */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed Modules</p>
                <p className="text-2xl font-bold text-slate-900">
                  {userProgress?.completedModules?.length || 0} / {trainingModules.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Star size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {userProgress?.averageScore || 0}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart2 size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Learning Streak</p>
                <p className="text-2xl font-bold text-slate-900">
                  {userProgress?.learningStreak || 0} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Training Modules */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingModules.map((module, index) => (
              <div 
                key={module.id}
                className={`bg-white rounded-lg shadow-sm border ${
                  isModuleCompleted(module.id) 
                    ? 'border-green-200 bg-green-50' 
                    : isModuleLocked(index) 
                      ? 'border-slate-200 opacity-75' 
                      : 'border-blue-200 hover:border-blue-300'
                } overflow-hidden transition-all`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      {module.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      {isModuleCompleted(module.id) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Completed
                        </span>
                      ) : isModuleLocked(index) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          <Lock size={12} className="mr-1" />
                          Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{module.title}</h3>
                  <p className="text-slate-600 mb-3">{module.description}</p>
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <span className="flex items-center mr-4">
                      <Clock size={14} className="mr-1" />
                      {module.duration}
                    </span>
                    <span className="flex items-center mr-4">
                      <GraduationCap size={14} className="mr-1" />
                      {module.level}
                    </span>
                    <span className="flex items-center">
                      <Star size={14} className="mr-1 text-yellow-500" />
                      {module.points} pts
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setActiveModule(module.id)}
                    disabled={isModuleLocked(index)}
                    className={`w-full py-2 px-4 rounded-md flex items-center justify-center font-medium ${
                      isModuleCompleted(module.id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isModuleLocked(index)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } transition-colors`}
                  >
                    {isModuleCompleted(module.id) ? (
                      <>Review Module</>
                    ) : isModuleLocked(index) ? (
                      <>Complete Previous Module</>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Start Module
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Stats Sidebar */}
        <div className="lg:col-span-1">
          <GameStatsWidget />
        </div>
      </div>

      {/* Module Content Modal */}
      {activeModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {trainingModules.find(m => m.id === activeModule)?.title}
                </h2>
                <button 
                  onClick={() => {
                    setActiveModule(null);
                    setShowQuiz(false);
                  }}
                  className="text-slate-400 hover:text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              {!showQuiz ? (
                <>
                  <div className="mb-6">
                    <p className="text-slate-600 mb-4">
                      {trainingModules.find(m => m.id === activeModule)?.description}
                    </p>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="font-medium text-slate-900 mb-2">Module Lessons:</h3>
                      <ul className="space-y-2">
                        {trainingModules.find(m => m.id === activeModule)?.lessons.map((lesson, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Interactive Content</h3>
                    <ul className="text-blue-700 space-y-2">
                      <li className="flex items-center">
                        <Play size={16} className="mr-2" />
                        Video demonstrations with expert analysis
                      </li>
                      <li className="flex items-center">
                        <BookOpen size={16} className="mr-2" />
                        Real-world case studies and examples
                      </li>
                      <li className="flex items-center">
                        <AlertTriangle size={16} className="mr-2" />
                        Common pitfalls and how to avoid them
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleStartQuiz}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Take Module Quiz
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle size={20} className="text-yellow-600 mr-2 flex-shrink-0 mt-1" />
                      <p className="text-yellow-800">
                        You need to score at least 80% to complete this module. Take your time and choose your answers carefully.
                      </p>
                    </div>
                  </div>
                  
                  {trainingModules
                    .find(m => m.id === activeModule)
                    ?.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="bg-slate-50 p-4 rounded-lg">
                        <p className="font-medium text-slate-900 mb-3">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <button
                              key={oIndex}
                              onClick={() => handleAnswerSelect(qIndex, oIndex)}
                              className={`w-full text-left p-3 rounded-md transition-colors ${
                                quizAnswers[qIndex] === oIndex.toString()
                                  ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  
                  <button
                    onClick={() => handleCompleteModule(activeModule)}
                    disabled={Object.keys(quizAnswers).length < (trainingModules.find(m => m.id === activeModule)?.quiz.length || 0)}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                      Object.keys(quizAnswers).length < (trainingModules.find(m => m.id === activeModule)?.quiz.length || 0)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingHub;