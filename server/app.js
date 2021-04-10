import express from 'express';
import mongoose from 'mongoose';
import config from './config';

import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const {MONGO_URI} = config;

// routes
import postRoutes from './routes/api/post';
import userRoutes from './routes/api/user';
import authRoutes from './routes/api/auth';


// server의 보안 측면을 보완해주는 라이브러리
app.use(hpp()); // 보안
app.use(helmet()); // 보안
app.use(cors({origin: true, credentials: true})); // 보안
app.use(morgan("dev")); // 로그
app.use(express.json()); // bodyParser

// mongoDB 연결
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
.then(()=> console.log("MONGO DB connecting Success!!"))
.catch((e) => console.log(e));

// Use routes
app.get('/');
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);


export default app;