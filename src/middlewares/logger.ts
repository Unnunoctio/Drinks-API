import type { Request, Response, NextFunction } from 'express'

export const customLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()
  const { method, url } = req

  res.on('finish', () => {
    const ms = Date.now() - start
    const { statusCode } = res
    console.log(`  --> ${method} ${url} ${statusCode} ${ms}ms`)
  })
  next()
}
