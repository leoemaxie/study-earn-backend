export default class CustomError extends Error {
  status: number;
  constructor(message: string, status: number, name?: string) {
    super(message);
    this.name = name ? name : this.constructor.name;
    this.status = status;
  }
}

export class ServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class BadRequest extends CustomError {
  constructor(message = 'Bad Request', name?: string) {
    super(message, 400, name);
  }
}

export class Conflict extends CustomError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class Unauthorized extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'AuthenticationError');
  }
}

export class Forbidden extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFound extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class UnprocessableEntity extends CustomError {
  constructor(message = 'Unprocessable Entity') {
    super(message, 422);
  }
}
