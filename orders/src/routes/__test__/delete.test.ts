import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import {OrderStatus, Order} from '../../models/order'
import {natsWrapper} from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const user = global.signin();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    const response = await request(app)
        .delete('/api/orders/' + order.id)
        .set('Cookie', user)
        .send()
        .expect(204);
    
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const user = global.signin();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    const response = await request(app)
        .delete('/api/orders/' + order.id)
        .set('Cookie', user)
        .send()
        .expect(204);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
});