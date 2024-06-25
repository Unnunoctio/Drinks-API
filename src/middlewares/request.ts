/* eslint-disable @typescript-eslint/no-namespace */
import type { NextFunction, Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      parseQuery: { [k: string]: any }
    }
  }
}

export const parseQuery = (req: Request, _: any, next: NextFunction): void => {
  const parse = Object.fromEntries(
    Object.entries(req.query).map(([key, value]): [string, any] => {
      if (value === 'true' || value === 'false') return [key, value === 'true']
      const num = Number(value)
      return [key, !isNaN(num) && value !== '' ? num : value]
    })
  )

  req.parseQuery = parse
  next()
}
