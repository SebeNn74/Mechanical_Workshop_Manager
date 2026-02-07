import { z } from 'zod';
import { BudgetItemSchema } from './budget_item.types.js';

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
      .min(10, '* budgetNumber debe tener al menos 10 caracteres')
      .max(14, '* budgetNumber no debe exceder los 14 caracteres'),
    status: BudgetStatus,
    createdAt: z.coerce.date(),
    approvedAt: z.coerce.date().nullable(),
  })
  .strict();

// DTOs
//* -----------------------------
// Create
export const CreateBudgetDTO = BudgetSchema.pick({
  receptionId: true,
}).strict();

// Update
export const UpdateBudgetDTO = BudgetSchema.pick({
  status: true,
})
  .partial()
  .strict();

// Responses
export const BudgetResponseDTO = BudgetSchema.strict();

export const BudgetWithItemsDTO = BudgetSchema.extend({
  items: z.array(BudgetItemSchema),
}).strict();

export const BudgetDetailedResponseDTO = BudgetSchema.extend({
  items: z.array(BudgetItemSchema),
  totalEstimated: z.number().int().positive(),
}).strict();

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
export type BudgetWithItems = z.infer<typeof BudgetWithItemsDTO>;
export type BudgetDetailedResponse = z.infer<typeof BudgetDetailedResponseDTO>;
export type BudgetFilters = z.infer<typeof BudgetFiltersDTO>;

// Budget To DTOs
//* -----------------------------
export const budgetToResponseDTO = (budget: Budget): BudgetResponse => {
  return BudgetResponseDTO.parse(budget);
};

export const budgetsToArrayResDTO = (budgets: Budget[]): BudgetResponse[] => {
  return budgets.map(budgetToResponseDTO);
};
