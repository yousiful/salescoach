import React, { useState, useEffect } from 'react';
import { Check, Clipboard, Download, RefreshCw, Lightbulb, Target, Users, Zap } from 'lucide-react';
import SmartFormField from '../components/forms/SmartFormField';
import ProgressiveForm from '../components/forms/ProgressiveForm';

const ScriptGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info (Required)
    industry: '',
    productName: '',
    targetAudience: '',
    
    // Step 2: Pain Points & Benefits (Required)
    painPoints: [] as string[],
    keyBenefits: [] as string[],
    
    // Step 3: Advanced Settings (Optional)
    methodology: 'spin',
    callToAction: '',
    objectionsToAddress: [] as string[],
    tone: 'professional',
    scriptLength: 'medium'
  });
  
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Smart defaults and suggestions
  const industryOptions = [
    { value: 'software', label: 'Software/SaaS' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'retail', label: 'Retail/E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'telecommunications', label: 'Telecommunications' }
  ];

  const methodologyOptions = [
    { value: 'spin', label: 'SPIN Selling', description: 'Situation, Problem, Implication, Need-payoff questions' },
    { value: 'challenger', label: 'Challenger Sale', description: 'Teaching, tailoring, and taking control' },
    { value: 'sandler', label: 'Sandler System', description: 'Pain-focused qualification methodology' },
    { value: 'cardone', label: 'Grant Cardone 10X', description: 'High-energy, persistence-based approach' },
    { value: 'baseline', label: 'Baseline Selling', description: 'Trust-based relationship selling' },
    { value: 'conceptual', label: 'Conceptual Selling', description: 'Concept-driven sales approach' }
  ];

  const commonPainPoints = [
    'Wasting time on manual processes',
    'Poor lead management',
    'Lack of visibility into sales pipeline',
    'Inefficient team communication',
    'High customer acquisition costs',
    'Low conversion rates',
    'Difficulty tracking ROI',
    'Compliance and security concerns',
    'Scalability challenges',
    'Integration problems with existing tools'
  ];

  const commonBenefits = [
    'Increase sales by 30%',
    'Save 10+ hours per week',
    'Improve team productivity',
    'Better customer insights',
    'Automated reporting and analytics',
    'Seamless integrations',
    'Enhanced security and compliance',
    'Scalable solution that grows with you',
    'Dedicated customer support',
    '24/7 system availability'
  ];

  const commonObjections = [
    'Price is too high',
    'Need to think about it',
    'Already using another solution',
    'Not the right time',
    'Need to discuss with team',
    'Budget constraints',
    'Concerned about implementation time',
    'Worried about data security',
    'Unsure about ROI',
    'Happy with current process'
  ];

  const targetAudienceSuggestions = [
    'Small business owners',
    'Sales managers',
    'Marketing directors',
    'IT decision makers',
    'C-level executives',
    'Operations managers',
    'HR professionals',
    'Finance teams',
    'Customer service managers',
    'Project managers'
  ];

  const callToActionSuggestions = [
    'Schedule a 15-minute demo',
    'Start your free trial today',
    'Book a consultation call',
    'Download our free guide',
    'Get a custom quote',
    'Join our webinar',
    'Request a pilot program',
    'Speak with our specialist',
    'See it in action',
    'Get started now'
  ];

  // Form steps configuration
  const formSteps = [
    {
      id: 'basics',
      title: 'Basic Information',
      description: 'Tell us about your product and target market',
      fields: ['industry', 'productName', 'targetAudience']
    },
    {
      id: 'value',
      title: 'Value Proposition',
      description: 'Define the problems you solve and benefits you provide',
      fields: ['painPoints', 'keyBenefits']
    },
    {
      id: 'advanced',
      title: 'Script Customization',
      description: 'Fine-tune your script approach and style',
      fields: ['methodology', 'callToAction', 'objectionsToAddress', 'tone', 'scriptLength'],
      optional: true
    }
  ];

  // Validation functions
  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(formData.industry && formData.productName && formData.targetAudience);
      case 1:
        return formData.painPoints.length > 0 && formData.keyBenefits.length > 0;
      case 2:
        return true; // Optional step
      default:
        return false;
    }
  };

  // Smart defaults based on industry
  useEffect(() => {
    if (formData.industry && !formData.callToAction) {
      const defaultCTAs = {
        software: 'Schedule a 15-minute demo',
        financial: 'Book a consultation call',
        healthcare: 'Request a pilot program',
        realestate: 'Schedule a property viewing',
        retail: 'Start your free trial today',
        manufacturing: 'Get a custom quote',
        education: 'Join our webinar',
        consulting: 'Speak with our specialist',
        insurance: 'Get a personalized quote',
        telecommunications: 'See it in action'
      };
      
      const defaultCTA = defaultCTAs[formData.industry as keyof typeof defaultCTAs];
      if (defaultCTA) {
        setFormData(prev => ({ ...prev, callToAction: defaultCTA }));
      }
    }
  }, [formData.industry]);

  const handleFieldChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setGeneratedScript(generateScript(formData));
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedScript) {
      const blob = new Blob([generatedScript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.productName}-Sales-Script.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setFormData({
      industry: '',
      productName: '',
      targetAudience: '',
      painPoints: [],
      keyBenefits: [],
      methodology: 'spin',
      callToAction: '',
      objectionsToAddress: [],
      tone: 'professional',
      scriptLength: 'medium'
    });
    setGeneratedScript(null);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-blue-600 mb-4">
              <Target size={20} />
              <h3 className="font-medium">Let's start with the basics</h3>
            </div>
            
            <SmartFormField
              label="Industry"
              name="industry"
              type="select"
              value={formData.industry}
              onChange={handleFieldChange}
              options={industryOptions}
              placeholder="Select your industry"
              required
              helpText="Choose the industry that best describes your business"
            />
            
            <SmartFormField
              label="Product/Service Name"
              name="productName"
              value={formData.productName}
              onChange={handleFieldChange}
              placeholder="e.g., Sales CRM Pro, Financial Advisory Services"
              required
              helpText="What are you selling? Be specific but concise"
              maxLength={100}
              showCharCount
            />
            
            <SmartFormField
              label="Target Audience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleFieldChange}
              placeholder="e.g., Small business owners, Sales managers"
              required
              smartSuggestions={targetAudienceSuggestions}
              helpText="Who is your ideal customer? Be as specific as possible"
              maxLength={150}
              showCharCount
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <Zap size={20} />
              <h3 className="font-medium">Define your value proposition</h3>
            </div>
            
            <SmartFormField
              label="Pain Points You Solve"
              name="painPoints"
              type="multiselect"
              value={formData.painPoints}
              onChange={handleFieldChange}
              options={commonPainPoints.map(pain => ({ 
                value: pain, 
                label: pain,
                description: 'Common challenge faced by your target audience'
              }))}
              helpText="Select the main problems your product/service solves (choose 2-4 for best results)"
            />
            
            <SmartFormField
              label="Key Benefits You Provide"
              name="keyBenefits"
              type="multiselect"
              value={formData.keyBenefits}
              onChange={handleFieldChange}
              options={commonBenefits.map(benefit => ({ 
                value: benefit, 
                label: benefit,
                description: 'Specific outcome or advantage you deliver'
              }))}
              helpText="Select the main benefits customers get from your solution (choose 2-4 for best results)"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-purple-600 mb-4">
              <Lightbulb size={20} />
              <h3 className="font-medium">Customize your script approach</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmartFormField
                label="Sales Methodology"
                name="methodology"
                type="select"
                value={formData.methodology}
                onChange={handleFieldChange}
                options={methodologyOptions}
                helpText="Choose the sales approach that fits your style"
              />
              
              <SmartFormField
                label="Script Tone"
                name="tone"
                type="select"
                value={formData.tone}
                onChange={handleFieldChange}
                options={[
                  { value: 'professional', label: 'Professional' },
                  { value: 'friendly', label: 'Friendly & Casual' },
                  { value: 'authoritative', label: 'Authoritative' },
                  { value: 'consultative', label: 'Consultative' }
                ]}
                helpText="Set the overall tone for your script"
              />
            </div>
            
            <SmartFormField
              label="Call to Action"
              name="callToAction"
              value={formData.callToAction}
              onChange={handleFieldChange}
              placeholder="e.g., Schedule a demo, Start free trial"
              smartSuggestions={callToActionSuggestions}
              helpText="What specific action do you want prospects to take?"
              maxLength={100}
              showCharCount
            />
            
            <SmartFormField
              label="Common Objections to Address"
              name="objectionsToAddress"
              type="multiselect"
              value={formData.objectionsToAddress}
              onChange={handleFieldChange}
              options={commonObjections.map(objection => ({ 
                value: objection, 
                label: objection,
                description: 'Prepare responses for common pushback'
              }))}
              helpText="Select objections you frequently encounter (optional but recommended)"
            />
            
            <SmartFormField
              label="Script Length"
              name="scriptLength"
              type="select"
              value={formData.scriptLength}
              onChange={handleFieldChange}
              options={[
                { value: 'short', label: 'Short (2-3 minutes)' },
                { value: 'medium', label: 'Medium (5-7 minutes)' },
                { value: 'long', label: 'Long (10+ minutes)' }
              ]}
              helpText="Choose based on your typical call duration"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Sales Script Generator</h1>
        <p className="text-lg text-slate-600">
          Create powerful, personalized sales scripts in minutes using proven methodologies
        </p>
      </div>

      {!generatedScript ? (
        <ProgressiveForm
          steps={formSteps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onSubmit={handleSubmit}
          isValid={validateStep}
        >
          {renderStepContent()}
        </ProgressiveForm>
      ) : (
        <div className="space-y-6">
          {/* Generated Script Display */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Your Personalized Sales Script</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} /> : <Clipboard size={18} />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Download as text"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <RefreshCw size={32} className="animate-spin mb-4" />
                  <p>Generating your personalized sales script...</p>
                  <p className="text-sm mt-2">This may take a few moments</p>
                </div>
              ) : (
                <div className="whitespace-pre-line text-slate-800 font-medium leading-relaxed">
                  {generatedScript}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors"
            >
              Create New Script
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Modify Script
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced script generation with better structure
const generateScript = (data: any): string => {
  const painPoints = Array.isArray(data.painPoints) ? data.painPoints : [];
  const benefits = Array.isArray(data.keyBenefits) ? data.keyBenefits : [];
  const objections = Array.isArray(data.objectionsToAddress) ? data.objectionsToAddress : [];
  
  let scriptTemplate = '';
  
  switch (data.methodology) {
    case 'spin':
      scriptTemplate = `# SPIN Selling Script for ${data.productName}

## Opening & Rapport Building
"Hi [Prospect's Name], this is [Your Name] from [Company]. I understand you're the [Title] at [Company Name]. 

I've been working with other ${data.targetAudience} who've been facing some interesting challenges lately. Do you have a quick moment to chat?"

## Situation Questions
"Could you tell me about your current process for [relevant area]?"

"How long have you been using this approach?"

"Who else is involved in this process?"

## Problem Questions
${painPoints.map(pain => `"What challenges do you face with ${pain.toLowerCase()}?"`).join('\n\n')}

"How often does this type of issue come up?"

## Implication Questions
"If these challenges persist, what impact do you see on your [business goals/metrics] over the next 6-12 months?"

${painPoints.length > 0 ? `"How does ${painPoints[0].toLowerCase()} affect your team's productivity and results?"` : ''}

"What's the cost of not addressing this issue?"

## Need-Payoff Questions
${benefits.map(benefit => `"How would ${benefit.toLowerCase()} help you achieve your business objectives?"`).join('\n\n')}

"What would it mean for your team if you could eliminate these challenges?"

## Solution Presentation
"Based on what you've shared, ${data.productName} addresses these exact challenges by providing:
${benefits.map(benefit => `- ${benefit}`).join('\n')}"

## Handling Objections
${objections.map(objection => `
**"${objection}"**
"I understand that concern. Many of our clients initially felt the same way. Let me share how we've helped others in similar situations..."`).join('\n')}

## Call to Action
"The next step would be to ${data.callToAction || 'schedule a brief demo'}. 

I have some time available [specific times]. Which works better for you?"

## Follow-up
"Perfect! I'll send you a calendar invite and some relevant case studies. Is there anything specific you'd like me to prepare for our conversation?"`;
      break;

    case 'challenger':
      scriptTemplate = `# Challenger Sale Script for ${data.productName}

## Teaching Phase - Reframe Their Thinking
"Hi [Prospect's Name], most ${data.targetAudience} I speak with think ${painPoints[0] || 'their biggest challenge'} is their primary concern. 

But our research with over [X] companies shows that the real issue costing them the most is actually [unique insight related to their business]."

## Commercial Teaching
"Let me share what we've discovered...

While most companies focus on [common approach], the organizations seeing 3x better results are doing something completely different."

## Rational Drowning
"Companies that don't address this typically see:
- [Specific negative consequence 1]
- [Specific negative consequence 2]  
- [Specific negative consequence 3]

For example, one client was losing $[amount] monthly before they understood this."

## Emotional Impact
"This means your team is probably spending [time/effort] on [current approach], while your competitors who've figured this out are already [competitive advantage]."

## Solution Introduction
"${data.productName} takes a fundamentally different approach. Instead of just [common solution], we help you [unique value proposition].

This has helped companies like yours achieve:
${benefits.map(benefit => `- ${benefit}`).join('\n')}"

## Taking Control
"I'd recommend we ${data.callToAction || 'schedule a strategic session'} to show you exactly how this would work in your specific situation.

Based on what you've told me, I believe we can help you [specific outcome]. Are you available [specific time] this week?"`;
      break;

    case 'cardone':
      scriptTemplate = `# 10X Sales Script for ${data.productName}

## Massive Action Opening
"[Prospect's Name], what I'm about to share has helped companies like yours multiply their results by 10X. 

Are you open to exploring something that could dramatically change your [relevant business area]?"

## Commitment Questions
"If I could show you how to completely eliminate ${painPoints[0] || 'your biggest challenge'}, would you be willing to invest 30 minutes to learn more?"

"On a scale of 1-10, how committed are you to solving this problem this year?"

## Pain Amplification
"Most ${data.targetAudience} I talk to are settling for incremental improvements when they could be seeing exponential growth. 

What's really holding you back from achieving 10X results?"

## Urgency Creation
"The market is moving too fast to wait. Your competitors aren't waiting. Every day you delay is costing you [specific cost/opportunity]."

## 10X Solution Presentation
"${data.productName} isn't just another solution - it's a complete transformation that delivers:
${benefits.map(benefit => `- ${benefit} (and then some)`).join('\n')}

We don't do small improvements. We do 10X results."

## Massive Action Close
"Let's not waste any more time. ${data.callToAction || 'Let\'s get started'} right now and begin your 10X journey today.

I can get you set up this week. What's your biggest concern about moving forward immediately?"

## Objection Crushing
${objections.map(objection => `
**"${objection}"**
"I hear that a lot from people who aren't ready for 10X results. The question is: are you going to be average or are you going to dominate your market?"`).join('\n')}`;
      break;

    default:
      scriptTemplate = `# Professional Sales Script for ${data.productName}

## Introduction & Rapport
"Hi [Prospect's Name], this is [Your Name] from [Company]. 

I've been helping ${data.targetAudience} solve challenges around [relevant area]. Do you have a few minutes to discuss how this might benefit your organization?"

## Discovery Questions
"What's your current approach to [relevant process]?"

${painPoints.map(pain => `"Have you experienced challenges with ${pain.toLowerCase()}?"`).join('\n\n')}

"What would an ideal solution look like for you?"

## Value Presentation
"Based on what you've shared, ${data.productName} can help by:
${benefits.map(benefit => `- ${benefit}`).join('\n')}

We've helped similar companies achieve [specific results]."

## Addressing Concerns
${objections.map(objection => `
**"${objection}"**
"That's a valid concern. Let me address that..."`).join('\n')}

## Next Steps
"The next step would be to ${data.callToAction || 'schedule a brief consultation'}.

When would be a good time for you this week?"`;
  }

  return scriptTemplate;
};

export default ScriptGenerator;