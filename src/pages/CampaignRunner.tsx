import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import { Pause, Stop, Download } from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api, type CampaignRun } from '../lib/api';
import { TranscriptList } from '../components/TranscriptList';

export const CampaignRunner = () => {
  const theme = useTheme();
  const { runId } = useParams<{ runId: string }>();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const { data: run, refetch } = useQuery({
    queryKey: ['campaignRun', runId],
    queryFn: async () => {
      const response = await api.get<CampaignRun>(`/api/campaigns/${runId}/status`);
      return response.data;
    },
    enabled: !!runId,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'running' ? 2000 : false;
    },
  });

  const pauseMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<CampaignRun>(`/api/campaigns/${runId}/pause`);
      return response.data;
    },
    onSuccess: () => {
      refetch();
      setSnackbar({ open: true, message: 'Campaign paused' });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<CampaignRun>(`/api/campaigns/${runId}/stop`);
      return response.data;
    },
    onSuccess: () => {
      refetch();
      setSnackbar({ open: true, message: 'Campaign stopped' });
    },
  });

  const handleExport = () => {
    if (!run) return;

    const content = run.transcript
      .map((msg) => `[${msg.role.toUpperCase()}] ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${run.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'Transcript exported' });
  };

  const getStatusColor = (status: CampaignRun['status']) => {
    switch (status) {
      case 'running':
        return 'info';
      case 'completed':
        return 'success';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!run) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading campaign...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {run.agentName}
          </Typography>
          <Chip
            label={run.status}
            size="small"
            color={getStatusColor(run.status)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {run.status === 'running' && (
            <>
              <Button
                variant="outlined"
                startIcon={<Pause />}
                onClick={() => pauseMutation.mutate()}
                disabled={pauseMutation.isPending}
              >
                Pause
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Stop />}
                onClick={() => stopMutation.mutate()}
                disabled={stopMutation.isPending}
              >
                Stop
              </Button>
            </>
          )}
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={run.transcript.length === 0}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TranscriptList messages={run.transcript} />

        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <TextField
            fullWidth
            placeholder="Simulated input (demo mode)"
            disabled
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};
