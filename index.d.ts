import User from './src/models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
