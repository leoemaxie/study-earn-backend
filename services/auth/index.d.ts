import {IUser} from './src/db/schema/user.schema';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: IUser;
  }
}
