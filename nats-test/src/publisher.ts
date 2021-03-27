import nats from 'node-nats-streaming';
import {TickedCreatedPublisher} from './events/ticketed-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log("Publisher connected to NATS");

    const publisher = new TickedCreatedPublisher(stan);
    try{
        await publisher.publish({
            id: '456',
            title: 'Elvis Concert',
            price: 20
        });
    }catch(err){
        console.error(err);
    }
});

