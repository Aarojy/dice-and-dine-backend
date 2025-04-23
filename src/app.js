import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.use('/api/v1', api);
app.use('/uploads', express.static('uploads'));

export default app;
