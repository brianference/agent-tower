import { SESSIONS } from './data'
export function seedContext(): string {
  return JSON.stringify({ sessions: SESSIONS }, null, 0)
}
