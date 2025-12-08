import { z } from "zod";

const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(
            passwordPattern,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        ),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(
            passwordPattern,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        ),
});
