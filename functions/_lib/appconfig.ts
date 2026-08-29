/**
 * The only file that changes when the auth kit is ported to a new app.
 * See RedAnvil/design-system/auth-kit/README.md.
 */
export type AppConfig = {
  name: string
  cookieName: string
  brandColor: string
  textColor: string
  mutedColor: string
  // This app shares fleet-shared-db with social-pulse and yt-intel-one. The scope
  // is what keeps the three user bases separate; without it, registering on one
  // would hand you an account on the others.
  scope: 'agent-tower',
  accountPurpose: string
}

export const APP: AppConfig = {
  name: 'Agent Tower',
  // Unique per app: a shared cookie name under *.pages.dev would let one app
  // receive another app's session.
  cookieName: 'agenttower_session',
  brandColor: '#2563eb',
  textColor: '#1e2a40',
  mutedColor: '#6b7280',
  // This app shares fleet-shared-db with social-pulse and yt-intel-one. The scope
  // is what keeps the three user bases separate; without it, registering on one
  // would hand you an account on the others.
  scope: 'agent-tower',
  accountPurpose:
    'You received this because you have an Agent Tower workspace. Costs shown come from your own recorded sessions.',
}
