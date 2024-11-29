// src/components/ChatHistory.js
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ChatBubble from './ChatBubble';

const ChatHistory = ({ chatMessages }) => {
  return (
    <Box style={{ height: '300px', overflowY: 'scroll' }}>
      {chatMessages.map((message, index) => (
        <ChatBubble key={index} message={message} />
      ))}
    </Box>
  );
};

export default ChatHistory;