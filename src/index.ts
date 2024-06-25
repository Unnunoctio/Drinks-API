import express from 'express'
import { PORT } from './config'
import { customLogger } from './middlewares/logger'

// TODO: Configure Express
const app = express()
app.disable('x-powered-by')

// TODO: Configure Middlewares
app.use(express.json())
app.use(customLogger)

// TODO: Configure Routes

// TODO: Handler not found route
app.use((_, res) => {
  return res.status(404).send({
    error: 'The requested route does not exist in this API'
  })
})

// TODO: Start Server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})
