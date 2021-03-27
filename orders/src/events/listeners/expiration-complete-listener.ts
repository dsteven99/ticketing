import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompeteEvent } from '@ds99ticketing/common';
import { Order, OrderStatus } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import {OrderCancelledPublisher} from '../publisher/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompeteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompeteEvent['data'], msg: Message) {
       
        const order = await Order.findById(data.orderId).populate('ticket');
        
        if(!order){
            throw new Error('Order not found');
        }

        if(order.status === OrderStatus.Complete){
            return msg.ack();
        }
        
        order.set({
            status: OrderStatus.Cancelled
        });
        
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();

    }
}
