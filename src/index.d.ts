import User from '@modlels/user.model';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
