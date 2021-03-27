import request from 'supertest';
import { idText } from 'typescript';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    return ticket;
}

it('fetches order for a user', async () => {
    const tic1 = await buildTicket();
    const tic2 = await buildTicket();
    const tic3 = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: tic1.id })
        .expect(201);
    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: tic2.id })
        .expect(201);
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: tic3.id })
        .expect(201);

    //Make a request to get orders as user 2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .send()
        .expect(200);
    
    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);

    expect(response.body[0].ticket.id).toEqual(tic2.id);
    expect(response.body[1].ticket.id).toEqual(tic3.id);
});