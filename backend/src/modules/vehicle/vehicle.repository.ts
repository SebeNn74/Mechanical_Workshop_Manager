import prisma from '#/config/prisma.js';
import {
    Vehicle,
    CreateVehicleInput,
    UpdateVehicleInput,
    VehicleFilters,
    DuplicateVehicleCheck,
} from './vehicle.types.js';

export interface IVehicleRepository {
    create(data: CreateVehicleInput): Promise<Vehicle>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Vehicle | null>;
    findDuplicates(data: DuplicateVehicleCheck): Promise<Vehicle[]>;
    findAll(filters: VehicleFilters): Promise<Vehicle[]>;
    update(id: number, data: UpdateVehicleInput): Promise<Vehicle>;
    delete(id: number): Promise<Vehicle>;
}

export class VehicleRepository implements IVehicleRepository {
    async create(data: CreateVehicleInput): Promise<Vehicle> {
        return await prisma.vehicle.create({ data });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.vehicle.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Vehicle | null> {
        return await prisma.vehicle.findUnique({
            where: { id },
        });
    }

    async findDuplicates(data: DuplicateVehicleCheck): Promise<Vehicle[]> {
        return await prisma.vehicle.findMany({
            where: {
                plate: data.plate,
            },
        });
    }

    async findAll(filters: VehicleFilters): Promise<Vehicle[]> {
        return await prisma.vehicle.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateVehicleInput): Promise<Vehicle> {
        return await prisma.vehicle.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Vehicle> {
        return await prisma.vehicle.delete({
            where: { id },
        });
    }
}