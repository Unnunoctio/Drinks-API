import { Hono } from 'hono'
import mongoose from 'mongoose'
import { DB_URI } from './config'
import { prettyJSON } from 'hono/pretty-json'
import { customLogger } from './middlewares/logger'
import { formatResponse } from './middlewares/response'
import drinkRoutes from './routes/drink-routes'

// TODO: Connect to MongoDB
try {
  await mongoose.connect(DB_URI)
  console.log('Database connected')
} catch (error) {
  console.log('Error connecting to database', error)
  process.exit(1)
}

// TODO: Start Hono
const app = new Hono()

// TODO: Middlewares
app.use(prettyJSON())
app.use('*', customLogger)
app.use('*', formatResponse)

// TODO: Routes
app.route('/api/v3', drinkRoutes)

app.notFound((c) => {
  return c.json({
    error: 'The requested route does not exist in this API'
  }, 404)
})

export default app
