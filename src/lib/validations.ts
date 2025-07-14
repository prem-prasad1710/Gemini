import { z } from 'zod';

export const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Please select a country'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number must be at most 15 digits'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
  image: z.string().optional(),
});

export const chatroomSchema = z.object({
  title: z
    .string()
    .min(1, 'Chatroom title is required')
    .max(50, 'Title must be 50 characters or less')
    .trim(),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type ChatroomFormData = z.infer<typeof chatroomSchema>;
