import { z } from 'zod';

// Budget Base Schemas
//* -----------------------------
// Base
export const BudgetItemSchema = z
    .object({
        id: z.number().int().positive(),
        budgetId: z.number().int().positive(),
        description: z
            .string()
            .min(3, '* description debe tener al menos 3 caracteres')
            .max(200, '* description no debe exceder los 200 caracteres'),
        estimatedPrice: z.number().int().nonnegative(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateBudgetItemDTO = BudgetItemSchema.omit({
    id: true,
}).strict();

// Update
export const UpdateBudgetItemDTO = BudgetItemSchema.omit({
    id: true,
    budgetId: true,
})
    .partial()
    .strict();

// Responses
export const BudgetItemResponseDTO = BudgetItemSchema.strict();

// Bulk Operations
// Bulk Create
export const CreateBudgetItemBulkDTO = z.array(CreateBudgetItemDTO).min(1);

// Bulk Update
export const UpdateBudgetItemBulkItDTO = z
    .object({
        id: z.number().int().positive(),
        data: UpdateBudgetItemDTO,
    })
    .strict();

export const UpdateBudgetItemBulkDTO = z
    .array(UpdateBudgetItemBulkItDTO)
    .min(1);

// Filters
export const BudgetItemFiltersDTO = z
    .object({
        budgetId: z.coerce.number().int().positive().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type CreateBudgetItemInput = z.infer<typeof CreateBudgetItemDTO>;
export type UpdateBudgetItemInput = z.infer<typeof UpdateBudgetItemDTO>;
export type BudgetItemResponse = z.infer<typeof BudgetItemResponseDTO>;
export type BudgetItemFilters = z.infer<typeof BudgetItemFiltersDTO>;

// Bulk Types
export type CreateBudgetItemBulkInput = z.infer<typeof CreateBudgetItemBulkDTO>;
export type UpdateBudgetItemBulkItem = z.infer<
    typeof UpdateBudgetItemBulkItDTO
>;
export type UpdateBudgetItemBulkInput = z.infer<typeof UpdateBudgetItemBulkDTO>;

// BudgetItem To DTOs
//* -----------------------------
export const budgetItemToResponseDTO = (
    budgetItem: BudgetItem,
): BudgetItemResponse => {
    return BudgetItemResponseDTO.parse(budgetItem);
};

export const budgetItemsToArrayResDTO = (
    budgetItems: BudgetItem[],
): BudgetItemResponse[] => {
    return budgetItems.map(budgetItemToResponseDTO);
};
