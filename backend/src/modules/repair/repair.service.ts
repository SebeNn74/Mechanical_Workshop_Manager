import {
    Repair,
    CreateRepairInput,
    UpdateRepairInput,
    RepairResponse,
    RepairFilters,
    repairToResponseDTO,
    repairsToArrayResDTO,
} from './repair.types.js';

import { IRepairRepository } from './repair.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IReceptionService } from '../reception/reception.service.js';
import { IRepairTaskService } from './repair-task/repair-task.service.js';

export interface IRepairService {
    add(Repair: CreateRepairInput): Promise<RepairResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<RepairResponse>;
    getAll(filters: RepairFilters): Promise<RepairResponse[]>;
    update(id: number, data: UpdateRepairInput): Promise<RepairResponse>;
    delete(id: number): Promise<void>;
}

export class RepairService implements IRepairService {
    constructor(
        private readonly repairRepo: IRepairRepository,
        private readonly receptionService: IReceptionService,
        private readonly repairTaskService: IRepairTaskService,
    ) {}

    async add(repair: CreateRepairInput): Promise<RepairResponse> {
        // 1. Validar existencia de reception
        await this.ensureReceptionExists(repair.receptionId);
        // 2. Crear Repair
        const newRepair = await this.repairRepo.create(repair);
        return repairToResponseDTO(newRepair);
    }

    async existsById(id: number): Promise<boolean> {
        return this.repairRepo.existsById(id);
    }

    async getById(id: number): Promise<RepairResponse> {
        const repair = await this.getRepairOrFail(id);
        return repairToResponseDTO(repair);
    }

    async getAll(filters: RepairFilters): Promise<RepairResponse[]> {
        return repairsToArrayResDTO(await this.repairRepo.findAll(filters));
    }

    async update(id: number, data: UpdateRepairInput): Promise<RepairResponse> {
        // 1. Verificar id
        await this.getRepairOrFail(id);
        // 2. Actualizar Repair
        const updated = await this.repairRepo.update(id, data);
        return repairToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getRepairOrFail(id);
        // 2. Eliminar Repair
        await this.repairRepo.delete(id);
    }

    private async getRepairOrFail(id: number): Promise<Repair> {
        const repair = await this.repairRepo.findById(id);
        if (!repair)
            throw new NotFoundError('El repair con el id solicitado no existe');
        return repair;
    }

    private async ensureReceptionExists(receptionId: number): Promise<void> {
        if (!(await this.receptionService.existsById(receptionId))) {
            throw new NotFoundError(
                'El repair con el receptionId solicitado no existe',
            );
        }
    }
}
