import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import authRoute from './routes/authRoute';
import sequelize from './db/db.config';
import errorMiddleware from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', authRoute);
app.use(errorMiddleware);
app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync({force: true});
  console.log('Database synced');
});
