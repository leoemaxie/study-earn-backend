import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fileRoute from './routes/file.route';
import authMiddleware from './middlewares/auth.middleware';

const app = express();
const VERSION = process.env.VERSION || 'v1';
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(authMiddleware);
app.use(`/api/${VERSION}/file`, fileRoute);

app.use((req, res) => {
  res.status(404).json({error: 'Not Found'});
});

app.listen(process.env.PORT || 3003, () => {
  console.log(`Server running on port ${process.env.PORT || 3003}`);
});
