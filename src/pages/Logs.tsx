import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { SmartToy, Campaign, Info, Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { api, type LogEntry } from '../lib/api';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Logs = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      const response = await api.get<LogEntry[]>('/api/logs');
      return response.data;
    },
  });

  const filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'agent':
        return SmartToy;
      case 'campaign':
        return Campaign;
      default:
        return Info;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'agent':
        return theme.palette.primary.main;
      case 'campaign':
        return theme.palette.secondary.main;
      default:
        return theme.palette.info.main;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Activity Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track platform events and activities
        </Typography>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {filteredLogs.length === 0 && !isLoading ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {searchQuery ? 'No matching logs found' : 'No logs yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try a different search term' : 'Activity will appear here'}
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List sx={{ p: 0 }}>
            {filteredLogs.map((log, index) => {
              const Icon = getLogIcon(log.type);
              const color = getLogColor(log.type);

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      borderBottom:
                        index < filteredLogs.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : 'none',
                      py: 2.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                      >
                        <Icon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {log.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {log.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(log.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </motion.div>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};
