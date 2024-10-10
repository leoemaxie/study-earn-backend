import User from './src/db/postgres/models/user.model';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
