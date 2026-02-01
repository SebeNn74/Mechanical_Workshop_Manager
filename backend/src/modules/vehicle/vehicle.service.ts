import {
    Vehicle,
    CreateVehicleInput,
    UpdateVehicleInput,
    VehicleResponse,
    DuplicateVehicleCheck,
    VehicleFilters,
    vehicleToResponseDTO,
    vehiclesToArrayResDTO,
} from './vehicle.types.js';

import { IVehicleRepository } from './vehicle.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IClientService } from '../client/client.service.js';

export interface IVehicleService {
    add(Vehicle: CreateVehicleInput): Promise<VehicleResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<VehicleResponse>;
    getDuplicates(data: DuplicateVehicleCheck): Promise<Vehicle[]>;
    getAll(filters: VehicleFilters): Promise<VehicleResponse[]>;
    update(id: number, data: UpdateVehicleInput): Promise<VehicleResponse>;
    delete(id: number): Promise<void>;
}

export class VehicleService implements IVehicleService {
    constructor(
        private readonly vehicleRepo: IVehicleRepository,
        private readonly clientService: IClientService
    ) { }

    async add(vehicle: CreateVehicleInput): Promise<VehicleResponse> {
        //* La validación de duplicados se realiza por aparte con getDuplicates
        // 1. Validar existencia de client
        await this.ensureClientExists(vehicle.clientId);
        // 2. Crear vehicle
        const newVehicle = await this.vehicleRepo.create(vehicle);
        return vehicleToResponseDTO(newVehicle);
    }

    async existsById(id: number): Promise<boolean> {
        return this.vehicleRepo.existsById(id);
    }

    async getById(id: number): Promise<VehicleResponse> {
        const vehicle = await this.getVehicleOrFail(id);
        return vehicleToResponseDTO(vehicle);
    }

    async getDuplicates(data: DuplicateVehicleCheck): Promise<Vehicle[]> {
        return this.vehicleRepo.findDuplicates(data);
    }

    async getAll(filters: VehicleFilters): Promise<VehicleResponse[]> {
        return vehiclesToArrayResDTO(await this.vehicleRepo.findAll(filters));
    }

    async update(id: number, data: UpdateVehicleInput): Promise<VehicleResponse> {
        // 1. Verificar id
        await this.getVehicleOrFail(id);
        // 2. Actualizar Vehiclee
        const updated = await this.vehicleRepo.update(id, data);
        return vehicleToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getVehicleOrFail(id);
        // 2. Eliminar Vehicle
        await this.vehicleRepo.delete(id);
    }

    private async getVehicleOrFail(id: number): Promise<Vehicle> {
        const vehicle = await this.vehicleRepo.findById(id);
        if (!vehicle)
            throw new NotFoundError(
                'El Vehicle con el id solicitado no existe',
            );
        return vehicle;
    }

    private async ensureClientExists(clientId: number): Promise<void> {
        if (!(await this.clientService.existsById(clientId))) {
            throw new NotFoundError(
                'El client con el clientId solicitado no existe',
            );
        }
    }

}