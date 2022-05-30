import { TicketCratedPublisher } from './events/ticket-created-publisher';
import nats from 'node-nats-streaming';

console.clear();

const client = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// @ts-ignore
client.on('connect', async () => {
  console.log('connected to nats');

  const publisher = new TicketCratedPublisher(client);

  await publisher.publish({
    id: 'argh',
    title: 'dinner',
    price: 40,
  });
});
