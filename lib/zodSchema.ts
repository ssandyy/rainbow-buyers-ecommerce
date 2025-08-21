import z from "zod";

export const roleEnum = z.enum(["user", "moderator", "admin", "superadmin"]);

export const phoneRegex = /^\+?[0-9]{1,4}?[-.\s]?\(?[0-9]{2,4}\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}$/;

export const zSchema = z.object({
    name: z.string().min(3, "Name is required").max(80).optional(),

    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 chars")
        .max(128)
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[a-z]/, "At least one lowercase letter")
        .regex(/\d/, "At least one number")
        .regex(/[^A-Za-z0-9]/, "At least one special character"),
    role: roleEnum.default("user"),
    phone: z
        .string()
        .regex(phoneRegex, "Invalid phone format"),
    address: z.string().min(5, "Address must be at least 5 characters"),
});

// ✅ For creating user
export const createUserSchema = zSchema;

// ✅ For updating user (all optional except id if you need it)
export const updateUserSchema = zSchema.partial().extend({
    id: z.string().optional(),
});

// ✅ For login
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;