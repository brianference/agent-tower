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
  accountPurpose:
    'You received this because you have an Agent Tower workspace. Costs shown come from your own recorded sessions.',
}
