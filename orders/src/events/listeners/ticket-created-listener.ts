import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@jm24tickets/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;

    const ticket = Ticket.build({
      price,
      title,
      id,
    });

    await ticket.save();

    msg.ack();
  }
}
