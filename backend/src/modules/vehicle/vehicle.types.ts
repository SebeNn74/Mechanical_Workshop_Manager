import { z } from 'zod';

// Vehicle Base Schemas
//* -----------------------------
export const PlateType = z.enum([
    'PRIVATE',
    'PUBLIC',
    'MOTORCYCLE',
    'OTHER'
]);

// Base
export const VehicleSchema = z
    .object({
        id: z.number().int().positive(),
        clientId: z.number().int().positive(),
        plateType: PlateType,
        plate: z
            .string()
            .length(6, '* plate debe tener exactamente 6 caracteres'),
        brand: z
            .string()
            .min(3, '* brand debe tener al menos 3 caracteres')
            .max(50, '* brand no debe exceder los 30 caracteres'),
        model: z
            .string()
            .min(3, '* brand debe tener al menos 3 caracteres')
            .max(50, '* brand no debe exceder los 30 caracteres'),
        mileage: z.number().int().positive(),
        createdAt: z.date(),
    })
    .strict();

// DTOs
//* -----------------------------
// Create
export const CreateVehicleDTO = VehicleSchema.omit({
    id: true,
    createdAt: true,
}).strict();

// Update
export const UpdateVehicleDTO = VehicleSchema.omit({
    id: true,
    createdAt: true,
})
    .partial()
    .strict();

// Responses
export const VehicleResponseDTO = VehicleSchema.strict();

// Duplicate Check
export const DuplicateVehicleCheckDTO = VehicleSchema.pick({
    plate: true,
}).strict();

// Filters
export const VehicleFiltersDTO = z
    .object({
        clientId: z.coerce.number().int().positive().optional(),
        plateType: PlateType.optional(),
        plate: z.coerce.string().optional(),
        brand: z.coerce.string().optional(),
        model: z.coerce.string().optional(),
    })
    .strict();

// Types
//* -----------------------------
export type Vehicle = z.infer<typeof VehicleSchema>;
export type CreateVehicleInput = z.infer<typeof CreateVehicleDTO>;
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDTO>;
export type VehicleResponse = z.infer<typeof VehicleResponseDTO>;
export type DuplicateVehicleCheck = z.infer<typeof DuplicateVehicleCheckDTO>;
export type VehicleFilters = z.infer<typeof VehicleFiltersDTO>;

// Vehicle To DTOs
//* -----------------------------
export const vehicleToResponseDTO = (vehicle: Vehicle): VehicleResponse => {
    return VehicleResponseDTO.parse(vehicle);
};

export const vehiclesToArrayResDTO = (vehicles: Vehicle[]): VehicleResponse[] => {
    return vehicles.map(vehicleToResponseDTO);
};
