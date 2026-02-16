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
      .nonempty('El número de documento es requerido')
      .min(6, 'Debe tener al menos 6 caracteres')
      .max(11, 'Debe exceder los 11 caracteres')
      .regex(/^\d+$/, 'Debe contener solo dígitos'),

    name: z
      .string()
      .nonempty('El nombre es requerido')
      .min(3, 'Debe tener al menos 3 caracteres')
      .max(100, 'No debe exceder los 30 caracteres'),
    phone: z
      .string()
      .nonempty('El número de teléfono es requerido')
      .length(10, 'Debe tener exactamente 10 dígitos')
      .regex(/^\d{10}$/, 'Debe contener solo dígitos'),
    email: z
      .string()
      .min(5, 'Debe tener al menos 5 caracteres')
      .max(200, 'No debe exceder los 200 caracteres')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Debe tener un formato válido')
      .nullable(),
    address: z
      .string()
      .min(5, 'Debe tener al menos 5 caracteres')
      .max(200, 'No debe exceder los 200 caracteres')
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
