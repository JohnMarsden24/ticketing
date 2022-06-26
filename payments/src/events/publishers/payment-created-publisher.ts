import { Publisher, PaymentCreatedEvent, Subjects } from '@jm24tickets/common';

export class PaymentCreatedPublished extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
