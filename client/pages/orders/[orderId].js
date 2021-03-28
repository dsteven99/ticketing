import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));

        };
        findTimeLeft();

        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };

    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired</div>;
    }

    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <div>
                <StripeCheckout
                    token={({ id }) => doRequest({ token: id })}
                    stripeKey="pk_test_51IY0SkLTWgcJPUO8Dv3AsEwpzzIG1gNmUcBT1FECiWkIzeylm0zGisGRlX2mkbv1xNDhUpZ4TPMCiYd6awqF8kEQ00PTALsfks"
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
                />
            </div>
            {errors}
        </div>
    )
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderShow;