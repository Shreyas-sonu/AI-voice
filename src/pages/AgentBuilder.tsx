import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Chat,
  Settings,
  ExpandMore,
  Save,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type Agent, type FlowStep } from '../lib/api';
import { v4 as uuid } from 'uuid';

export const AgentBuilder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const response = await api.get<Agent>(`/api/agents/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  useState(() => {
    if (agent?.flowSteps) {
      setSteps(agent.flowSteps);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (flowSteps: FlowStep[]) => {
      const response = await api.put<Agent>(`/api/agents/${id}`, { flowSteps });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
      setSnackbar({ open: true, message: 'Changes saved successfully!' });
    },
  });

  const handleAddStep = (type: 'prompt' | 'intent') => {
    const newStep: FlowStep = {
      id: uuid(),
      type,
      content: type === 'prompt' ? 'Enter prompt text...' : 'Define intent...',
      order: steps.length,
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    setSelectedStep(newStep.id);
  };

  const handleUpdateStep = (stepId: string, content: string) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, content } : step
    ));
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    setSteps(updatedSteps);
    if (selectedStep === stepId) {
      setSelectedStep(null);
    }
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];

    const reordered = newSteps.map((step, idx) => ({ ...step, order: idx }));
    setSteps(reordered);
  };

  const handleSave = () => {
    updateMutation.mutate(steps);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!agent) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Agent not found</Typography>
        <Button onClick={() => navigate('/agents')}>Back to Agents</Button>
      </Box>
    );
  }

  const selectedStepData = steps.find(s => s.id === selectedStep);

  if (isMobile) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {agent.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure conversation flow
          </Typography>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleAddStep('prompt')}
            fullWidth
          >
            Add Prompt
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddStep('intent')}
            fullWidth
          >
            Add Intent
          </Button>
        </Box>

        {steps.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Start building your first step!
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ mb: 2 }}>
            {steps.map((step, index) => (
              <Accordion key={step.id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {step.type === 'prompt' ? <Chat fontSize="small" /> : <Settings fontSize="small" />}
                    <Typography>
                      {step.type === 'prompt' ? 'Prompt' : 'Intent'} {index + 1}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={step.content}
                    onChange={(e) => handleUpdateStep(step.id, e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveStep(step.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteStep(step.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={<Save />}
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity="success">{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {agent.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure conversation flow
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 250px)' }}>
        <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => handleAddStep('prompt')}
            >
              Add Prompt
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => handleAddStep('intent')}
            >
              Add Intent
            </Button>
          </Box>

          {steps.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">
                Start building your first step!
              </Typography>
            </Box>
          ) : (
            <List>
              {steps.map((step, index) => (
                <ListItem
                  key={step.id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: `2px solid ${selectedStep === step.id ? theme.palette.primary.main : 'transparent'}`,
                    backgroundColor: selectedStep === step.id ? `${theme.palette.primary.main}10` : 'transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}08`,
                    },
                  }}
                  onClick={() => setSelectedStep(step.id)}
                >
                  {step.type === 'prompt' ? (
                    <Chat sx={{ mr: 2, color: theme.palette.primary.main }} />
                  ) : (
                    <Settings sx={{ mr: 2, color: theme.palette.secondary.main }} />
                  )}
                  <ListItemText
                    primary={`${step.type === 'prompt' ? 'Prompt' : 'Intent'} ${index + 1}`}
                    secondary={step.content.substring(0, 50) + (step.content.length > 50 ? '...' : '')}
                  />
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStep(step.id, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStep(step.id, 'down');
                      }}
                      disabled={index === steps.length - 1}
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(step.id);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Paper sx={{ flex: 1, p: 3 }}>
          {selectedStepData ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Edit {selectedStepData.type === 'prompt' ? 'Prompt' : 'Intent'}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={selectedStepData.content}
                onChange={(e) => handleUpdateStep(selectedStepData.id, e.target.value)}
                label="Content"
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">
                Select a step to edit
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

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
