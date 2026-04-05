import { rateLimiter } from '@/middlewares/rateLimiter'
import { D1Database, RateLimit } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'

import adminRoutes from '@/routes/admin/index'
import publicRoutes from '@/routes/public/index'

type Bindings = {
    DB: D1Database
    RATE_LIMITER: RateLimit
    ADMIN_API_KEY: string
    INTERNAL_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ============================= MIDDLEWARES =============================

app.use(prettyJSON())

app.use(
    '*',
    cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
        maxAge: 86400,
        credentials: true,
    })
)

app.use('*', rateLimiter())

// ============================= ENDPOINTS =============================

// TODO: Health check
app.get('/', (c) => {
    return c.json({
        message: 'API is running',
        version: '1.0.0',
        endpoints: {
            public: '/v1',
            admin: '/v1/admin',
        },
    })
})

app.route('v1/admin', adminRoutes)
app.route('v1', publicRoutes)

app.notFound((c) => {
    return c.json(
        {
            error: 'The requested route does not exist in this API',
        },
        404
    )
})

export default app
