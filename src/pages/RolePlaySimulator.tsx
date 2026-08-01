import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useGame } from '../contexts/GameContext';
import { UserCircle, Bot, Send, Mic, MicOff, Settings, BarChart, RefreshCw, X, AlertTriangle, CheckCircle, Play, Star } from 'lucide-react';
import GameStatsWidget from '../components/gamification/GameStatsWidget';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
};

type Feedback = {
  strengths: string[];
  areas: string[];
  score: number;
  recommendation: string;
};

const RolePlaySimulator: React.FC = () => {
  const { addRolePlaySession } = useAppContext();
  const { addPoints, checkAchievements, earnBadge } = useGame();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [scenario, setScenario] = useState('software');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenarios = {
    software: "Hey... yeah, I filled out some form online recently. Been pretty swamped with work lately, so I honestly don't remember exactly what it was about. What's this regarding?",
    insurance: "Hi, um, I think I put my info in somewhere about business solutions? Been looking at a few things lately. What exactly do you guys do?",
    realEstate: "Hello? Oh right, I did submit something online. Been checking out a few options lately. Can you remind me what this is about?",
    financialServices: "Yeah, this is John. I vaguely remember filling something out, but I get a lot of these calls. What were you offering again?"
  };

  useEffect(() => {
    const initialMessage = getInitialMessage();
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: initialMessage,
        timestamp: new Date(),
      },
    ]);
  }, [scenario]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitialMessage = () => {
    return scenarios[scenario as keyof typeof scenarios] || scenarios.software;
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(input, difficultyLevel, messages);
      
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newAIMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setTimeout(() => {
        setInput(getSimulatedSpeechInput());
        setIsRecording(false);
      }, 3000);
    }
  };

  const getSimulatedSpeechInput = () => {
    const sampleResponses = [
      "Could you remind me what specific features caught your attention in the ad?",
      "I understand you might not remember all the details. What challenges are you currently facing in your sales process?",
      "Let me help refresh your memory. What aspects of your current workflow would you most like to improve?"
    ];
    
    return sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
  };

  const handleEndRolePlay = async () => {
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    const newFeedback: Feedback = {
      strengths: [
        "Good discovery questions to understand prospect's needs",
        "Patient approach with a forgetful prospect",
        "Effective need exploration"
      ],
      areas: [
        "Could improve value proposition clarity",
        "Need more focus on pain point identification",
        "More emphasis needed on connecting with initial ad interest"
      ],
      score,
      recommendation: "Focus on quickly establishing relevance while helping the prospect recall their initial interest. Use their current challenges to bridge the gap."
    };
    
    setFeedback(newFeedback);
    setShowFeedback(true);
    
    // Add role-play session to app context
    await addRolePlaySession(score);
    
    // Calculate points based on score
    let points = 50; // Base points
    if (score >= 90) points = 150;
    else if (score >= 80) points = 100;
    else if (score >= 70) points = 75;
    
    // Add points for completing role-play
    addPoints(points, `role-play session (${score}% score)`);
    
    // Check for badges
    if (score === 100) {
      earnBadge('perfectionist');
    }
    
    // Check for time-based badges
    const hour = new Date().getHours();
    if (hour < 9) earnBadge('early_bird');
    if (hour >= 22) earnBadge('night_owl');
    
    // Check achievements
    checkAchievements();
  };

  const resetRolePlay = () => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: getInitialMessage(),
        timestamp: new Date(),
      },
    ]);
    setShowFeedback(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Sales Role-Play</h1>
        <p className="text-lg text-slate-600">
          Practice handling leads who responded to your ads but need their memory refreshed about your offering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Role-Play Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center">
                <Bot size={20} className="text-blue-600 mr-2" />
                <span className="font-medium text-slate-900">Ad Response Lead</span>
                {difficultyLevel === 'easy' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Basic
                  </span>
                )}
                {difficultyLevel === 'medium' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Standard
                  </span>
                )}
                {difficultyLevel === 'hard' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Complex
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={handleEndRolePlay}
                  className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
                  title="View Performance"
                >
                  <BarChart size={18} />
                </button>
                <button
                  onClick={resetRolePlay}
                  className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
                  title="Reset Conversation"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scenario" className="block text-sm font-medium text-slate-700 mb-1">
                      Lead Type
                    </label>
                    <select
                      id="scenario"
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                      className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="software">Software Lead</option>
                      <option value="insurance">Insurance Lead</option>
                      <option value="realEstate">Real Estate Lead</option>
                      <option value="financialServices">Financial Services Lead</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-1">
                      Lead Temperature
                    </label>
                    <select
                      id="difficulty"
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(e.target.value)}
                      className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="easy">Warm - Clearly Interested</option>
                      <option value="medium">Neutral - Needs Convincing</option>
                      <option value="hard">Cold - Highly Skeptical</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {showFeedback && feedback ? (
              <div className="h-[500px] overflow-y-auto p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Role-Play Performance</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-500 text-blue-700 font-bold text-xl">
                        {feedback.score}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-slate-600">
                          +{feedback.score >= 90 ? 150 : feedback.score >= 80 ? 100 : feedback.score >= 70 ? 75 : 50} points
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-900 mb-2">Strengths:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-slate-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-900 mb-2">Areas for Improvement:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.areas.map((area, index) => (
                        <li key={index} className="text-slate-700">{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Coach's Recommendation:</h4>
                    <p className="text-slate-700">{feedback.recommendation}</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={resetRolePlay}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Start New Role-Play
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[500px] overflow-y-auto p-4" id="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 max-w-[80%] ${
                      message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div
                      className={`flex items-start ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        } mr-2`}
                      >
                        {message.sender === 'user' ? <UserCircle size={20} /> : <Bot size={20} />}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                    <div
                      className={`text-xs text-slate-500 mt-1 ${
                        message.sender === 'user' ? 'text-right mr-10' : 'ml-10'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 mr-2">
                      <Bot size={20} />
                    </div>
                    <div className="p-3 rounded-lg bg-slate-100 text-slate-800 rounded-tl-none">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center">
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-full ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                  } hover:bg-opacity-80 mr-2`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your response..."
                  className="flex-grow px-4 py-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || showFeedback}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || input.trim() === '' || showFeedback}
                  className={`px-4 py-2 rounded-r-md ${
                    isLoading || input.trim() === '' || showFeedback
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Stats Sidebar */}
        <div className="lg:col-span-1">
          <GameStatsWidget />
        </div>
      </div>
    </div>
  );
};

const generateAIResponse = (userInput: string, difficulty: string, conversationHistory: Message[]): string => {
  const input = userInput.toLowerCase();
  
  // Initial engagement responses
  if (conversationHistory.length <= 2) {
    if (difficulty === 'easy') {
      return "Well, I've been meaning to look into some solutions. Our current process is pretty messy. What exactly do you guys help with?";
    } else if (difficulty === 'medium') {
      return "To be honest, I get a lot of these calls. Not sure if this is what I need right now, but I'm listening.";
    } else {
      return "Look, I'm pretty busy and I don't really remember signing up for anything. Make it quick - what makes you different?";
    }
  }
  
  // Pain point exploration
  if (input.includes('challenge') || input.includes('difficult') || input.includes('problem') || input.includes('issue')) {
    if (difficulty === 'easy') {
      return "Yeah, you know what? We've been struggling with efficiency lately. Our team keeps missing follow-ups, and it's probably costing us deals. How do you help with that?";
    } else if (difficulty === 'medium') {
      return "Well... we do have some bottlenecks in our process. But I'm not convinced any solution out there can really fix it. What's your take on that?";
    } else {
      return "Everyone claims they can solve our problems. But implementation is always a nightmare, and the ROI is never what's promised. Why would this be any different?";
    }
  }
  
  // Value proposition responses
  if (input.includes('help') || input.includes('solution') || input.includes('improve') || input.includes('benefit')) {
    if (difficulty === 'easy') {
      return "That's interesting... our team was just talking about something like this last week. How long does it usually take to get everything set up?";
    } else if (difficulty === 'medium') {
      return "Hmm... sounds similar to what we're using now. What makes your approach different? I need to see real value to consider making a change.";
    } else {
      return "Look, I've heard all the promises before. We need something that actually delivers results, not just fancy features. Can you be specific about the impact?";
    }
  }
  
  // Price discussion
  if (input.includes('price') || input.includes('cost') || input.includes('investment') || input.includes('budget')) {
    if (difficulty === 'easy') {
      return "Yeah, if it can really save us that much time, price isn't my biggest concern. But what's the ballpark we're talking about?";
    } else if (difficulty === 'medium') {
      return "Before we talk numbers, I need to be convinced this is worth my time. We're not in a position to waste money on something that might not work.";
    } else {
      return "Every solution claims ROI justifies the cost. But I need hard numbers. What's your pricing, and what exactly do we get for that?";
    }
  }
  
  // Time/urgency responses
  if (input.includes('when') || input.includes('schedule') || input.includes('timeline') || input.includes('soon')) {
    if (difficulty === 'easy') {
      return "We should probably make a decision in the next few weeks. Our current contract is up for renewal soon. What's your implementation timeline like?";
    } else if (difficulty === 'medium') {
      return "I'd need to discuss this with my team first. We've got a lot going on right now. Maybe we can circle back in a few weeks?";
    } else {
      return "Not looking to make any immediate changes. If your solution is really that good, it'll still be worth considering next quarter.";
    }
  }
  
  // Default responses showing interest but requiring more convincing
  const defaultResponses = [
    "Interesting... can you be more specific about how that would work in our case?",
    "I see. And how does that compare to other solutions out there?",
    "That sounds good in theory, but I need to understand the practical application.",
    "We've tried similar things before. What makes your approach different?",
    "I'm following you, but I need more concrete examples."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export default RolePlaySimulator;