import 'dotenv/config';
import 'module-alias/register';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import authRoute from '@routes/auth.route';
import userRoute from '@routes/user.route';
import schoolRoute from '@routes/school.route';
import authMiddleware from '@middlewares/auth.middleware';
import initializeDatabase from '@db/postgres';
import errorMiddleware from '@middlewares/error.middleware';
import {Server} from 'socket.io';
import {connectIO} from './chat';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};
const VERSION = process.env.VERSION || 'v1';

(async () => {
  (await initializeDatabase)
    .sync({alter: true})
    .then(() => console.log('Database synced'))
    .catch(console.error);
})();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use('/auth', authRoute);
app.use(`/api/${VERSION}/user`, authMiddleware, userRoute);
app.use(`/api/${VERSION}/chat`, authMiddleware, () => {
  connectIO(io);
});
app.use(`/api/${VERSION}/school`, schoolRoute);
app.use(errorMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({status: 'ok'});
});
app.use((req, res) => {
  res.status(404).json({error: 'Not found'});
});

httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
