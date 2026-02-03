import { z } from 'zod';

// ChecklistItem Base Schemas
//* -----------------------------
export const ItemStatus = z.enum(['GOOD', 'REGULAR', 'BAD', 'NOT_CHECKED']);

// Base
export const ChecklistItemSchema = z
    .object({
        id: z.number().int().positive(),
        receptionId: z.number().int().positive(),
        block: z
            .string()
            .min(3, '* block debe tener al menos 3 caracteres')
            .max(50, '* block no debe exceder los 50 caracteres'),
        item: z
            .string()
            .min(3, '* item debe tener al menos 3 caracteres')
            .max(50, '* item no debe exceder los 50 caracteres'),
        status: ItemStatus,
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
export const CreateChecklistItDTO = ChecklistItemSchema.omit({
    id: true,
}).strict();

// Update
export const UpdateChecklistItDTO = ChecklistItemSchema.omit({
    id: true,
})
    .partial()
    .strict();

// Responses
export const ChecklistItResponseDTO = ChecklistItemSchema.strict();

// Bulk Operations
// Bulk Create
export const CreateChecklistItBulkDTO = z.array(CreateChecklistItDTO).min(1);

// Bulk Update
export const UpdateChecklistItBulkItemDTO = z
    .object({
        id: z.number().int().positive(),
        data: UpdateChecklistItDTO,
    })
    .strict();

export const UpdateChecklistItBulkDTO = z
    .array(UpdateChecklistItBulkItemDTO)
    .min(1);

// Filters
export const ChecklistItFiltersDTO = z
    .object({
        receptionId: z.coerce.number().int().positive().optional(),
        block: z.coerce.string().optional(),
        item: z.coerce.string().optional(),
        status: ItemStatus.optional(),
    })
    .strict();

// Types
//* -----------------------------
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type CreateChecklistItInput = z.infer<typeof CreateChecklistItDTO>;
export type UpdateChecklistItInput = z.infer<typeof UpdateChecklistItDTO>;
export type ChecklistItResponse = z.infer<typeof ChecklistItResponseDTO>;
export type ChecklistItFilters = z.infer<typeof ChecklistItFiltersDTO>;

// Bulk Types
export type CreateChecklistItBulkInput = z.infer<
    typeof CreateChecklistItBulkDTO
>;
export type UpdateChecklistItBulkItem = z.infer<
    typeof UpdateChecklistItBulkItemDTO
>;
export type UpdateChecklistItBulkInput = z.infer<
    typeof UpdateChecklistItBulkDTO
>;

// ChecklistItem To DTOs
//* -----------------------------
export const checklistItemToResponseDTO = (
    checklistItem: ChecklistItem,
): ChecklistItResponse => {
    return ChecklistItResponseDTO.parse(checklistItem);
};

export const checklistItemsToArrayResDTO = (
    checklistItems: ChecklistItem[],
): ChecklistItResponse[] => {
    return checklistItems.map(checklistItemToResponseDTO);
};
