import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import userRoute from './routes/user.route';
import errorMiddleware from './middlewares/error.middleware';
import {authMiddleware} from './middlewares/auth.middleware';
import initializeDatabase from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};
const VERSION = process.env.VERSION || 'v1';

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(`/api/${VERSION}`, authMiddleware, userRoute);

(async () => {
  (await initializeDatabase)
    .sync({alter: true})
    .then(() => console.log('Database synced'))
    .catch(console.error);
})();

app.use(errorMiddleware);
app.use((req, res) => {
  res.status(404).json({error: 'Not found'});
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
