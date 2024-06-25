import { ErrorCode } from './enum'

export const getErrorCodeByStatusCode = (statusCode: number): ErrorCode => {
  switch (statusCode) {
    case 400:
      return ErrorCode.BAD_REQUEST
    case 401:
      return ErrorCode.UNAUTHORIZED
    case 403:
      return ErrorCode.FORBIDDEN
    case 404:
      return ErrorCode.NOT_FOUND
    case 405:
      return ErrorCode.METHOD_NOT_ALLOWED
    case 500:
      return ErrorCode.INTERNAL_SERVER_ERROR
    default:
      return ErrorCode.INTERNAL_SERVER_ERROR
  }
}
