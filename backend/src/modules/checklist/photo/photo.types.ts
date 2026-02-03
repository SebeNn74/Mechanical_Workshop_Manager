import { z } from 'zod';

// Photo Base Schemas
//* -----------------------------
// Base
export const PhotoSchema = z
    .object({
        id: z.number().int().positive(),
        checklistItemId: z.number().int().positive(),
        filename: z
            .string()
            .min(3, '* filename debe tener al menos 3 caracteres')
            .max(200, '* filename no debe exceder los 200 caracteres'),
        path: z
            .string()
            .min(3, '* path debe tener al menos 3 caracteres')
            .max(400, '* path no debe exceder los 400 caracteres'),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreatePhotoDTO = PhotoSchema.omit({
    id: true,
}).strict();

// Update
export const UpdatePhotoDTO = PhotoSchema.omit({
    id: true,
})
    .partial()
    .strict();

// Responses
export const PhotoResponseDTO = PhotoSchema.strict();

// Bulk Operations
// Bulk Create
export const CreatePhotoBulkDTO = z.array(CreatePhotoDTO).min(1);

// Bulk Update
export const UpdatePhotoBulkItemDTO = z
    .object({
        id: z.number().int().positive(),
        data: UpdatePhotoDTO,
    })
    .strict();

export const UpdatePhotoBulkDTO = z.array(UpdatePhotoBulkItemDTO).min(1);

// Filters
export const PhotoFiltersDTO = z
    .object({
        checklistItemId: z.coerce.number().int().positive().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type Photo = z.infer<typeof PhotoSchema>;
export type CreatePhotoInput = z.infer<typeof CreatePhotoDTO>;
export type UpdatePhotoInput = z.infer<typeof UpdatePhotoDTO>;
export type PhotoResponse = z.infer<typeof PhotoResponseDTO>;
export type PhotoFilters = z.infer<typeof PhotoFiltersDTO>;

// Bulk Types
export type CreatePhotoBulkInput = z.infer<typeof CreatePhotoBulkDTO>;
export type UpdatePhotoBulkItem = z.infer<typeof UpdatePhotoBulkItemDTO>;
export type UpdatePhotoBulkInput = z.infer<typeof UpdatePhotoBulkDTO>;

// Photo To DTOs
//* -----------------------------
export const photoToResponseDTO = (photo: Photo): PhotoResponse => {
    return PhotoResponseDTO.parse(photo);
};

export const photosToArrayResDTO = (photos: Photo[]): PhotoResponse[] => {
    return photos.map(photoToResponseDTO);
};
