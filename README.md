# Agent Tower

Real-time control tower for AI agents: session health, token burn, budget alerts, and an ops chat grounded on live metrics.

**Live:** https://agent-tower-34v.pages.dev

> Public, no-account portfolio product in the same family as [trip-one](https://trip-one.pages.dev): grounded AI chat, light/dark UI, Cloudflare Pages, secrets server-side.

## What it does

- **Session grid** â€” Active / idle / warning / danger from real metric thresholds.
- **Token economics** â€” Per-agent burn rate and daily budget progress.
- **Ops chat** â€” Ask which agent is expensive â€” answers use the metrics table only.
- **Dark ops UI** â€” Light & dark themes built for long on-call glances.
- **Rate-limit aware API** â€” Cloudflare Functions with health + chat endpoints.
- **Zero-account demo** â€” Explore with seeded fleet data; wire your gateway next.

## Integrations

- **OpenAI / Anthropic metrics** â€” Normalize token + cost across providers
- **OpenClaw / gateway hooks** â€” Pull session lists from your agent runtime
- **Webhooks** â€” Slack/Telegram alerts on burn-rate spikes
- **CSV/JSON export** â€” Finance-friendly cost dumps

## Engineering signals (for recruiters)

- Platform mindset: multi-agent observability & cost control
- Security: secrets server-side, rate limits, CSP headers
- Data viz: burn rates, status chips, live-style refresh
- AI ops: grounded assistant over structured telemetry

## Quick wins

- Connect real OpenClaw/CLI session JSON feed
- Budget caps with hard stop webhooks
- Per-model pricing table (editable)
- Anomaly detection on sudden token spikes

## Stack

- Vite + React 18 + TypeScript (strict)
- React Router
- Cloudflare Pages + Functions (`/api/chat`, `/api/health`)
- OpenAI `gpt-4o-mini` (optional; UI works without it)

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` to `.dev.vars` for Functions:

```
OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini
```

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name agent-tower --branch main
```

Set `OPENAI_API_KEY` on the Pages project for live chat.

`git push` updates GitHub only â€” deploy is a separate step.

## Privacy

No accounts. Chat sends the on-page context + your message to `/api/chat` when AI is configured. No ads, no tracking pixels.

## License

MIT
