import {Publisher, OrderCreatedEvent, Subjects} from '@ds99ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}