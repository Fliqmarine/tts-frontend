import { z } from "zod";

// ── GL Types ──────────────────────────────────────────────────────────────────

export const GL_TYPES = ["Income", "Expense"] as const;

// ── Schema ────────────────────────────────────────────────────────────────────

export const GLCodeParentSchema = z.object({
    id: z.number(),
    name:z.string(),
    code: z.string().min(1, "GL code is required"),
    type: z.enum(GL_TYPES),
    active: z.boolean(),
});

export const CreateGLCodeParentSchema = GLCodeParentSchema.omit({ id: true });

// ── Derived Types ─────────────────────────────────────────────────────────────

export type GLCodeParent = z.infer<typeof GLCodeParentSchema>;
export type CreateGLCodeParent = z.infer<typeof CreateGLCodeParentSchema>;
export type GLType = (typeof GL_TYPES)[number];

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export const parseGLCode = (raw: unknown): GLCodeParent => GLCodeParentSchema.parse(raw);
export const parseGLCodes = (raw: unknown): GLCodeParent[] => z.array(GLCodeParentSchema).parse(raw);
