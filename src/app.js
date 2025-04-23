import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  8;
  res.send('Welcome to REST API!');
});

app.use('/api/v1', api);
app.use('/uploads', express.static('uploads'));

export default app;
