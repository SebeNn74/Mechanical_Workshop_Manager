import {
    Reception,
    CreateReceptionInput,
    UpdateReceptionInput,
    ReceptionResponse,
    ReceptionFilters,
    receptionToResponseDTO,
    receptionsToArrayResDTO,
} from './reception.types.js';

import { IReceptionRepository } from './reception.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IVehicleService } from '../vehicle/vehicle.service.js';

export interface IReceptionService {
    add(reception: CreateReceptionInput): Promise<ReceptionResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<ReceptionResponse>;
    getAll(filters: ReceptionFilters): Promise<ReceptionResponse[]>;
    update(id: number, data: UpdateReceptionInput): Promise<ReceptionResponse>;
    delete(id: number): Promise<void>;
}

export class ReceptionService implements IReceptionService {
    constructor(
        private readonly receptionRepo: IReceptionRepository,
        private readonly vehicleService: IVehicleService,
    ) {}

    async add(reception: CreateReceptionInput): Promise<ReceptionResponse> {
        // 1. Validar existencia de vehicle
        await this.ensureVehicleExists(reception.vehicleId);
        // 2. Crear Reception
        const newReception = await this.receptionRepo.create(reception);
        return receptionToResponseDTO(newReception);
    }

    async existsById(id: number): Promise<boolean> {
        return this.receptionRepo.existsById(id);
    }

    async getById(id: number): Promise<ReceptionResponse> {
        const reception = await this.getReceptionOrFail(id);
        return receptionToResponseDTO(reception);
    }

    async getAll(filters: ReceptionFilters): Promise<ReceptionResponse[]> {
        return receptionsToArrayResDTO(
            await this.receptionRepo.findAll(filters),
        );
    }

    async update(
        id: number,
        data: UpdateReceptionInput,
    ): Promise<ReceptionResponse> {
        // 1. Verificar id
        await this.getReceptionOrFail(id);
        // 2. Actualizar Receptione
        const updated = await this.receptionRepo.update(id, data);
        return receptionToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getReceptionOrFail(id);
        // 2. Eliminar Reception
        await this.receptionRepo.delete(id);
    }

    private async getReceptionOrFail(id: number): Promise<Reception> {
        const reception = await this.receptionRepo.findById(id);
        if (!reception)
            throw new NotFoundError(
                'La reception con el id solicitado no existe',
            );
        return reception;
    }

    private async ensureVehicleExists(vehicleId: number): Promise<void> {
        if (!(await this.vehicleService.existsById(vehicleId))) {
            throw new NotFoundError(
                'La reception con el vehicleId solicitado no existe',
            );
        }
    }
}
