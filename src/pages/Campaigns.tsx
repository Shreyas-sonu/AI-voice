import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api, type Campaign, type CampaignRun } from '../lib/api';
import { motion } from 'framer-motion';

export const Campaigns = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await api.get<Campaign[]>('/api/campaigns');
      return response.data;
    },
  });

  const startMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await api.post<CampaignRun>(`/api/campaigns/${campaignId}/start`);
      return response.data;
    },
    onSuccess: (run) => {
      navigate(`/campaigns/${run.id}`);
    },
  });

  const handleStartDemo = (campaignId: string) => {
    startMutation.mutate(campaignId);
  };

  const getStatusColor = (status: Campaign['status']) => {
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

  if (isMobile) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Campaigns
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and run campaign demos
          </Typography>
        </Box>

        {campaigns.length === 0 && !isLoading ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No campaigns yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create an agent first to start campaigns
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {campaign.name}
                      </Typography>
                      <Chip
                        label={campaign.status}
                        size="small"
                        color={getStatusColor(campaign.status)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Agent: {campaign.agentName}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartDemo(campaign.id)}
                      disabled={startMutation.isPending || campaign.status === 'running'}
                      fullWidth
                    >
                      {campaign.status === 'running' ? 'Running...' : 'Start Demo'}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Campaigns
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and run campaign demos
        </Typography>
      </Box>

      {campaigns.length === 0 && !isLoading ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No campaigns yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create an agent first to start campaigns
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Campaign</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Linked Agent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {campaign.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.agentName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={campaign.status}
                      size="small"
                      color={getStatusColor(campaign.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartDemo(campaign.id)}
                      disabled={startMutation.isPending || campaign.status === 'running'}
                    >
                      {campaign.status === 'running' ? 'Running...' : 'Start Demo'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
