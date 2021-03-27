import {Subjects, Publisher, PaymentCreatedEvent} from '@ds99ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}