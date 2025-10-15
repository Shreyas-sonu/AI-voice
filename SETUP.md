# VoxFlow Setup Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## What You Can Do

### 1. Dashboard
- View platform statistics (Agents, Campaigns, Logs)
- Quick access to create agents or start demos
- See recent activity

### 2. Create & Manage Agents
- Click "Agents" in the sidebar
- Click the floating "+" button to create a new agent
- Fill in:
  - Agent name
  - Language (English, Spanish, French, etc.)
  - Description
- Edit or configure agents from the table

### 3. Build Agent Flows
- Click the "Play" icon next to any agent
- Add conversation steps:
  - **Prompts**: What the agent says
  - **Intents**: What the agent should understand
- Drag/reorder steps or use arrow buttons
- Click "Save Changes" when done

### 4. Run Campaign Demos
- Click "Campaigns" in the sidebar
- Click "Start Demo" for any campaign
- Watch the live transcript simulation
- Use controls:
  - **Pause**: Pause the conversation
  - **Stop**: End the conversation
  - **Export**: Download transcript as .txt file

### 5. View Activity Logs
- Click "Logs" in the sidebar
- Search and filter activities
- See agent creations, campaign runs, and system events

## Customization

### Change App Name & Branding

Edit `src/config/app.config.ts`:

```typescript
export const APP_CONFIG = {
  name: 'YourAppName',        // Change this
  tagline: 'Your tagline',     // Change this
  description: 'Your description',
  version: '1.0.0',
  author: 'Your Team',
}
```

### Change Color Theme

Edit `src/config/app.config.ts`:

```typescript
export const THEME_CONFIG = {
  primary: '#0A84FF',      // Main brand color
  secondary: '#30D158',    // Secondary accent
  accent: '#FF9F0A',       // Tertiary accent
  // ... more colors
}
```

Popular color schemes:
- **Blue/Green** (default): `primary: '#0A84FF'`, `secondary: '#30D158'`
- **Purple/Pink**: `primary: '#9F7AEA'`, `secondary: '#F687B3'`
- **Orange/Red**: `primary: '#ED8936'`, `secondary: '#FC8181'`
- **Teal/Cyan**: `primary: '#38B2AC'`, `secondary: '#4FD1C5'`

After changing colors, the entire app updates automatically!

## How It Works

### Mock API
The app uses Mock Service Worker (MSW) to simulate a backend:
- All data is stored in memory during your session
- Refresh the page to reset data
- Check `src/mocks/handlers.ts` for mock data logic

### Real-time Transcript
Campaign demos simulate conversations:
- New messages appear every 2 seconds
- Conversation completes after ~13 messages
- Export transcript downloads a .txt file

### Responsive Design
- **Desktop**: Full sidebar + table views
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu + card views

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

## File Structure Quick Reference

```
src/
├── config/
│   └── app.config.ts           # App name & theme colors
├── components/
│   ├── Header.tsx              # Top navigation bar
│   ├── SideNav.tsx             # Left sidebar
│   ├── AgentForm.tsx           # Create/edit agent modal
│   └── TranscriptList.tsx      # Chat-style transcript
├── pages/
│   ├── Dashboard.tsx           # Home page
│   ├── Agents.tsx              # Agent list
│   ├── AgentBuilder.tsx        # Flow editor
│   ├── Campaigns.tsx           # Campaign list
│   ├── CampaignRunner.tsx      # Live demo viewer
│   └── Logs.tsx                # Activity logs
└── mocks/
    └── handlers.ts             # Mock API responses
```

## Tips

1. **Persistent data**: Currently resets on page refresh. To persist data, integrate with a real backend or use localStorage.

2. **Add more languages**: Edit `src/components/AgentForm.tsx`, add to the `languages` array.

3. **Customize transcript messages**: Edit `src/mocks/handlers.ts`, modify the `mockTranscriptLines` array.

4. **Change animation speed**: In `src/mocks/handlers.ts`, change the `refetchInterval` in CampaignRunner.

## Need Help?

- Check browser console for errors
- Ensure all dependencies are installed: `npm install`
- Clear browser cache if seeing stale data
- Verify node version: 16+ required

Enjoy building with VoxFlow!
