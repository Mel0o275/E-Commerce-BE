import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe"

import { Request } from "express";

@Injectable()
export class PaymentService {
    private stripe!: Stripe
    constructor(
        private readonly configService: ConfigService
    ) {
        this.stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY") as string)
    }

    async checkout(
        { customer_email,
            metadata = {},
            cancel_url = this.configService.get("cancel_url" as string),
            success_url = this.configService.get("success_url" as string),
            discounts = [],
            mode = "payment",
            line_items }: Stripe.Checkout.SessionCreateParams
    ) {
        const session = await this.stripe.checkout.sessions.create({
            customer_email,
            metadata,
            cancel_url,
            success_url,
            discounts,
            mode,
            line_items
        })
        return session
    }

    async createCopoun(
        data: Stripe.CouponCreateParams
    ) {
        return this.stripe.coupons.create(data)
    }

    async createPaymentMethod(token: string) {
        return await this.stripe.paymentMethods.create({
            type: "card",
            card: {
                token
            }
        })
    }

    async createPaymentIntent(data: Stripe.PaymentIntentCreateParams) {
        return await this.stripe.paymentIntents.create(data)
    }

    async webHook(req: Request): Promise<Stripe.Event> {
        return this.stripe.webhooks.constructEvent(
            (req as any).rawBody,
            req.headers['stripe-signature'] as string,
            this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
        );
    }

    async createRefund(paymentIntent: string, amount?: number) {
        return await this.stripe.refunds.create({
            payment_intent: paymentIntent,
            ...(amount && {
                amount: amount * 100,
            }),
            metadata: {
                paymentIntent,
            },
        });
    }
}