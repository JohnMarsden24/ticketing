import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@jm24tickets/common';
import mongoose from 'mongoose';

import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: '1234',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    order,
    data,
    message,
  };
};

it('updates the order status to cancelled', async () => {
  const { data, listener, message, order } = await setup();

  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { data, listener, message, order } = await setup();

  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
