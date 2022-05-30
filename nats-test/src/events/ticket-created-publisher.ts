import { Publisher } from './base-publisher';
import { TicketCratedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCratedPublisher extends Publisher<TicketCratedEvent> {
  readonly subject = Subjects.TicketCreated;
}
