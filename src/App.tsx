import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { AgentBuilder } from './pages/AgentBuilder';
import { Campaigns } from './pages/Campaigns';
import { CampaignRunner } from './pages/CampaignRunner';
import { Logs } from './pages/Logs';

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={() => setSideNavOpen(!sideNavOpen)} />
      <SideNav open={sideNavOpen} onClose={() => setSideNavOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: '100%', md: 'calc(100% - 240px)' },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentBuilder />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:runId" element={<CampaignRunner />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
