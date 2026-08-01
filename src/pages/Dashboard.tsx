import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BarChart2, TrendingUp, Award, Calendar, Clock, BookOpen, Users, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userProgress } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data
  const mockPerformanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Role-Play Score',
        data: [68, 72, 78, userProgress?.averageScore || 85],
      },
    ],
  };
  
  const mockObjectionData = {
    price: { success: 65, improvement: 5 },
    timing: { success: 78, improvement: 12 },
    competition: { success: 82, improvement: 8 },
    authority: { success: 70, improvement: -2 },
  };
  
  const mockModulesCompleted = userProgress?.completedModules?.length || 0;
  const totalModules = 4; // Total available modules
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Performance Dashboard</h1>
        <p className="text-lg text-slate-600">
          Track your progress and identify areas for improvement in your sales approach.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Average Score</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {userProgress?.averageScore || 85}%
              </h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +7% from last week
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Award size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Training Progress</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {Math.round((mockModulesCompleted / totalModules) * 100)}%
              </h3>
              <p className="text-sm text-slate-600 flex items-center mt-1">
                <BookOpen size={14} className="mr-1" />
                {mockModulesCompleted} of {totalModules} modules completed
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <BookOpen size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Role-Play Sessions</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {userProgress?.rolePlaySessions || 5}
              </h3>
              <p className="text-sm text-slate-600 flex items-center mt-1">
                <Calendar size={14} className="mr-1" />
                Last session: Today
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm flex-1 text-center ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('objections')}
              className={`px-4 py-3 font-medium text-sm flex-1 text-center ${
                activeTab === 'objections'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Objection Handling
            </button>
            <button
              onClick={() => setActiveTab('scripts')}
              className={`px-4 py-3 font-medium text-sm flex-1 text-center ${
                activeTab === 'scripts'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scripts Analytics
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Performance Over Time</h3>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                  <div className="mb-6">
                    <div className="h-64 flex items-center justify-center">
                      {/* Placeholder for chart - in real app this would be a Chart.js component */}
                      <div className="w-full">
                        <div className="flex justify-between mb-2">
                          {mockPerformanceData.labels.map((label, i) => (
                            <div key={i} className="text-xs text-slate-500">{label}</div>
                          ))}
                        </div>
                        <div className="relative h-40 bg-slate-100 rounded-lg overflow-hidden">
                          {mockPerformanceData.datasets[0].data.map((value, i) => (
                            <div 
                              key={i}
                              className="absolute bottom-0 w-1/4 bg-blue-500"
                              style={{ 
                                height: `${value}%`,
                                left: `${i * 25}%`,
                                width: '15%',
                                marginLeft: '5%',
                                borderTopLeftRadius: '4px',
                                borderTopRightRadius: '4px'
                              }}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-700">
                                {value}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Strengths</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <Check size={12} className="text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">Building rapport with prospects</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <Check size={12} className="text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">Using effective NEPQ questions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <Check size={12} className="text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">Articulating value propositions</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Areas for Improvement</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                          <AlertTriangle size={12} className="text-amber-600" />
                        </div>
                        <span className="text-sm text-slate-600">Handling price objections</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                          <AlertTriangle size={12} className="text-amber-600" />
                        </div>
                        <span className="text-sm text-slate-600">Creating urgency without pressure</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                          <AlertTriangle size={12} className="text-amber-600" />
                        </div>
                        <span className="text-sm text-slate-600">Addressing competitive comparisons</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'objections' && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Objection Handling Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(mockObjectionData).map(([objection, data]) => (
                    <div key={objection} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800 capitalize">{objection} Objections</h4>
                        <span className={`text-sm font-medium ${
                          data.improvement > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.improvement > 0 ? '+' : ''}{data.improvement}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${data.success}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Success Rate</span>
                        <span className="text-xs font-medium text-slate-700">{data.success}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Recommended Training</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Based on your performance, we recommend focusing on these areas:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white flex items-center justify-center mr-2">
                        <Target size={12} className="text-blue-600" />
                      </div>
                      <span className="text-sm text-blue-700">Complete the "Advanced Closing Techniques" module</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white flex items-center justify-center mr-2">
                        <Target size={12} className="text-blue-600" />
                      </div>
                      <span className="text-sm text-blue-700">Practice handling price objections in the Role-Play simulator</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'scripts' && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Script Generator Analytics</h3>
                
                <div className="mb-6 text-center bg-slate-50 p-8 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500 mb-2">Scripts Generated</p>
                  <div className="text-4xl font-bold text-slate-900 mb-1">7</div>
                  <p className="text-xs text-green-600">+3 in the last week</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-1">Most Used Industry</p>
                    <p className="font-medium text-slate-900">Software/SaaS</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-1">Most Common Pain Point</p>
                    <p className="font-medium text-slate-900">Time Management</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-1">Avg. Benefit Count</p>
                    <p className="font-medium text-slate-900">4.3</p>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <h4 className="font-medium text-slate-900">Recent Scripts</h4>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="px-4 py-3 hover:bg-slate-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-900">
                              {item === 1 ? 'CRM Software Script' : item === 2 ? 'Financial Advisory Script' : 'Project Management Tool Script'}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item === 1 ? 'Software/SaaS' : item === 2 ? 'Financial Services' : 'Software/SaaS'}
                            </p>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {item === 1 ? '2 hours ago' : item === 2 ? '1 day ago' : '3 days ago'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// These icons weren't imported at the top, so defining them here
const Check = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AlertTriangle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

const Brain = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2h.01"></path>
    <path d="M14.5 2h.01"></path>
    <path d="M9.5 22h.01"></path>
    <path d="M14.5 22h.01"></path>
    <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0Z"></path>
    <path d="M10 8.5v3"></path>
    <path d="M13 11.5h2.5"></path>
    <path d="M13 8.5h-1.5"></path>
  </svg>
);

const Shield = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
  </svg>
);

export default Dashboard;