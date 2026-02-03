import { z } from 'zod';

// Client Base Schemas
//* -----------------------------
export const DocumentType = z.enum(['CC', 'NIT']);

// Base
export const ClientSchema = z
    .object({
        id: z.number().int().positive(),
        documentType: DocumentType,
        documentNumber: z
            .string()
            .min(6, '* documentNumber debe tener al menos 6 caracteres')
            .max(11, '* documentNumber no debe exceder los 11 caracteres'),
        name: z
            .string()
            .min(3, '* name debe tener al menos 3 caracteres')
            .max(100, '* name no debe exceder los 30 caracteres'),
        phone: z
            .string()
            .regex(/^\d{10}$/, '* phone debe contener solo dígitos')
            .length(10, '* phone debe tener exactamente 10 dígitos'),
        email: z
            .string()
            .regex(
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                '* email debe tener un formato válido',
            )
            .min(5, '* email debe tener al menos 5 caracteres')
            .max(200, '* email no debe exceder los 200 caracteres')
            .nullable(),
        address: z
            .string()
            .min(5, '* address debe tener al menos 5 caracteres')
            .max(200, '* address no debe exceder los 200 caracteres')
            .nullable(),
        createdAt: z.date(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateClientDTO = ClientSchema.omit({
    id: true,
    createdAt: true,
}).strict();

// Update
export const UpdateClientDTO = ClientSchema.omit({
    id: true,
    createdAt: true,
})
    .partial()
    .strict();

// Responses
export const ClientResponseDTO = ClientSchema.strict();

// Duplicate Check
export const DuplicateClientCheckDTO = ClientSchema.pick({
    documentType: true,
    documentNumber: true,
}).strict();

// Filters
export const ClientFiltersDTO = z
    .object({
        documentType: DocumentType.optional(),
        documentNumber: z.coerce.string().optional(),
        name: z.coerce.string().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type Client = z.infer<typeof ClientSchema>;
export type CreateClientInput = z.infer<typeof CreateClientDTO>;
export type UpdateClientInput = z.infer<typeof UpdateClientDTO>;
export type ClientResponse = z.infer<typeof ClientResponseDTO>;
export type DuplicateClientCheck = z.infer<typeof DuplicateClientCheckDTO>;
export type ClientFilters = z.infer<typeof ClientFiltersDTO>;

// Client To DTOs
//* -----------------------------
export const clientToResponseDTO = (client: Client): ClientResponse => {
    return ClientResponseDTO.parse(client);
};

export const clientsToArrayResDTO = (clients: Client[]): ClientResponse[] => {
    return clients.map(clientToResponseDTO);
};
