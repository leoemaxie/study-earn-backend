export default class CustomError extends Error {
  status: number;
  constructor(message: string, status: number, name?: string) {
    super(message);
    this.name = name ? name : this.constructor.name;
    this.status = status;
  }
}

class ServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

class BadRequest extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class Conflict extends CustomError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class Unauthorized extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'AuthenticationError');
  }
}

class Forbidden extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFound extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export {ServerError, BadRequest, Unauthorized, Forbidden, NotFound, Conflict};
