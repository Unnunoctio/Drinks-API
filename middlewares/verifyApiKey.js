const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).sendResponse({ error: { message: 'Unauthorized' } })
  }
  next()
}

export default verifyApiKey
