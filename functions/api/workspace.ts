/** /api/workspace — signed-in monthly budget and tracked agent sessions. */
import { z } from 'zod'
import type { FnCtx } from '../_lib/types'
import { getSession } from '../_lib/auth'
import { json } from '../_lib/http'
import { parseBody } from '../_lib/validate'

/** $20/day × 30 days, matching the fleet demo's DAILY_BUDGET_USD. */
const DEFAULT_MONTHLY_BUDGET_CENTS = 60_000

/** Upper bound so a bad client cannot store an absurd cap. */
const MAX_MONTHLY_BUDGET_CENTS = 10_000_000

/** Catalog ids are short slugs such as s1 — not auth session cookie ids. */
const sessionIdSchema = z
  .string()
  .trim()
  .min(1, 'Choose a session to track.')
  .max(64, 'That session id is too long.')
  .regex(/^[a-zA-Z0-9_-]+$/, 'That session id is not valid.')

const putSchema = z.object({
  monthlyBudgetCents: z
    .number({ invalid_type_error: 'Enter a whole number of cents.' })
    .int('Enter a whole number of cents.')
    .min(0, 'Budget cannot be negative.')
    .max(MAX_MONTHLY_BUDGET_CENTS, 'Budget is too large.'),
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be a 3-letter code.')
    .transform((value) => value.toUpperCase())
    .optional(),
})

const trackSchema = z.object({ sessionId: sessionIdSchema })

export type WorkspaceBody = {
  monthlyBudgetCents: number
  currency: string
  trackedSessionIds: string[]
}

/**
 * Require a signed-in user. Returns 401 JSON when the cookie is missing or stale.
 */
async function requireUser(env: FnCtx['env'], request: Request) {
  const session = await getSession(env, request)
  if (!session) return { ok: false as const, response: json({ error: 'Sign in to manage your workspace.' }, 401) }
  return { ok: true as const, session }
}

/**
 * Insert a default workspace row when this user has never saved one.
 */
async function ensureWorkspace(env: FnCtx['env'], userId: string): Promise<void> {
  const now = Date.now()
  await env.DB.prepare(
    `insert or ignore into workspace (user_id, monthly_budget_cents, currency, created_at, updated_at)
     values (?, ?, 'USD', ?, ?)`,
  )
    .bind(userId, DEFAULT_MONTHLY_BUDGET_CENTS, now, now)
    .run()
}

/**
 * Load the caller's workspace and tracked catalog ids. Always scoped to user_id.
 */
async function loadWorkspace(env: FnCtx['env'], userId: string): Promise<WorkspaceBody> {
  await ensureWorkspace(env, userId)
  const row = await env.DB.prepare(
    `select monthly_budget_cents as monthlyBudgetCents, currency
       from workspace
      where user_id = ?`,
  )
    .bind(userId)
    .first<{ monthlyBudgetCents: number; currency: string }>()

  const tracked = await env.DB.prepare(
    `select session_id as sessionId
       from tracked_sessions
      where user_id = ?
      order by tracked_at`,
  )
    .bind(userId)
    .all<{ sessionId: string }>()

  return {
    monthlyBudgetCents: row?.monthlyBudgetCents ?? DEFAULT_MONTHLY_BUDGET_CENTS,
    currency: row?.currency ?? 'USD',
    trackedSessionIds: (tracked.results ?? []).map((item) => item.sessionId),
  }
}

/** GET /api/workspace — current budget and tracked session ids. */
export async function onRequestGet({ request, env }: FnCtx) {
  const auth = await requireUser(env, request)
  if (!auth.ok) return auth.response
  return json(await loadWorkspace(env, auth.session.userId))
}

/** PUT /api/workspace — set monthly budget (cents) and optional currency. */
export async function onRequestPut({ request, env }: FnCtx) {
  const auth = await requireUser(env, request)
  if (!auth.ok) return auth.response
  const parsed = await parseBody(request, putSchema)
  if (!parsed.ok) return parsed.response

  await ensureWorkspace(env, auth.session.userId)
  const now = Date.now()
  if (parsed.data.currency) {
    await env.DB.prepare(
      `update workspace
          set monthly_budget_cents = ?, currency = ?, updated_at = ?
        where user_id = ?`,
    )
      .bind(parsed.data.monthlyBudgetCents, parsed.data.currency, now, auth.session.userId)
      .run()
  } else {
    await env.DB.prepare(
      `update workspace
          set monthly_budget_cents = ?, updated_at = ?
        where user_id = ?`,
    )
      .bind(parsed.data.monthlyBudgetCents, now, auth.session.userId)
      .run()
  }
  return json(await loadWorkspace(env, auth.session.userId))
}

/** POST /api/workspace { sessionId } — start tracking a catalog session. */
export async function onRequestPost({ request, env }: FnCtx) {
  const auth = await requireUser(env, request)
  if (!auth.ok) return auth.response
  const parsed = await parseBody(request, trackSchema)
  if (!parsed.ok) return parsed.response

  await ensureWorkspace(env, auth.session.userId)
  await env.DB.prepare(
    `insert or ignore into tracked_sessions (user_id, session_id, tracked_at)
     values (?, ?, ?)`,
  )
    .bind(auth.session.userId, parsed.data.sessionId, Date.now())
    .run()
  return json(await loadWorkspace(env, auth.session.userId))
}

/** DELETE /api/workspace?sessionId= — stop tracking a catalog session. */
export async function onRequestDelete({ request, env }: FnCtx) {
  const auth = await requireUser(env, request)
  if (!auth.ok) return auth.response
  const sessionId = new URL(request.url).searchParams.get('sessionId') ?? ''
  const parsed = sessionIdSchema.safeParse(sessionId)
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? 'Choose a session to untrack.' }, 400)
  }

  await env.DB.prepare('delete from tracked_sessions where user_id = ? and session_id = ?')
    .bind(auth.session.userId, parsed.data)
    .run()
  return json(await loadWorkspace(env, auth.session.userId))
}
