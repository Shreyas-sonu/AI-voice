import { useState } from 'react';
import {
  Box,
  Typography,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Add, Edit, PlayArrow } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api, type Agent } from '../lib/api';
import { AgentForm } from '../components/AgentForm';
import { motion } from 'framer-motion';

export const Agents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await api.get<Agent[]>('/api/agents');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Agent>) => {
      const response = await api.post<Agent>('/api/agents', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Agent> }) => {
      const response = await api.put<Agent>(`/api/agents/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  const handleCreateAgent = async (data: Partial<Agent>) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateAgent = async (data: Partial<Agent>) => {
    if (editAgent) {
      await updateMutation.mutateAsync({ id: editAgent.id, data });
      setEditAgent(null);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditAgent(agent);
    setFormOpen(true);
  };

  const handleRun = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditAgent(null);
  };

  if (isMobile) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Agents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your voice AI agents
          </Typography>
        </Box>

        {agents.length === 0 && !isLoading ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No agents yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first voice agent to get started
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {agent.name}
                      </Typography>
                      <Chip
                        label={agent.language}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {agent.description || 'No description'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(agent)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<PlayArrow />}
                      onClick={() => handleRun(agent.id)}
                      variant="contained"
                    >
                      Configure
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}

        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => setFormOpen(true)}
        >
          <Add />
        </Fab>

        <AgentForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={editAgent ? handleUpdateAgent : handleCreateAgent}
          agent={editAgent}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Agents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your voice AI agents
        </Typography>
      </Box>

      {agents.length === 0 && !isLoading ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No agents yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first voice agent to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Create Agent
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Language</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow
                  key={agent.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {agent.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={agent.language}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {agent.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(agent)}
                      sx={{ mr: 1 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleRun(agent.id)}
                    >
                      <PlayArrow fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setFormOpen(true)}
      >
        <Add />
      </Fab>

      <AgentForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editAgent ? handleUpdateAgent : handleCreateAgent}
        agent={editAgent}
      />
    </Box>
  );
};
