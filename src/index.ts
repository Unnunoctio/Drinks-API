import express from 'express'
import { PORT } from './config'
import { customLogger, formatResponse, parseQuery } from './middlewares'

// TODO: Configure Database

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
