import {
    RepairTask,
    CreateRepairTaskInput,
    UpdateRepairTaskInput,
    RepairTaskResponse,
    RepairTaskFilters,
    repairTaskToResponseDTO,
    repairTasksToArrayResDTO,
    CreateRepairTaskBulkInput,
    UpdateRepairTaskBulkInput,
} from './repair-task.types.js';

import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IRepairTaskRepository } from './repair-task.repository.js';
import { IRepairService } from '../repair.service.js';
import { BudgetItem } from '#/modules/budget/budget_item/budget_item.types.js';

export interface IRepairTaskService {
    add(budget: CreateRepairTaskInput): Promise<RepairTaskResponse>;
    addBulk(tasks: CreateRepairTaskBulkInput): Promise<RepairTaskResponse[]>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<RepairTaskResponse>;
    getAll(filters: RepairTaskFilters): Promise<RepairTaskResponse[]>;
    update(
        id: number,
        data: UpdateRepairTaskInput,
    ): Promise<RepairTaskResponse>;
    updateBulk(tasks: UpdateRepairTaskBulkInput): Promise<RepairTaskResponse[]>;
    delete(id: number): Promise<void>;
    deleteByRepairId(repairId: number): Promise<number>;
    createFromBudgetItems(
        repairId: number,
        budgetItems: BudgetItem[],
    ): Promise<RepairTaskResponse[]>;
}

export class RepairTaskService implements IRepairTaskService {
    private repairService: IRepairService | null = null;

    constructor(private readonly repairTaskRepo: IRepairTaskRepository) {}

    setRepairService(repair: IRepairService): void {
        this.repairService = repair;
    }

    //* Simple CRUD methods
    //* -----------------------------

    async add(repairTask: CreateRepairTaskInput): Promise<RepairTaskResponse> {
        // Crear RepairTask
        const newRepairTask = await this.repairTaskRepo.create(repairTask);
        return repairTaskToResponseDTO(newRepairTask);
    }

    async addBulk(
        tasks: CreateRepairTaskBulkInput,
    ): Promise<RepairTaskResponse[]> {
        // 1. Obtener repairIds únicos y validarlos
        const repairTaskIds = new Set(tasks.map((task) => task.repairId));
        for (const repairTaskId of repairTaskIds) {
            await this.ensureRepairExists(repairTaskId);
        }
        // 2. Crear todos los BudgetItems
        const createdRepairTasks = await this.repairTaskRepo.createBulk(tasks);
        return repairTasksToArrayResDTO(createdRepairTasks);
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

    async updateBulk(
        tasks: UpdateRepairTaskBulkInput,
    ): Promise<RepairTaskResponse[]> {
        // No hace falta validar los repairIds ya que no son actualizables
        const updatedRepairTasks = await this.repairTaskRepo.updateBulk(tasks);
        return repairTasksToArrayResDTO(updatedRepairTasks);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getRepairTaskOrFail(id);
        // 2. Eliminar RepairTask
        await this.repairTaskRepo.delete(id);
    }

    async deleteByRepairId(repairId: number): Promise<number> {
        return await this.repairTaskRepo.deleteByRepairId(repairId);
    }

    async createFromBudgetItems(
        repairId: number,
        budgetItems: BudgetItem[],
    ): Promise<RepairTaskResponse[]> {
        // 1. Validar si la lista de budgetItems está vacía
        if (budgetItems.length === 0) {
            return [];
        }
        // 2. Asegurarse de que el Repair exista
        await this.ensureRepairExists(repairId);

        // 3. Generar RepairTasks a partir de los BudgetItems
        const repairTasksToCreate: CreateRepairTaskInput[] = budgetItems.map(
            (budgetItem) => ({
                repairId,
                budgetItemId: budgetItem.id,
                description: budgetItem.description,
                finalPrice: budgetItem.estimatedPrice,
            }),
        );
        // 4. Crear todos los RepairTasks
        return await this.addBulk(repairTasksToCreate);
    }

    //* Private methods
    //* -----------------------------

    private async getRepairTaskOrFail(id: number): Promise<RepairTask> {
        const repairTask = await this.repairTaskRepo.findById(id);
        if (!repairTask)
            throw new NotFoundError(
                'El repairTask con el id solicitado no existe',
            );
        return repairTask;
    }

    private async ensureRepairExists(budgetId: number): Promise<void> {
        if (!this.repairService) {
            throw new Error(
                'RepairService no ha sido inicializado en RepairTaskService',
            );
        }
        if (!(await this.repairService.existsById(budgetId))) {
            throw new NotFoundError(
                'El RepairTask con el id solicitado no existe',
            );
        }
    }
}
