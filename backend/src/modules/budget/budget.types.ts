import { z } from 'zod';

// Budget Base Schemas
//* -----------------------------
export const BudgetStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

// Base
export const BudgetSchema = z
    .object({
        id: z.number().int().positive(),
        receptionId: z.number().int().positive(),
        budgetNumber: z
            .string()
            .min(6, '* budgetNumber debe tener al menos 3 caracteres')
            .max(20, '* budgetNumber no debe exceder los 20 caracteres'),
        status: BudgetStatus,
        createdAt: z.coerce.date(),
        approvedAt: z.coerce.date().nullable(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateBudgetDTO = BudgetSchema.omit({
    id: true,
    createdAt: true,
}).strict();

// Update
export const UpdateBudgetDTO = BudgetSchema.omit({
    id: true,
    createdAt: true,
})
    .partial()
    .strict();

// Responses
export const BudgetResponseDTO = BudgetSchema.strict();

// Filters
export const BudgetFiltersDTO = z
    .object({
        receptionId: z.coerce.number().int().positive().optional(),
        budgetNumber: z.coerce.string().optional(),
        createdAt: z.coerce.date().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type Budget = z.infer<typeof BudgetSchema>;
export type CreateBudgetInput = z.infer<typeof CreateBudgetDTO>;
export type UpdateBudgetInput = z.infer<typeof UpdateBudgetDTO>;
export type BudgetResponse = z.infer<typeof BudgetResponseDTO>;
export type BudgetFilters = z.infer<typeof BudgetFiltersDTO>;

// Budget To DTOs
//* -----------------------------
export const budgetToResponseDTO = (budget: Budget): BudgetResponse => {
    return BudgetResponseDTO.parse(budget);
};

export const budgetsToArrayResDTO = (budgets: Budget[]): BudgetResponse[] => {
    return budgets.map(budgetToResponseDTO);
};
