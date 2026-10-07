import { z } from 'zod';


export const GLCodeChildrenSchema = z.object({
    id: z.number(),
    glCodeParentId: z.number(),
    name:z.string(),
    code: z.string().min(1, "GL code is required"),
    active: z.boolean(),
});

export const CreateGLCodeChildrenSchema = GLCodeChildrenSchema.omit({ id: true });

export type GLCodeChildren = z.infer< typeof GLCodeChildrenSchema>;
export type CreateGLCodeChildren = z.infer< typeof CreateGLCodeChildrenSchema>;

export const parseGLCodeChildren = (raw: unknown): GLCodeChildren => GLCodeChildrenSchema.parse(raw);
export const parseGLCodeChildrens = (raw: unknown): GLCodeChildren[] => z.array(GLCodeChildrenSchema).parse(raw);

