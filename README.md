# VoxFlow - Voice AI Platform Demo

A complete, responsive, production-grade demo UI for a Voice AI Platform built with React, TypeScript, and Material UI.

## Features

- **Dashboard** - Quick overview with statistics and activity
- **Agents Management** - Create and configure voice AI agents
- **Agent Builder** - Visual conversation flow editor
- **Campaign Runner** - Live transcript simulation with real-time streaming
- **Activity Logs** - Track platform events and activities
- **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **Mock API** - Complete MSW integration for realistic backend simulation

## Tech Stack

- React 18 + TypeScript
- Material UI v5
- React Router for navigation
- React Query for data fetching
- React Hook Form for forms
- MSW (Mock Service Worker) for API mocking
- Framer Motion for animations
- Vite for build tooling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

The application name and theme can be customized in `src/config/app.config.ts`:

```typescript
export const APP_CONFIG = {
  name: 'VoxFlow',
  tagline: 'Voice AI Platform',
  description: 'Build, deploy, and manage intelligent voice agents',
  // ...
}

export const THEME_CONFIG = {
  primary: '#0A84FF',
  secondary: '#30D158',
  // ...
}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── SideNav.tsx
│   ├── AgentForm.tsx
│   └── TranscriptList.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Agents.tsx
│   ├── AgentBuilder.tsx
│   ├── Campaigns.tsx
│   ├── CampaignRunner.tsx
│   └── Logs.tsx
├── config/             # App configuration
│   └── app.config.ts
├── theme/              # MUI theme configuration
│   └── theme.ts
├── lib/                # API and utilities
│   └── api.ts
├── mocks/              # MSW mock handlers
│   ├── handlers.ts
│   └── browser.ts
└── context/            # React context providers
    └── AppProviders.tsx
```

## Features Overview

### Agent Management
- Create voice agents with name, language, and description
- Edit existing agents
- Configure conversation flows visually

### Campaign Demos
- Start simulated campaign runs
- Watch real-time transcript streaming
- Pause, stop, or export conversations
- Professional chat-style UI with animations

### Activity Tracking
- Real-time activity logs
- Search and filter capabilities
- Beautiful timeline interface

## Design

The platform features a modern, professional design inspired by enterprise SaaS applications:

- Clean, minimalist interface
- Professional blue and green color scheme
- Smooth animations and transitions
- Fully responsive across all devices
- Accessible with proper ARIA labels and focus states

## License

MIT
