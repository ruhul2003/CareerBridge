import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PLAN_PRICE_ID } from '@/lib/stripe';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const planId = formData.get('plan_id');

        console.log("Received planId:", planId); // ← For debugging

        if (!planId) {
            return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
        }

        const priceId = PLAN_PRICE_ID[planId];

        if (!priceId) {
            return NextResponse.json({ 
                error: `Invalid plan ID: ${planId}` 
            }, { status: 400 });
        }

        const origin = request.headers.get('origin') || 
                      process.env.NEXT_PUBLIC_APP_URL || 
                      'http://localhost:3000';

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            metadata: { planId },
            success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/pricing`,
        });

        return NextResponse.redirect(checkoutSession.url, 303);
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { 
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
            }, 
            { status: 500 }
        );
    }
}