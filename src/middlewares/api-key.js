import { API_KEY } from '../config'

export const verifyApiKey = async (c, next) => {
  const apiKey = c.req.header('x-api-key')
  if (apiKey !== API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
}
