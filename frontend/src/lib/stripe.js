import 'server-only';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',   
});

export const PLAN_PRICE_ID = {
    seeker_pro: 'price_1TigWuGPo8ovmLPMiejRE4L6',
    seeker_premium: 'price_1Tj1uPGPo8ovmLPMGDLAGmpp',
    recruiter_growth: 'price_1TfP9zIzLpOm3WSXfNhY0LOn',
    recruiter_enterprise: 'price_1TfPAhIzLpOm3WSXWWJFbXZl',
};