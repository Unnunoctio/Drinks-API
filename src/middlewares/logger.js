export const customLogger = async (c, next) => {
  const start = Date.now()
  const { method, url } = c.req

  await next()

  const ms = Date.now() - start
  const status = c.res.status
  console.log(`  --> ${method} ${url} ${status} ${ms}ms`)
}
