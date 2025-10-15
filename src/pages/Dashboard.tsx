import { Add, Campaign, PlayArrow, Receipt, SmartToy, TrendingUp } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Paper, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api, type Stats } from '../lib/api';

export const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get<Stats>('/api/stats');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Active Agents',
      value: stats?.agents || 0,
      icon: SmartToy,
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}15`,
      trend: '+12%',
    },
    {
      title: 'Campaigns',
      value: stats?.campaigns || 0,
      icon: Campaign,
      color: theme.palette.secondary.main,
      bgColor: `${theme.palette.secondary.main}15`,
      trend: '+8%',
    },
    {
      title: 'Total Logs',
      value: stats?.logs || 0,
      icon: Receipt,
      color: theme.palette.info.main,
      bgColor: `${theme.palette.info.main}15`,
      trend: '+24%',
    },
  ];

  const recentActivity = [
    { text: 'New agent "Customer Support" created', time: '5 min ago' },
    { text: 'Campaign "Q1 Outreach" completed', time: '1 hour ago' },
    { text: 'Agent "Sales Qualifier" updated', time: '2 hours ago' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your voice AI platform performance
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          {isLoading ? '-' : stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
                          <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                            {stat.trend}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          backgroundColor: stat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ color: stat.color, fontSize: 28 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate('/agents')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: `${theme.palette.primary.main}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                      }}
                    >
                      <Add sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Create Agent
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Build a new voice AI agent
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate('/campaigns')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: `${theme.palette.secondary.main}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                      }}
                    >
                      <PlayArrow sx={{ color: theme.palette.secondary.main, fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Start Demo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Run a campaign demo
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivity.map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">
                    {activity.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                  {index < recentActivity.length - 1 && (
                    <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mt: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
