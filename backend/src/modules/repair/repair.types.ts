import { z } from 'zod';

// Repair Base Schemas
//* -----------------------------
// Base
export const RepairSchema = z
    .object({
        id: z.number().int().positive(),
        receptionId: z.number().int().positive(),
        repairNumber: z
            .string()
            .min(6, '* repairNumber debe tener al menos 3 caracteres')
            .max(20, '* repairNumber no debe exceder los 20 caracteres'),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().nullable(),
        notes: z
            .string()
            .min(3, '* notes debe tener al menos 3 caracteres')
            .max(200, '* notes no debe exceder los 200 caracteres')
            .nullable(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateRepairDTO = RepairSchema.omit({
    id: true,
}).strict();

// Update
export const UpdateRepairDTO = RepairSchema.omit({
    id: true,
})
    .partial()
    .strict();

// Responses
export const RepairResponseDTO = RepairSchema.strict();

// Filters
export const RepairFiltersDTO = z
    .object({
        receptionId: z.coerce.number().int().positive().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type Repair = z.infer<typeof RepairSchema>;
export type CreateRepairInput = z.infer<typeof CreateRepairDTO>;
export type UpdateRepairInput = z.infer<typeof UpdateRepairDTO>;
export type RepairResponse = z.infer<typeof RepairResponseDTO>;
export type RepairFilters = z.infer<typeof RepairFiltersDTO>;

// Repair To DTOs
//* -----------------------------
export const repairToResponseDTO = (repair: Repair): RepairResponse => {
    return RepairResponseDTO.parse(repair);
};

export const repairsToArrayResDTO = (repairs: Repair[]): RepairResponse[] => {
    return repairs.map(repairToResponseDTO);
};
