
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  disabled: boolean;
  isUploading: boolean;
  onTranscription: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  disabled, 
  isUploading, 
  onTranscription 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast.info(`Voice recording stopped (${recordingTime}s)`);
      setRecordingTime(0);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // In a real app, you would process the recording here
      // Simulate a transcription for demo purposes
      if (recordingTime > 1) {
        setTimeout(() => {
          const demoTranscriptions = [
            "What stocks should I invest in if I'm interested in renewable energy?",
            "How do I start investing with a small budget of $1000?",
            "Can you explain what a P/E ratio is and why it matters?",
            "What's the difference between a bull and bear market?"
          ];
          const randomTranscription = demoTranscriptions[Math.floor(Math.random() * demoTranscriptions.length)];
          onTranscription(randomTranscription);
          toast.success("Voice transcribed successfully");
        }, 1000);
      }
    } else {
      // Check for microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast.info("Voice recording started... speak now");
          
          // Start timer for recording duration
          recordingTimerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          toast.error('Unable to access microphone. Please check permissions.');
        });
    }
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Button 
      variant={isRecording ? "destructive" : "ghost"}
      size="icon" 
      className={`flex-shrink-0 ${isRecording ? 'text-white animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
      disabled={disabled || isUploading}
      onClick={toggleRecording}
      aria-label={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};

export default VoiceRecorder;
