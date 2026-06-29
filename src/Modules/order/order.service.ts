import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/common/interface/user.interface';
import { productRepo } from 'src/common/repo/product.repo';
import { orderRepo } from 'src/common/repo/order.repo';
import { cartRepo } from 'src/common/repo/cart.repo';
import { copounRepo } from 'src/common/repo/copoun.repo';
import { ICopoun } from 'src/common/interface/copoun.interface';
import { IOrderProduct } from 'src/common/interface/order.interface';
import { OrderStatuesEnum } from 'src/common/enum/order.enum';
import { PaymentService } from 'src/common/services/stripe.service';
import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    private readonly productRepo: productRepo,
    private readonly orderRepo: orderRepo,
    private readonly cartRepo: cartRepo,
    private readonly copounRepo: copounRepo,
    private readonly paymentServive: PaymentService
  ) { }
  async create(
    { address, currency, phone, couponName, note }: CreateOrderDto,
    user: IUser,
  ) {
    const cart = await this.cartRepo.findOne({ userId: user._id });

    if (!cart?.products?.length) {
      throw new NotFoundException('Cart is Empty');
    }

    let coupon: any;
    let discountPercentage = 0;

    if (couponName) {
      coupon = await this.copounRepo.findOne({ name: couponName });

      if (!coupon) {
        throw new NotFoundException('Coupon Not Found');
      }

      const now = new Date();

      if (coupon.startDate > now || coupon.endDate < now) {
        throw new BadRequestException('Coupon Expired');
      }
    }

    const products: IOrderProduct[] = [];
    let subtotal = 0;

    for (const item of cart.products) {
      const product = await this.productRepo.findById(item.productId as unknown as string);

      if (!product) {
        throw new NotFoundException('Product Not Found');
      }

      const total = product.price * item.quantity;

      subtotal += total;

      products.push({
        productId: product._id as any,
        quantity: item.quantity,
        unitAmount: product.price,
        total,
      });
    }

    let total = subtotal;
    if (coupon) {
      if (coupon.percentage) {
        discountPercentage = coupon.percentage;

        total -= subtotal * coupon.percentage / 100;
      }

      if (coupon.amount) {
        discountPercentage = (coupon.amount / total) * 100
        total -= coupon.amount;
      }
    }

    total = Math.max(total, 0);

    const order = await this.orderRepo.create({
      OrderId: crypto.randomUUID(),

      address,
      phone,
      note,

      currency,

      subtotal,
      total,
      discountPercentage,

      products: products as any,

      createdBy: user._id,
      updatedBy: user._id,
    });

    await this.cartRepo.findOneAndUpdate(
      { _id: cart._id },
      {
        products: [],
      },
    );

    return order;
  }

  async confirm(orderId: string, user: IUser) {

    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    if (order.status !== OrderStatuesEnum.PENDING) {
      throw new BadRequestException(
        'Only pending orders can be confirmed',
      );
    }

    await this.orderRepo.findOneAndUpdate(
      { _id: orderId },
      {
        status: OrderStatuesEnum.PLACED,
        updatedBy: user._id,
      },
    );

    return {
      message: 'Order confirmed successfully',
    };
  }

  async CheckOut(orderId: string, user: IUser) {

    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new NotFoundException("Order Not Found");
    }

    if (
      order.status !== OrderStatuesEnum.PLACED ||
      order.paidAt
    ) {
      throw new BadRequestException(
        "Only placed orders can checkout",
      );
    }

    const lineItems: any[] = [];

    let discounts: any[] = [];

    if (order.discountPercentage > 0) {
      const copoun = await this.paymentServive.createCopoun({
        percent_off: order.discountPercentage,
        duration: "once",
        currency: order.currency
      })

      discounts.push({ coupon: copoun.id })
    }

    for (const prod of order.products) {

      const product = await this.productRepo.findById(
        prod.productId.toString(),
      );

      if (!product) {
        throw new NotFoundException('Product Not Found');
      }

      lineItems.push({
        quantity: prod.quantity,
        price_data: {
          currency: order.currency.toLowerCase(),
          product_data: {
            name: product.name,
          },
          unit_amount: prod.unitAmount * 100,
        },
      });

    }

    const session = await this.paymentServive.checkout({
      customer_email: user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      line_items: lineItems,
      discounts
    });

    await this.orderRepo.findOneAndUpdate(
      { _id: orderId },
      {
        sessionId: session.id,
      },
    );


    return {
      url: session.url,
    };
  }

async webHook(req: Request) {

  const event = await this.paymentServive.webHook(req);

  switch (event.type) {

    case "checkout.session.completed": {

      const session = event.data.object as Stripe.Checkout.Session;

      const { orderId } = session.metadata as {
        orderId: string;
      };

      await this.orderRepo.findOneAndUpdate(
        { _id: orderId },
        {
          status: OrderStatuesEnum.PAID,
          paidAt: new Date(),
          intentId: session.payment_intent,
        },
      );

      break;
    }

    case "charge.refunded": {

      const charge = event.data.object as Stripe.Charge;

      const paymentIntent = charge.payment_intent as string;

      await this.orderRepo.findOneAndUpdate(
        {
          intentId: paymentIntent,
        },
        {
          status: OrderStatuesEnum.REFUNDED,
          refundedAt: new Date(),
        },
      );

      break;
    }

    default:
      break;
  }

  return {
    received: true,
  };
}

  async refund(orderId: string, user: IUser) {

    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new NotFoundException("Order Not Found");
    }

    if (order.status !== OrderStatuesEnum.PAID) {
      throw new BadRequestException("Order isn't paid");
    }

    if (!order.intentId) {
      throw new BadRequestException("Payment Intent Missing");
    }

    if (order.refundedAt) {
      throw new BadRequestException("Order already refunded");
    }

    await this.paymentServive.createRefund(order.intentId);

    return {
      message: "Refund request sent successfully",
    };
  }

}
