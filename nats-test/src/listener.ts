import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// @ts-ignore
client.on('connect', () => {
  console.log('connected to nats');

  // @ts-ignore
  client.on('close', () => {
    console.log('shutting down');

    // @ts-ignore
    process.exit();
  });

  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');
  /**
   * Queue groups prevent multiple subscribers from getting the same event
   */
  const subscription = client.subscribe(
    'ticket:created',
    'queue-group-name',
    options
  );

  // @ts-ignore
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`received event ${msg.getSequence()} with data: ${data}`);
    }

    msg.ack();
  });
});

// @ts-ignore
process.on('SIGINT', () => client.close());
// @ts-ignore
process.on('SIGTERM', () => client.close());
