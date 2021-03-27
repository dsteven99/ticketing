import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';


it('fetches the order', async () => {
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
        .get('/api/orders/' + order.id)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(ticket.id);

    
});

it('returns 401 if an unauthorized user trys to access order', async () => {
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

    const unauthorizedUser = global.signin();
    await request(app)
        .get('/api/orders/' + order.id)
        .set('Cookie', unauthorizedUser)
        .send()
        .expect(401);

});