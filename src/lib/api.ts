import axios from 'axios';

export const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Agent {
  id: string;
  name: string;
  language: string;
  description: string;
  flowSteps: FlowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface FlowStep {
  id: string;
  type: 'prompt' | 'intent';
  content: string;
  order: number;
}

export interface Campaign {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
  status: 'idle' | 'running' | 'completed' | 'paused';
  createdAt: string;
}

export interface CampaignRun {
  id: string;
  campaignId: string;
  agentName: string;
  status: 'running' | 'completed' | 'paused';
  transcript: TranscriptMessage[];
  startedAt: string;
  completedAt?: string;
}

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  type: 'agent' | 'campaign' | 'system';
  title: string;
  description: string;
  timestamp: string;
}

export interface Stats {
  agents: number;
  campaigns: number;
  logs: number;
}
