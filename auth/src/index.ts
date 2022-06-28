import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@jm24tickets/common';
import { app } from './app';

const start = async () => {
  console.log('starting up!!');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Db connected');
  } catch (error) {
    console.error(error);
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
