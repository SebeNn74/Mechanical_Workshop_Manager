import { z } from 'zod';

// RepairTask Base Schemas
//* -----------------------------
// Base
export const RepairTaskSchema = z
    .object({
        id: z.number().int().positive(),
        repairId: z.number().int().positive(),
        description: z
            .string()
            .min(3, '* description debe tener al menos 3 caracteres')
            .max(200, '* description no debe exceder los 200 caracteres')
            .nullable(),
        finalPrice: z.number().int().positive(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateRepairTaskDTO = RepairTaskSchema.omit({
    id: true,
}).strict();

// Update
export const UpdateRepairTaskDTO = RepairTaskSchema.omit({
    id: true,
})
    .partial()
    .strict();

// Responses
export const RepairTaskResponseDTO = RepairTaskSchema.strict();

// Filters
export const RepairTaskFiltersDTO = z
    .object({
        repairId: z.coerce.number().int().positive().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type RepairTask = z.infer<typeof RepairTaskSchema>;
export type CreateRepairTaskInput = z.infer<typeof CreateRepairTaskDTO>;
export type UpdateRepairTaskInput = z.infer<typeof UpdateRepairTaskDTO>;
export type RepairTaskResponse = z.infer<typeof RepairTaskResponseDTO>;
export type RepairTaskFilters = z.infer<typeof RepairTaskFiltersDTO>;

// RepairTask To DTOs
//* -----------------------------
export const repairTaskToResponseDTO = (
    repairTask: RepairTask,
): RepairTaskResponse => {
    return RepairTaskResponseDTO.parse(repairTask);
};

export const repairTasksToArrayResDTO = (
    repairTasks: RepairTask[],
): RepairTaskResponse[] => {
    return repairTasks.map(repairTaskToResponseDTO);
};
