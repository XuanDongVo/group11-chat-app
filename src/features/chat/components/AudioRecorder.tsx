import { useState, useRef, useEffect } from "react";
import { Mic, Square, X, Send } from "lucide-react";
import "../../../styles/AudioRecorder.css";
import type { AudioRecorderProps } from "../../../types/chat";

const MAX_RECORDING_TIME = 60; // 60 seconds max
const MAX_FILE_SIZE = 500 * 1024; // 500KB max (safe for WebSocket)

export default function AudioRecorder({ onSendAudio, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use lower bitrate to reduce file size
      const options = { 
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000 // Low bitrate for smaller files
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        
        // Check file size
        if (audioBlob.size > MAX_FILE_SIZE) {
          setError(`File quá lớn (${Math.round(audioBlob.size / 1024)}KB). Tối đa 500KB. Vui lòng ghi ngắn hơn.`);
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAudioBase64(base64);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop at max time
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Không thể truy cập microphone. Vui lòng cấp quyền.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSend = () => {
    if (audioBase64) {
      // Double check size before sending
      const sizeInBytes = Math.ceil((audioBase64.length * 3) / 4);
      if (sizeInBytes > MAX_FILE_SIZE) {
        setError(`File quá lớn để gửi. Vui lòng ghi ngắn hơn.`);
        return;
      }
      onSendAudio(audioBase64);
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto start recording when component mounts
  useEffect(() => {
    startRecording();
  }, []);

  return (
    <div className="audio-recorder">
      <button
        type="button"
        className="audio-recorder-cancel"
        onClick={handleCancel}
        title="Hủy"
      >
        <X size={20} />
      </button>

      {error ? (
        <div className="audio-recorder-error">
          <span>{error}</span>
        </div>
      ) : isRecording ? (
        <>
          <div className="audio-recorder-recording">
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span className="recording-time">
                {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="audio-recorder-stop"
            onClick={stopRecording}
            title="Dừng ghi âm"
          >
            <Square size={20} />
          </button>
        </>
      ) : (
        <>
          {audioUrl && (
            <div className="audio-recorder-preview">
              <audio src={audioUrl} controls className="audio-preview" />
              <span className="audio-duration">{formatTime(recordingTime)}</span>
            </div>
          )}
          <button
            type="button"
            className="audio-recorder-send"
            onClick={handleSend}
            disabled={!audioBase64}
            title="Gửi tin nhắn"
          >
            <Send size={18} />
          </button>
        </>
      )}
    </div>
  );
}
