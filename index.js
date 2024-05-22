import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import drinksRouterV1 from './routes/v1/drinks.js'
import brandRouterV1 from './routes/v1/brand.js'
import madeInRouterV1 from './routes/v1/made-in.js'
import categoryRouterV1 from './routes/v1/category.js'

// Configure dotEnv
dotenv.config()

// Configure Database
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Error connecting to database', err))

// Configure Express
const app = express()
app.disable('x-powered-by')

// Configure Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.use((_, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.sendResponse = (data) => {
    res.send(JSON.stringify(data, null, 2))
  }
  next()
})

app.use((req, _, next) => {
  const parsedQuery = Object.fromEntries(
    Object.entries(req.query).map(([key, value]) => {
      if (value === 'true' || value === 'false') {
        return [key, value === 'true']
      } else if (!isNaN(value) && value !== '') {
        return [key, Number(value)]
      } else {
        return [key, value]
      }
    })
  )
  req.parsedQuery = parsedQuery
  next()
})

// Configure Routes
app.use('/api/v1', drinksRouterV1)
app.use('/api/v1', brandRouterV1)
app.use('/api/v1', madeInRouterV1)
app.use('/api/v1', categoryRouterV1)

// Global Error Handler
app.use((_, res) => res.status(404).send('Error 404: Not Found'))

// Start Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server started')
})
