import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  orderId: z.string().trim().max(80).optional().or(z.literal('')),
  category: z.enum(['Payment issue', 'Download issue', 'Account issue', 'Refund request', 'Product question', 'Other']),
  message: z.string().trim().min(10).max(2000),
});

export const checkoutSchema = z.object({
  currency: z.enum(['INR', 'USD']),
  productId: z.string().min(3).max(120),
  returnUrl: z.string().url().optional().or(z.literal('')),
});
