import { CustomError } from './custom-error';

export class NoAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NoAuthorizedError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: 'Not authorized',
      },
    ];
  }
}
