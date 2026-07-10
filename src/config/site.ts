import type { SiteConfig } from './types'
export type { SiteConfig, FeatureItem, NavItem } from './types'

export const siteConfig: SiteConfig = {
  productId: 'agent-tower',
  productName: 'Agent Tower',
  kicker: 'Agent Tower · observability for AI fleets',
  tagline: 'See every agent session. Cost, tokens, risk — in one tower.',
  lede: 'Filter by health, open a session drawer, and ask the ops chat which agent is burning budget.',
  githubUrl: 'https://github.com/brianference/agent-tower',
  footerLine: 'Agent Tower · demo telemetry ·',
  stackStrip: 'Stack: TypeScript · React · Vite · Cloudflare Pages · AI ops · GitHub',
  finePrint: 'Wire a real gateway next — UI is built for live session JSON.',
  nav: [
    { to: '/', label: 'Home', end: true },
    { to: '/app', label: 'Fleet' },
    { to: '/features', label: 'Features' },
  ],
  features: [
    { title: 'Session grid', description: 'Active / idle / warning / danger from metric thresholds.' },
    { title: 'Token economics', description: 'Per-agent burn and daily budget progress.' },
    { title: 'Detail drawer', description: 'Inspect one session without leaving the fleet view.' },
    { title: 'Ops chat', description: 'Answers use the metrics table only — no invented numbers.' },
    { title: 'Status filters', description: 'Focus on danger or warning agents in one click.' },
    { title: 'Modular UI', description: 'Fleet cards, drawer, and table are separate modules.' },
  ],
  heroPoints: ['Budget bar', 'Status filters', 'Session drawer', 'Light & dark'],
  ctaPrimary: { to: '/app', label: 'Open fleet' },
  ctaSecondary: { to: '/features', label: 'Features' },
}
