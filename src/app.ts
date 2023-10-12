import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError } from './errors/notFound.error';
import { errorHanlder } from './middleware/error.middleware';
import { authRoute } from './routes/auth.route';
import cookieParser from 'cookie-parser';

const app = express();

//settings
app.set('trust proxy', true); //because the express server is behind ingress and it need to trust the proxy
app.use(cookieSession( {signed: false, secure: process.env.NODE_ENV !== 'test'} ))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//routes
app.use('/api/auth', authRoute)
app.all('*', async () => { throw new NotFoundError() });

//error handling
app.use(errorHanlder);

export { app }