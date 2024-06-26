import express from 'express'
import mongoose from 'mongoose'
import { DB_URI, PORT } from './config'
import { customLogger, formatResponse, parseQuery } from './middlewares'

// TODO: Configure Database
try {
  await mongoose.connect(DB_URI as string)
  console.log('Database connected')
} catch (error) {
  console.log('Error connecting to database', error)
  process.exit(1)
}

// TODO: Configure Express
const app = express()
app.disable('x-powered-by')

// TODO: Configure Middlewares
app.use(express.json())
app.use(parseQuery)
app.use(customLogger)
app.use(formatResponse)

// TODO: Configure Routes
app.use('/', (_, res) => {
  return res.json({
    data: 'Welcome to the Drinks API'
  })
})

// TODO: Handler not found route
app.use((_, res) => {
  return res.status(404).json({
    error: 'The requested route does not exist in this API'
  })
})

// TODO: Start Server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})
