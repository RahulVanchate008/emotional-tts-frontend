// src/components/ChatBubble.js
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import AudioStream from './AudioStream';

const ChatBubble = ({ message }) => {
  return (
    <Paper style={{ padding: '10px', margin: '10px 0' }}>
      <Box>
        <Typography variant="body1">{message}</Typography>
        {/* If message is of type 'audio', trigger the AudioStream component */}
        {message.type === 'audio' && <AudioStream audioData={message.audioData} />}
      </Box>
    </Paper>
  );
};

export default ChatBubble;
