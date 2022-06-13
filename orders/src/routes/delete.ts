import { requireAuth, NotFoundError } from '@jm24tickets/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order || order.userId !== req.currentUser!.id) {
      throw new NotFoundError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
