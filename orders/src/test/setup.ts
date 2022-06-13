import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => string[];
}

let mongo: any;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'secret';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = () => {
  // Build a JWT payload { id, email }
  const id = new mongoose.Types.ObjectId().toHexString();

  const payload = {
    id,
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session object into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that's the cookie with the encrypted data
  return [`session=${base64}`];
};
