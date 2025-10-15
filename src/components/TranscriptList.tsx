import { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranscriptMessage } from '../lib/api';

interface TranscriptListProps {
  messages: TranscriptMessage[];
}

export const TranscriptList = ({ messages }: TranscriptListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Tooltip title={formatTime(message.timestamp)} placement="top">
                <Paper
                  elevation={0}
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    backgroundColor: message.role === 'user'
                      ? 'primary.main'
                      : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 3,
                    borderTopRightRadius: message.role === 'user' ? 0 : 3,
                    borderTopLeftRadius: message.role === 'bot' ? 0 : 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: message.role === 'user' ? 500 : 400,
                      mb: 0.5,
                      fontSize: '0.75rem',
                      opacity: 0.8,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {message.role === 'user' ? 'User' : 'Agent'}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Tooltip>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>

      {messages.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            Conversation will appear here...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
