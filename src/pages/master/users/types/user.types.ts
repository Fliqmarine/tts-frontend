import { z } from "zod";

// ── Schemas ───────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = ["Documentation", "Key Account Manager", "operations Manager", "Manager", "Fiance Executive", "Finance Manager", "Client",] as const;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(ROLE_OPTIONS),
  initial: z.string().min(2, "initial must be at least 2 characters").nullable().optional().or(z.literal("")),
  avatar: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(ROLE_OPTIONS),
  initial: z.string().min(2, "initial must be at least 2 characters").nullable().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(ROLE_OPTIONS).optional(),
  isActive: z.boolean().optional(),
  initial: z.string().min(2, "initial must be at least 2 characters").nullable().optional().or(z.literal("")),

});

// ── Derived Types ─────────────────────────────────────────────────────────────

export type User = z.infer<typeof UserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

// ── Safe Parse Helper ─────────────────────────────────────────────────────────

/** Parses a raw API response. Returns typed User or throws with a clear message. */
export const parseUser = (raw: unknown): User => UserSchema.parse(raw);
export const parseUsers = (raw: unknown): User[] => z.array(UserSchema).parse(raw);