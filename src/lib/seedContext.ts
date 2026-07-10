import { SESSIONS } from '../data/sessions'

export function buildChatContext(): string {
  return JSON.stringify({ sessions: SESSIONS }, null, 0)
}
