import { z } from 'zod';

// Reception Base Schemas
//* -----------------------------
// Base
export const ReceptionSchema = z
    .object({
        id: z.number().int().positive(),
        vehicleId: z.number().int().positive(),
        dateTime: z.coerce.date(),
        notes: z
            .string()
            .min(3, '* note debe tener al menos 3 caracteres')
            .max(100, '* note no debe exceder los 100 caracteres')
            .nullable(),
    })
    .strict();