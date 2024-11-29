import { useRef, useState, useEffect } from 'react';

const useElevenlabsAudioStream = () => {
  const [audioUrl, setAudioUrl] = useState(null); // Store the audio Blob URL
  const ws = useRef(null); // WebSocket reference
  const audioChunks = useRef([]); // Accumulate audio chunks

  const startElevenlabsStreaming = (sentence, setMessages) => {
    ws.current = new WebSocket('ws://127.0.0.1:8000/ws/elevenlabs-websocket-stream/');
    ws.current.binaryType = 'arraybuffer'; // Ensure binary data is received

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current.send(sentence); // Send the query to the backend
    };

    ws.current.onmessage = (event) => {
      audioChunks.current.push(event.data); // Store the received audio chunks

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Streaming audio from Elevenlabs...' },
      ]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
      playAudio(); // Play the accumulated audio when the stream ends
    };

    ws.current.onerror = (error) => console.error('WebSocket error:', error);
  };

  const stopElevenlabsStreaming = () => {
    if (ws.current) {
      ws.current.close();
      audioChunks.current = []; // Clear accumulated chunks
      setAudioUrl(null); // Reset the audio URL
    }
  };

  const playAudio = () => {
    if (audioChunks.current.length === 0) return;

    // Create a Blob from the accumulated audio chunks
    const blob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    setAudioUrl(url); // Set the audio URL

    const audio = new Audio(url); // Create an audio element
    audio.play(); // Play the audio

    audio.onended = () => {
      URL.revokeObjectURL(url); // Clean up the Blob URL after playback
    };

    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
    };
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl); // Clean up Blob URL on unmount
      }
    };
  }, [audioUrl]);

  return { startElevenlabsStreaming, stopElevenlabsStreaming };
};

export default useElevenlabsAudioStream;
