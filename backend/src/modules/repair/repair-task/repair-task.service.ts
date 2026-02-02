import {
    RepairTask,
    CreateRepairTaskInput,
    UpdateRepairTaskInput,
    RepairTaskResponse,
    RepairTaskFilters,
    repairTaskToResponseDTO,
    repairTasksToArrayResDTO,
} from './repair-task.types.js';

import { IRepairTaskRepository } from './repair-task.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';

export interface IRepairTaskService {
    add(budget: CreateRepairTaskInput): Promise<RepairTaskResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<RepairTaskResponse>;
    getAll(filters: RepairTaskFilters): Promise<RepairTaskResponse[]>;
    update(
        id: number,
        data: UpdateRepairTaskInput,
    ): Promise<RepairTaskResponse>;
    delete(id: number): Promise<void>;
}

export class RepairTaskService implements IRepairTaskService {
    constructor(private readonly repairTaskRepo: IRepairTaskRepository) {}

    async add(repairTask: CreateRepairTaskInput): Promise<RepairTaskResponse> {
        // Crear RepairTask
        const newRepairTask = await this.repairTaskRepo.create(repairTask);
        return repairTaskToResponseDTO(newRepairTask);
    }

    async existsById(id: number): Promise<boolean> {
        return this.repairTaskRepo.existsById(id);
    }

    async getById(id: number): Promise<RepairTaskResponse> {
        const repairTask = await this.getRepairTaskOrFail(id);
        return repairTaskToResponseDTO(repairTask);
    }

    async getAll(filters: RepairTaskFilters): Promise<RepairTaskResponse[]> {
        return repairTasksToArrayResDTO(
            await this.repairTaskRepo.findAll(filters),
        );
    }

    async update(
        id: number,
        data: UpdateRepairTaskInput,
    ): Promise<RepairTaskResponse> {
        // 1. Verificar id
        await this.getRepairTaskOrFail(id);
        // 2. Actualizar RepairTask
        const updated = await this.repairTaskRepo.update(id, data);
        return repairTaskToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getRepairTaskOrFail(id);
        // 2. Eliminar Budget
        await this.repairTaskRepo.delete(id);
    }

    private async getRepairTaskOrFail(id: number): Promise<RepairTask> {
        const repairTask = await this.repairTaskRepo.findById(id);
        if (!repairTask)
            throw new NotFoundError(
                'El repairTask con el id solicitado no existe',
            );
        return repairTask;
    }
}
