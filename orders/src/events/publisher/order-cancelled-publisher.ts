import {Publisher, OrderCancelledEvent, Subjects} from '@ds99ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}