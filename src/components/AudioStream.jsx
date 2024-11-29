import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const audioPlayer = useRef(null);  // Reference to the audio element
  const ws = useRef(null);           // WebSocket reference
  const audioQueue = useRef([]);      // Queue to store the incoming audio blobs
  const isPlaying = useRef(false);    // Flag to track if audio is currently playing

  useEffect(() => {
    // Cleanup WebSocket on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const startStreaming = () => {
    if (!text.trim()) return;

    setIsStreaming(true);
    audioQueue.current = [];  // Reset the audio queue before starting

    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://127.0.0.1:8000/ws/deepgram-tts-chunked');

    // On WebSocket open, send the text to the server
    ws.current.onopen = () => {
      ws.current.send(text);
    };

    // Handle incoming audio data
    ws.current.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const audioBlob = event.data;
        // Add the audio blob to the queue
        audioQueue.current.push(audioBlob);

        // If no audio is currently playing, start playing the queue
        if (!isPlaying.current) {
          playNextAudio();
        }
      }
    };

    // Handle WebSocket closure or errors
    ws.current.onclose = () => {
      setIsStreaming(false);
      console.log('WebSocket closed');
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsStreaming(false);
    };
  };

  const playNextAudio = () => {
    // If the queue is empty, nothing to play
    if (audioQueue.current.length === 0) {
      isPlaying.current = false;
      return;
    }

    
    const audioBlob = audioQueue.current.shift();
    const audioUrl = URL.createObjectURL(audioBlob);

    
    audioPlayer.current.src = audioUrl;
    audioPlayer.current.play();

    isPlaying.current = true;

    
    audioPlayer.current.onended = () => {
      URL.revokeObjectURL(audioUrl);  
      isPlaying.current = false;
      playNextAudio(); 
    };
  };

  const stopStreaming = () => {
    if (ws.current) {
      ws.current.close();
    }
    setIsStreaming(false);
    isPlaying.current = false;
    audioQueue.current = [];  
  };

  return (
    <div className="App">
      <h1>Real-time Audio Streaming Test</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <br />
      <br />
      <button onClick={startStreaming} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </button>
      <button onClick={stopStreaming} disabled={!isStreaming}>
        Stop Streaming
      </button>
      <br />
      <br />
      <audio ref={audioPlayer} controls></audio>
    </div>
  );
}

export default App;
