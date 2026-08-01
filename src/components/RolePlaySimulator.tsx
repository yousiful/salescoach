import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UserCircle, Bot, Send, Mic, MicOff, Settings, BarChart, RefreshCw, X, AlertTriangle, CheckCircle, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import SubscriptionModal from './SubscriptionModal';

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
  const { addRolePlaySession, shouldShowSubscriptionPrompt } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [scenario, setScenario] = useState('software');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (shouldShowSubscriptionPrompt()) {
      setShowSubscriptionModal(true);
    }
  }, [shouldShowSubscriptionPrompt]);

  useEffect(() => {
    // Request microphone permissions
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          audioChunksRef.current = [];
          handleAudioInput(audioBlob);
        };
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
        toast.error('Unable to access microphone. Please check your permissions.');
      });

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleAudioInput = async (audioBlob: Blob) => {
    // Here you would typically:
    // 1. Convert the audio to text using a speech-to-text service
    // 2. Set the text as input
    // For now, we'll simulate this with a timeout
    setTimeout(() => {
      setInput(getSimulatedSpeechInput());
    }, 1000);
  };

  const toggleRecording = () => {
    if (!mediaRecorderRef.current) {
      toast.error('Microphone not initialized');
      return;
    }

    if (isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    }
    
    setIsRecording(!isRecording);
  };

  // Rest of the component remains the same...
  // (Previous code for scenarios, messages, handleSend, etc.)

  return (
    <>
      {/* Previous JSX remains the same */}
      
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default RolePlaySimulator;