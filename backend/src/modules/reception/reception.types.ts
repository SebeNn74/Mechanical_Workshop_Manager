import { z } from 'zod';

// Reception Base Schemas
//* -----------------------------
// Base
export const ReceptionSchema = z
    .object({
        id: z.number().int().positive(),
        vehicleId: z.number().int().positive(),
        receptionNumber: z
            .string()
            .min(10, '* receptionNumber debe tener al menos 10 caracteres')
            .max(14, '* receptionNumber no debe exceder los 14 caracteres'),
        dateTime: z.coerce.date(),
        mileageAtEntry: z.number().int().positive(),
        notes: z
            .string()
            .min(3, '* note debe tener al menos 3 caracteres')
            .max(100, '* note no debe exceder los 100 caracteres')
            .nullable(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateReceptionDTO = ReceptionSchema.omit({
    id: true,
    receptionNumber: true,
}).strict();

// Update
export const UpdateReceptionDTO = ReceptionSchema.omit({
    id: true,
    receptionNumber: true,
})
    .partial()
    .strict();

// Responses
export const ReceptionResponseDTO = ReceptionSchema.strict();

// Filters
export const ReceptionFiltersDTO = z
    .object({
        vehicleId: z.coerce.number().int().positive().optional(),
        receptionNumber: z.coerce.string().optional(),
        dateTime: z.coerce.date().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type Reception = z.infer<typeof ReceptionSchema>;
export type CreateReceptionInput = z.infer<typeof CreateReceptionDTO>;
export type UpdateReceptionInput = z.infer<typeof UpdateReceptionDTO>;
export type ReceptionResponse = z.infer<typeof ReceptionResponseDTO>;
export type ReceptionFilters = z.infer<typeof ReceptionFiltersDTO>;

// Reception To DTOs
//* -----------------------------
export const receptionToResponseDTO = (
    reception: Reception,
): ReceptionResponse => {
    return ReceptionResponseDTO.parse(reception);
};

export const receptionsToArrayResDTO = (
    receptions: Reception[],
): ReceptionResponse[] => {
    return receptions.map(receptionToResponseDTO);
};
