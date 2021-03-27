import mongoose from 'mongoose';
import {OrderCancelledListener} from '../order-cancelled-listener';
import {OrderCancelledEvent, OrderStatus} from '@ds99ticketing/common';
import {natsWrapper} from '../../../nats-wrapper';
import {Message, version} from 'node-nats-streaming';
import {Order} from '../../../models/order';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: 'abc',
        status: OrderStatus.Created,
        price: 20
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: 'abc'
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, data, msg, order}

};

it('updates the status of the order', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.status).toEqual(OrderStatus.Cancelled);
   
});

it('listener acks the event', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
})