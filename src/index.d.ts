import User from '@modlels/user.model';
import {IUser} from '@schemas/user.schema';
import {IncomingMessage} from 'http';

declare module 'http' {
  export interface IncomingMessage {
    user?: IUser;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
