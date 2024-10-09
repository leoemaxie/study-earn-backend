import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import errorMiddleware from './middlewares/error.middleware';
import authMiddleware from './middlewares/auth.middleware';
import {connect} from 'mongoose';
import startAuthConsumer from './queues/auth.consumer.queue';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth';
const VERSION = process.env.VERSION || 'v1';
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

(async () => {
  try {
    await connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB');
  }
})();

startAuthConsumer();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use('/auth', authRoute);
app.use(`/api/${VERSION}`, authMiddleware, userRoute);
app.use(errorMiddleware);
app.use((req, res) => {
  res.status(404).json({error: 'Not found'});
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
