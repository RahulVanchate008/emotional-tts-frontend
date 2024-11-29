import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, Button, Box, Typography, Paper, Avatar, FormControl, Select, MenuItem, LinearProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import './ChatBox.scss';

const ChatBox = () => {
  const [query, setQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('ws://localhost:8000/ws/elevenlabs-websocket-stream/');
  const [selectedVoice, setSelectedVoice] = useState('jessica'); // Default voice selection
  const websocketRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueue = useRef([]);
  const isPlayingRef = useRef(false);
  const messagesEndRef = useRef(null);

  const API_KEY = 'mapcommunications';

  // Mapping voice names to their corresponding voice IDs
  const voiceIdMapping = {
    jessica: 'cgSgspJ2msm6clMCkdW9',
    eric: 'cjVigY5qzO86Huf0OWal',
    matilda: 'XrExE9yKIg1WjnnlVkGX',
  };

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 8000,
    });

    return () => {
      if (websocketRef.current) websocketRef.current.close();
      audioContextRef.current.close();
    };
  }, []);

  const sendQueryWithWebSocket = () => {
    if (!query.trim()) return;

    if (!isConnected) {
      // Add API key as a query parameter to the WebSocket URL
      const authorizedUrl = `${selectedUrl}?api_key=${API_KEY}`;
      websocketRef.current = new WebSocket(authorizedUrl);
      websocketRef.current.binaryType = 'arraybuffer';

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);

        // Send query along with selected voice ID
        const payload = JSON.stringify({ 
          query, 
          voice_id: voiceIdMapping[selectedVoice] 
        });
        websocketRef.current.send(payload);

        setMessages((prev) => [...prev, { sender: 'user', text: query }]);
        setQuery('');
      };

      websocketRef.current.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: data.sentence, emotions: data.emotions }
          ]);
          return;
        }

        try {
          const arrayBuffer = event.data;
          const decodedData = await audioContextRef.current.decodeAudioData(arrayBuffer);

          if (selectedUrl === 'ws://localhost:8000/ws/elevenlabs-with-emotions/') {
            const trimmedBuffer = trimAudioBuffer(decodedData, 0); // Remove first 5 seconds
            enqueueAudio(trimmedBuffer);
          } else {
            enqueueAudio(decodedData); // Stream without trimming
          }
        } catch (error) {
          console.error('Error decoding audio:', error);
        }
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } else {
      // Send query along with selected voice ID if already connected
      const payload = JSON.stringify({ 
        query, 
        voice_id: voiceIdMapping[selectedVoice] 
      });
      websocketRef.current.send(payload);

      setMessages((prev) => [...prev, { sender: 'user', text: query }]);
      setQuery('');
    }
  };

  const trimAudioBuffer = (audioBuffer, secondsToTrim) => {
    const sampleRate = audioBuffer.sampleRate;
    const startOffset = secondsToTrim * sampleRate;

    if (startOffset >= audioBuffer.length) return audioContextRef.current.createBuffer(1, 1, sampleRate);

    const trimmedLength = audioBuffer.length - startOffset;
    const trimmedBuffer = audioContextRef.current.createBuffer(
      audioBuffer.numberOfChannels,
      trimmedLength,
      sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const originalData = audioBuffer.getChannelData(channel);
      const trimmedData = new Float32Array(trimmedLength);
      trimmedData.set(originalData.subarray(startOffset));
      trimmedBuffer.copyToChannel(trimmedData, channel);
    }

    return trimmedBuffer;
  };

  const enqueueAudio = (audioBuffer) => {
    audioQueue.current.push(audioBuffer);
    if (!isPlayingRef.current) {
      playNextAudio();
    }
  };

  const playNextAudio = () => {
    if (audioQueue.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioBuffer = audioQueue.current.shift();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    source.onended = playNextAudio;
    source.start();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUrlChange = (event) => {
    setSelectedUrl(event.target.value);
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
        Pick a Voice Engine Service
      </Typography>

      <Box display="flex" gap={2} sx={{ marginBottom: '16px' }}>
        <FormControl fullWidth>
          <Select value={selectedUrl} onChange={handleUrlChange} style={{ color: 'white', backgroundColor: '#3c3c5c' }}>
            <MenuItem value="ws://localhost:8000/ws/elevenlabs-websocket-stream/">
              Elevenlabs
            </MenuItem>
            <MenuItem value="ws://localhost:8000/ws/elevenlabs-with-emotions/">
              Elevenlabs with emotions
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Select value={selectedVoice} onChange={handleVoiceChange} style={{ color: 'white', backgroundColor: '#3c3c5c' }}>
            <MenuItem value="jessica">Jessica</MenuItem>
            <MenuItem value="matilda">Matilda</MenuItem>
            <MenuItem value="eric">Eric</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="chat-box-container" style={{ color: 'white', backgroundColor: '#3c3c5c' }}>
        <Typography variant="h6" align="center">
          Start an Audio Conversation
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <HeadphonesIcon />
        </Box>

        {messages.map((message, index) => (
          <Box key={index} className={`message-row ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <Avatar className={`avatar ${message.sender}-avatar`} alt={message.sender.toUpperCase()} />
            <Paper className={`message-bubble ${message.sender}-bubble`} elevation={1}>
              <Typography variant="body1">{message.text}</Typography>
              {message.emotions && message.emotions.map((emotionData, emotionIndex) => (
                <Box key={emotionIndex} mt={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{emotionData.emotion}</Typography>
                    <Typography variant="body2">{(emotionData.score * 100).toFixed(2)}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={emotionData.score * 100}
                  />
                </Box>
              ))}
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box className="input-container">
        <TextField
          className="text-field"
          label="Type your query"
          multiline
          maxRows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          style={{ color: 'white', backgroundColor: '#3c3c5c' }}
        />
        <Box display="flex" mt={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={sendQueryWithWebSocket}
            endIcon={<SendIcon />}
            style={{ height: 55, marginLeft: 15 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBox;
