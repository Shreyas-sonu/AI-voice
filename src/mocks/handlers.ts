import { http, HttpResponse, delay } from 'msw';
import { v4 as uuid } from 'uuid';
import type { Agent, Campaign, CampaignRun, LogEntry, Stats, TranscriptMessage } from '../lib/api';

let agents: Agent[] = [
  {
    id: uuid(),
    name: 'Customer Support Assistant',
    language: 'English',
    description: 'Handles customer inquiries and support tickets',
    flowSteps: [
      { id: uuid(), type: 'prompt', content: 'Hello! How can I help you today?', order: 0 },
      { id: uuid(), type: 'intent', content: 'Identify customer issue', order: 1 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Sales Qualifier',
    language: 'English',
    description: 'Qualifies leads and schedules demos',
    flowSteps: [
      { id: uuid(), type: 'prompt', content: 'Hi! Tell me about your business needs.', order: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let campaigns: Campaign[] = [
  {
    id: uuid(),
    name: 'Q1 Customer Outreach',
    agentId: agents[0].id,
    agentName: agents[0].name,
    status: 'idle',
    createdAt: new Date().toISOString(),
  },
];

let campaignRuns: Map<string, CampaignRun> = new Map();

let logs: LogEntry[] = [
  {
    id: uuid(),
    type: 'agent',
    title: 'Agent Created',
    description: 'Customer Support Assistant was created',
    timestamp: new Date().toISOString(),
  },
  {
    id: uuid(),
    type: 'campaign',
    title: 'Campaign Created',
    description: 'Q1 Customer Outreach campaign was created',
    timestamp: new Date().toISOString(),
  },
];

const mockTranscriptLines = [
  { role: 'bot' as const, content: 'Hello! How can I help you today?' },
  { role: 'user' as const, content: 'I need help with my account settings' },
  { role: 'bot' as const, content: 'I understand you need assistance with your account settings. Can you tell me what specific setting you\'d like to change?' },
  { role: 'user' as const, content: 'I want to update my email address' },
  { role: 'bot' as const, content: 'I can help you with that. For security purposes, I\'ll need to verify your identity first. Can you provide your current email address?' },
  { role: 'user' as const, content: 'It\'s john@example.com' },
  { role: 'bot' as const, content: 'Thank you. I\'ve sent a verification code to that email. Once you provide the code, we can proceed with updating your email address.' },
  { role: 'user' as const, content: 'The code is 123456' },
  { role: 'bot' as const, content: 'Perfect! Your identity has been verified. What would you like your new email address to be?' },
  { role: 'user' as const, content: 'john.smith@example.com' },
  { role: 'bot' as const, content: 'Great! I\'ve updated your email address to john.smith@example.com. You\'ll receive a confirmation email shortly. Is there anything else I can help you with?' },
  { role: 'user' as const, content: 'No, that\'s all. Thank you!' },
  { role: 'bot' as const, content: 'You\'re welcome! Have a great day!' },
];

export const handlers = [
  // Stats
  http.get('/api/stats', async () => {
    await delay(200);
    const stats: Stats = {
      agents: agents.length,
      campaigns: campaigns.length,
      logs: logs.length,
    };
    return HttpResponse.json(stats);
  }),

  // Agents
  http.get('/api/agents', async () => {
    await delay(300);
    return HttpResponse.json(agents);
  }),

  http.get('/api/agents/:id', async ({ params }) => {
    await delay(200);
    const agent = agents.find(a => a.id === params.id);
    if (!agent) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(agent);
  }),

  http.post('/api/agents', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Partial<Agent>;
    const newAgent: Agent = {
      id: uuid(),
      name: body.name || 'Untitled Agent',
      language: body.language || 'English',
      description: body.description || '',
      flowSteps: body.flowSteps || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    agents.push(newAgent);

    logs.unshift({
      id: uuid(),
      type: 'agent',
      title: 'Agent Created',
      description: `${newAgent.name} was created`,
      timestamp: new Date().toISOString(),
    });

    return HttpResponse.json(newAgent, { status: 201 });
  }),

  http.put('/api/agents/:id', async ({ params, request }) => {
    await delay(400);
    const body = await request.json() as Partial<Agent>;
    const index = agents.findIndex(a => a.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    agents[index] = {
      ...agents[index],
      ...body,
      id: agents[index].id,
      updatedAt: new Date().toISOString(),
    };

    logs.unshift({
      id: uuid(),
      type: 'agent',
      title: 'Agent Updated',
      description: `${agents[index].name} was updated`,
      timestamp: new Date().toISOString(),
    });

    return HttpResponse.json(agents[index]);
  }),

  // Campaigns
  http.get('/api/campaigns', async () => {
    await delay(300);
    return HttpResponse.json(campaigns);
  }),

  http.post('/api/campaigns/:id/start', async ({ params }) => {
    await delay(500);
    const campaign = campaigns.find(c => c.id === params.id);

    if (!campaign) {
      return new HttpResponse(null, { status: 404 });
    }

    const runId = uuid();
    const agent = agents.find(a => a.id === campaign.agentId);

    const run: CampaignRun = {
      id: runId,
      campaignId: campaign.id,
      agentName: campaign.agentName,
      status: 'running',
      transcript: [],
      startedAt: new Date().toISOString(),
    };

    campaignRuns.set(runId, run);

    const campaignIndex = campaigns.findIndex(c => c.id === params.id);
    if (campaignIndex !== -1) {
      campaigns[campaignIndex].status = 'running';
    }

    logs.unshift({
      id: uuid(),
      type: 'campaign',
      title: 'Campaign Started',
      description: `${campaign.name} demo started`,
      timestamp: new Date().toISOString(),
    });

    return HttpResponse.json(run, { status: 201 });
  }),

  http.get('/api/campaigns/:runId/status', async ({ params }) => {
    await delay(300);
    const run = campaignRuns.get(params.runId as string);

    if (!run) {
      return new HttpResponse(null, { status: 404 });
    }

    if (run.status === 'running' && run.transcript.length < mockTranscriptLines.length) {
      const nextIndex = run.transcript.length;
      const linesToAdd = Math.min(2, mockTranscriptLines.length - nextIndex);

      for (let i = 0; i < linesToAdd; i++) {
        const line = mockTranscriptLines[nextIndex + i];
        run.transcript.push({
          id: uuid(),
          role: line.role,
          content: line.content,
          timestamp: new Date().toISOString(),
        });
      }

      if (run.transcript.length >= mockTranscriptLines.length) {
        run.status = 'completed';
        run.completedAt = new Date().toISOString();

        const campaign = campaigns.find(c => c.id === run.campaignId);
        if (campaign) {
          campaign.status = 'completed';
        }

        logs.unshift({
          id: uuid(),
          type: 'campaign',
          title: 'Campaign Completed',
          description: `Demo completed with ${run.transcript.length} messages`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return HttpResponse.json(run);
  }),

  http.post('/api/campaigns/:runId/pause', async ({ params }) => {
    await delay(200);
    const run = campaignRuns.get(params.runId as string);

    if (!run) {
      return new HttpResponse(null, { status: 404 });
    }

    run.status = 'paused';
    return HttpResponse.json(run);
  }),

  http.post('/api/campaigns/:runId/stop', async ({ params }) => {
    await delay(200);
    const run = campaignRuns.get(params.runId as string);

    if (!run) {
      return new HttpResponse(null, { status: 404 });
    }

    run.status = 'completed';
    run.completedAt = new Date().toISOString();

    const campaign = campaigns.find(c => c.id === run.campaignId);
    if (campaign) {
      campaign.status = 'completed';
    }

    return HttpResponse.json(run);
  }),

  // Logs
  http.get('/api/logs', async () => {
    await delay(200);
    return HttpResponse.json(logs);
  }),
];
