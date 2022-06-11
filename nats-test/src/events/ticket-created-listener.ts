import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';
import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.price);
    console.log(data.title);

    msg.ack();
  }
}
