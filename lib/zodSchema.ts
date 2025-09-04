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
    slug: z.string().min(2, "Slug is required").max(80),
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

export const categorySchema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    slug: z.string().min(1, "Slug is required").max(80),
    parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").nullable().optional(),
});

export const productSchema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    slug: z.string().min(1, "Slug is required").max(80),
    description: z.string().min(5, "Description is required").max(255),
    category: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1, "Select at least one category"),
    mrp: z.union([
        z.number().positive('Expected Positive value'), z.string().transform((value) => Number(value)).refine((value) => !Number.isNaN(value) && Number.isFinite(value) && value > 0)
    ]),
    sellingPrice: z.union([
        z.number().positive('Expected Positive value'), z.string().transform((value) => Number(value)).refine((value) => !Number.isNaN(value) && Number.isFinite(value) && value > 0)]),
    discount: z.union([
        z.number().positive('Expected Positive value'), z.string().transform((value) => Number(value)).refine((value) => !Number.isNaN(value) && Number.isFinite(value) && value > 0)
    ]),
    media: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a valid media")).min(1, "At least one media is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;