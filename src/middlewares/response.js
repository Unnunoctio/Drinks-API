export const formatResponse = async (c, next) => {
  await next()

  if (c.res.headers.get('Content-Type') !== 'application/json; charset=UTF-8') return

  const body = await c.res.json()
  const status = await c.res.status
  const isOk = status < 400

  const formatResponse = {
    status: isOk,
    data: body.data,
    error: isOk ? null : { code: status, message: body.error },
    meta: {
      timestamp: new Date().toISOString(),
      version: '3.0',
      pagination: body.pagination
    }
  }
  c.res = c.json(formatResponse)
}
