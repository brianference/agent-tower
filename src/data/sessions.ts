/** Demo fleet sessions for Agent Tower. */
export const SESSIONS = [
  {
    "id": "s1",
    "name": "planner-main",
    "model": "gpt-4o-mini",
    "status": "active",
    "tokensIn": 18240,
    "tokensOut": 6310,
    "costUsd": 0.42,
    "contextPct": 61
  },
  {
    "id": "s2",
    "name": "research-scout",
    "model": "gpt-4o",
    "status": "warning",
    "tokensIn": 92000,
    "tokensOut": 12040,
    "costUsd": 3.18,
    "contextPct": 88
  },
  {
    "id": "s3",
    "name": "code-fixer",
    "model": "claude-sonnet",
    "status": "idle",
    "tokensIn": 4100,
    "tokensOut": 900,
    "costUsd": 0.11,
    "contextPct": 22
  },
  {
    "id": "s4",
    "name": "nightly-cron",
    "model": "gpt-4o-mini",
    "status": "danger",
    "tokensIn": 210000,
    "tokensOut": 44000,
    "costUsd": 8.92,
    "contextPct": 95
  },
  {
    "id": "s5",
    "name": "support-triage",
    "model": "gpt-4o-mini",
    "status": "active",
    "tokensIn": 12000,
    "tokensOut": 4000,
    "costUsd": 0.29,
    "contextPct": 40
  }
] as const

export type AgentSession = (typeof SESSIONS)[number]
export const DAILY_BUDGET_USD = 20
