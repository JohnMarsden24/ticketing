import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@jm24tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
