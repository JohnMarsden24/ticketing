import { Subjects } from './subjects';

export interface TicketCratedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
