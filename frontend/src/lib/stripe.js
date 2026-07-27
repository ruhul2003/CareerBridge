import 'server-only';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',   
});

export const PLAN_PRICE_ID = {
    seeker_pro: 'price_1TigWuGPo8ovmLPMiejRE4L6',
    seeker_premium: 'price_1Tj1uPGPo8ovmLPMGDLAGmpp',
    recruiter_growth: 'price_1TfP9zIzLpOm3WSXfNhY0LOn',
    recruiter_enterprise: 'price_1TfPAhIzLpOm3WSXWWJFbXZl',
};