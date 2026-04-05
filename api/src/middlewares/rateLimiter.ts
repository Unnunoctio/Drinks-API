import { Context, Next } from 'hono'

export const rateLimiter = () => {
    return async (c: Context, next: Next) => {
        const internalKey = c.req.header('X-Internal-Key')
        if (internalKey && internalKey === c.env.INTERNAL_API_KEY) {
            return next()
        }

        const ip = c.req.header('cf-connecting-ip') || 'unknown'

        const { success } = await c.env.RATE_LIMITER.limit({ key: ip })
        if (!success) {
            return c.json(
                {
                    error: 'Too many requests',
                    retryAfter: '60 seconds',
                },
                429
            )
        }

        return next()
    }
}
