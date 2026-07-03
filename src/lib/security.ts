/**
 * Layer 3 – Application Security: input sanitization & rate limiting
 * Layer 4 – Data Protection: environment validation
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;',
}
const ENTITY_RE = /[&<>"'/]/g

export function sanitize(input: string): string {
  return input.replace(ENTITY_RE, (ch) => HTML_ENTITIES[ch] || ch).trim()
}

export function sanitizeFormData<T extends Record<string, string>>(data: T): T {
  const clean = {} as T
  for (const key in data) {
    clean[key] = sanitize(data[key]) as T[typeof key]
  }
  return clean
}

const submissions = new Map<string, number[]>()

export function checkRateLimit(key: string, maxPerWindow = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const timestamps = (submissions.get(key) ?? []).filter((t) => now - t < windowMs)
  if (timestamps.length >= maxPerWindow) return false
  timestamps.push(now)
  submissions.set(key, timestamps)
  return true
}

export function validateEnv(): void {
  const required = ['VITE_SANITY_PROJECT_ID']
  const missing = required.filter((k) => !import.meta.env[k])
  if (missing.length && import.meta.env.DEV) {
    console.warn(`[Security] Missing env vars: ${missing.join(', ')}. Copy .env.example to .env`)
  }
}

export function printConsoleWarning(): void {
  if (import.meta.env.DEV) return
  console.log(
    '%c⚠ ATTENTION',
    'color:#e06a6a;font-size:28px;font-weight:bold',
  )
  console.log(
    '%cCet espace est réservé aux développeurs. Ne collez jamais de code ici — cela pourrait compromettre votre compte.',
    'color:#f3f4f1;font-size:14px',
  )
}
