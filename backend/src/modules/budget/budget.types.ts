import { z } from 'zod';

// Budget Base Schemas
//* -----------------------------
export const BudgetStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

// Base
export const BudgetSchema = z
    .object({
        id: z.number().int().positive(),
        receptionId: z.number().int().positive(),
        status: BudgetStatus,
        createdAt: z.coerce.date(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateBudgetDTO = BudgetSchema.pick({
    receptionId: true,
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
        status: BudgetStatus.optional(),
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
