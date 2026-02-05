import { z } from 'zod';
import { RepairTaskSchema } from './repair-task/repair-task.types.js';

// Repair Base Schemas
//* -----------------------------
// Base
export const RepairSchema = z
    .object({
        id: z.number().int().positive(),
        receptionId: z.number().int().positive(),
        repairNumber: z
            .string()
            .min(10, '* repairNumber debe tener al menos 10 caracteres')
            .max(14, '* repairNumber no debe exceder los 14 caracteres'),
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
})
    .extend({
        budgetId: z.number().int().positive(),
    })
    .strict();

// Update
export const UpdateRepairDTO = RepairSchema.omit({
    id: true,
})
    .partial()
    .strict();

// Responses
export const RepairResponseDTO = RepairSchema.strict();

export const RepairWithTasksDTO = RepairSchema.extend({
    tasks: z.array(RepairTaskSchema),
}).strict();

export const RepairDetailedResponseDTO = RepairSchema.extend({
    tasks: z.array(RepairTaskSchema),
    totalCost: z.number().int().positive(),
}).strict();

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
export type RepairWithTasks = z.infer<typeof RepairWithTasksDTO>;
export type RepairDetailedResponse = z.infer<typeof RepairDetailedResponseDTO>;
export type RepairFilters = z.infer<typeof RepairFiltersDTO>;

// Repair To DTOs
//* -----------------------------
export const repairToResponseDTO = (repair: Repair): RepairResponse => {
    return RepairResponseDTO.parse(repair);
};

export const repairsToArrayResDTO = (repairs: Repair[]): RepairResponse[] => {
    return repairs.map(repairToResponseDTO);
};
