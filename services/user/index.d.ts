import User from './src/models/User.model';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
