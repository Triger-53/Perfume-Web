
import React, { useState, useRef } from 'react';
import { useGemini } from '../hooks/useGemini';
import Modal from './Modal';
import { useToast } from '../context/ToastContext';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { analyzeImage, isAvailable } = useGemini();
  const { addToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.hash = `#/shop?search=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Sorry, your browser does not support voice search.");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      window.location.hash = `#/shop?search=${encodeURIComponent(transcript)}`;
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.start();
  };

  const startCamera = async () => {
    if (!isAvailable) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please ensure permissions are granted and you are on a secure (HTTPS) connection.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const base64Image = dataUrl.split(',')[1];

      stopCamera();

      addToast('Analyzing image with AI...', 'info');

      const result = await analyzeImage(
        "Analyze the perfume bottle in this image. Respond with only the brand and the product name, like 'Gucci Bloom' or 'Chanel Chance'. If you cannot identify it, respond with 'Unknown'.",
        base64Image,
        'image/jpeg'
      );

      if (result.toLowerCase().includes('unknown') || result.startsWith('Error:')) {

        addToast('Could not identify the perfume.', 'error');
      } else {

        addToast(`AI identified: ${result}. Searching now...`, 'success');
        setQuery(result);
        window.location.hash = `#/shop?search=${encodeURIComponent(result)}`;
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full max-w-xs">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a scent..."
          className="w-full pl-4 pr-20 py-2 border border-brand-primary/20 rounded-full bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button type="button" onClick={handleVoiceSearch} className="p-2 text-gray-500 hover:text-brand-accent" aria-label="Search by voice">
            {isListening ? (
              <svg className="h-5 w-5 animate-pulse text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" /></svg>
            ) : (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4ZM10 6a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0Zm10 4a1 1 0 0 0-2 0v1a6 6 0 0 1-12 0v-1a1 1 0 0 0-2 0v1a8 8 0 0 0 7 7.93V21a1 1 0 0 0 2 0v-2.07A8 8 0 0 0 20 11Z" /></svg>
            )}
          </button>
          <button
            type="button"
            onClick={startCamera}
            className="p-2 text-gray-500 hover:text-brand-accent disabled:text-gray-300 disabled:cursor-not-allowed"
            aria-label="Search by image"
            disabled={!isAvailable}
            title={!isAvailable ? "Visual search is unavailable: API Key not configured." : "Search by image"}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-4 8a4 4 0 1 1-4-4 4 4 0 0 1 4 4Z" /><path d="M12 15a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z" /></svg>
          </button>
        </div>
      </form>

      {isCameraOpen && (
        <Modal title="Visual Search" onClose={stopCamera}>
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg"></video>
            <button onClick={handleCapture} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-sm rounded-full p-4 border-2 border-white hover:bg-white/75 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full ring-2 ring-inset ring-black/50"></div>
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </Modal>
      )}
    </>
  );
};

export default SearchBar;
