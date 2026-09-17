import { z } from 'zod';

export const GLCodeSubChildrenSchema = z.object({
    id: z.number(),
    glCodeParentName: z.string(),
    glCodeChildrenName: z.string(),
    name: z.string(),
    code: z.string().min(1, "GL code is required"),
    active: z.boolean(),
});

export const CreateGLCodeSubChildrenSchema = GLCodeSubChildrenSchema.omit({ id: true });

export type GLCodeSubChildren = z.infer<typeof GLCodeSubChildrenSchema>;
export type CreateGLCodeSubChildren = z.infer<typeof CreateGLCodeSubChildrenSchema>;

export const parseGLCodeSubChild = (raw: unknown): GLCodeSubChildren => GLCodeSubChildrenSchema.parse(raw);
export const parseGLCodeSubChildren = (raw: unknown): GLCodeSubChildren[] => z.array(GLCodeSubChildrenSchema).parse(raw);
