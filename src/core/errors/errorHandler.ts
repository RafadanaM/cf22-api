import { Elysia } from 'elysia';
import { NotFoundError } from './errors';

const errorHandler = new Elysia({ name: 'error-handler' })
  .error({
    NOT_FOUND: NotFoundError
  })
  .onError({ as: 'global' }, ({ code, error, status }) => {
    switch (code) {
      case 'VALIDATION':
        return status(400, {
          message: 'Bad Request',
          details: error.all
        });
      case 'NOT_FOUND':
        return status(404, {
          name: error.name,
          message: error.message || 'Route Not Found'
        });
      case 'PARSE':
        return status(400, {
          message: 'Parsing Error'
        });

      case 'INVALID_FILE_TYPE':
        return status(400, {
          message: 'Invalid File Type'
        });

      case 'INVALID_COOKIE_SIGNATURE':
        return status(400, {
          message: 'Invalid Cookie Signature'
        });

      case 'INTERNAL_SERVER_ERROR':
        return status(500, {
          message: 'Internal Server Error'
        });
      case 'UNKNOWN':
        return status(500, {
          message: 'Unknown Error'
        });
      default:
        return status(500, {
          message: 'Unknown Error'
        });
    }
  });

export default errorHandler;
