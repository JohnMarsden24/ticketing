import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

import useRequest from '../../hooks/use-request';

const ShowOrder = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [stripeId, setStripeId] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
      stripeId,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    };

    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft < 0) {
    return <h1>Order expired</h1>;
  }

  return (
    <div>
      <h1>Time left to pay: {timeLeft}</h1>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51IfjsaISXuI7PfXindiblBv1yhMDTaRM112ZHbn0RQNgExuQ01MSH1mmXqzW3ijn4IYv473fq1EEvAfVAzB4OWFF00OMS3qe5N"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.ctx.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    order: data,
  };
};

export default ShowOrder;
