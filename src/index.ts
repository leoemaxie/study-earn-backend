import 'dotenv/config';
import 'module-alias/register';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import authRoute from '@routes/auth.route';
import userRoute from '@routes/user.route';
import schoolRoute from '@routes/school.route';
import chatRoute from '@routes/chat.route';
import fileRoute from '@routes/file.route';
import studentRoute from '@routes/student.route';
import authMiddleware from '@middlewares/auth.middleware';
import initializeDatabase from '@db/postgres';
import errorMiddleware from '@middlewares/error.middleware';
import {Server} from 'socket.io';
import {connectIO} from './chat/socket';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'POST,GET,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};
const VERSION = process.env.VERSION || 'v1';
const BASE_URL = `/api/${VERSION}`;

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
connectIO(io);
app.use('/auth', authRoute);
app.use(`${BASE_URL}/user`, authMiddleware, userRoute);
app.use(`${BASE_URL}/school`, schoolRoute);
app.use(`${BASE_URL}/chat`, authMiddleware, chatRoute);
app.use(`${BASE_URL}/file`, authMiddleware, fileRoute);
app.use(`${BASE_URL}/student`, authMiddleware, studentRoute);
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
