import request from 'supertest';

import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 20 });
};

it('returns a list of all tickets', async () => {
  await Promise.all([createTicket(), createTicket(), createTicket()]);

  const response = await request(app).get('/api/tickets').send();

  expect(response.body).toHaveLength(3);
});
