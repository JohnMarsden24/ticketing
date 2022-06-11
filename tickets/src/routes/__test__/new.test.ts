import { natsWrapper } from '../../nats-wrapper';
import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.statusCode).not.toEqual(404);
});

it('has can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is authenticated', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.statusCode).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ price: 10 })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: -10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});

  expect(tickets).toHaveLength(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets).toHaveLength(1);
});

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
