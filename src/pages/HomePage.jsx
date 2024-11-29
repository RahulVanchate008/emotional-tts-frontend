// src/pages/HomePage.js
import React, { useState } from 'react';
import { Container, Box, TextField, Button, Paper } from '@mui/material';
import ChatBox from '../components/ChatBox/ChatBox';
import ChatHistory from '../components/ChatHistory';

const HomePage = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const handleNewMessage = (message) => {
    setChatMessages([...chatMessages, message]);
    // Pass this message to the backend to get the TTS audio stream
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Box>
          <ChatHistory chatMessages={chatMessages} />
          <ChatBox onSendMessage={handleNewMessage} />
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
