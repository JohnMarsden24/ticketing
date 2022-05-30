import { TicketCreatedListener } from './events/ticket-created-listener';
import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('connected to nats');

  client.on('close', () => {
    console.log('shutting down');

    process.exit();
  });

  new TicketCreatedListener(client).listen();
});

// @ts-ignore
process.on('SIGINT', () => client.close());
// @ts-ignore
process.on('SIGTERM', () => client.close());
