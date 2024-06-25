import type { Response, NextFunction } from 'express'
import { getErrorCodeByStatusCode } from '../utils'

export const formatResponse = (_: any, res: Response, next: NextFunction): void => {
  const originalJson = res.json

  res.json = function (body: any): Response {
    const isOk = res.statusCode < 400
    const response = {
      success: isOk,
      data: body.data,
      error: isOk ? null : { code: getErrorCodeByStatusCode(res.statusCode), details: body.error },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        pagination: body.pagination
      }
    }
    return originalJson.call(this, response)
  }

  next()
}
