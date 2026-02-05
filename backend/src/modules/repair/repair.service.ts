import {
    Repair,
    CreateRepairInput,
    UpdateRepairInput,
    RepairResponse,
    RepairFilters,
    repairToResponseDTO,
    repairsToArrayResDTO,
    RepairWithTasks,
    RepairDetailedResponse,
} from './repair.types.js';
import {
    CreateRepairTaskInput,
    RepairTask,
    RepairTaskResponse,
    UpdateRepairTaskBulkInput,
} from './repair-task/repair-task.types.js';

import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IRepairRepository } from './repair.repository.js';
import { IReceptionService } from '../reception/reception.service.js';
import { IRepairTaskService } from './repair-task/repair-task.service.js';
import { IBudgetService } from '../budget/budget.service.js';

export interface IRepairService {
    add(Repair: CreateRepairInput): Promise<RepairWithTasks>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<RepairResponse>;
    getAll(filters: RepairFilters): Promise<RepairResponse[]>;
    update(id: number, data: UpdateRepairInput): Promise<RepairResponse>;
    delete(id: number): Promise<void>;
    getWithTasks(id: number): Promise<RepairWithTasks>;
    addTask(task: CreateRepairTaskInput): Promise<RepairTaskResponse>;
    updateBulkTasks(
        tasks: UpdateRepairTaskBulkInput,
    ): Promise<RepairTaskResponse[]>;
    removeTask(taskId: number): Promise<void>;
    getRepairSummary(id: number): Promise<RepairDetailedResponse>;
}

export class RepairService implements IRepairService {
    constructor(
        private readonly repairRepo: IRepairRepository,
        private readonly receptionService: IReceptionService,
        private readonly repairTaskService: IRepairTaskService,
        private readonly budgetService: IBudgetService,
    ) {}

    //* Simple CRUD methods
    //* -----------------------------

    async add(repair: CreateRepairInput): Promise<RepairWithTasks> {
        // 1. Validar existencia de reception
        await this.ensureReceptionExists(repair.receptionId);
        // 2. Validar que el presupuesto es apto para Repair
        await this.budgetService.validateBudgetForRepair(repair.budgetId);
        // 3. Crear Repair
        const newRepair = await this.repairRepo.create(repair);
        // 4. Obtener BudgetItems del Budget asociado
        const budgetWithItems = await this.budgetService.getWithItems(
            repair.budgetId,
        );
        // 5. Generar RepairTasks automáticamente a partir de los BudgetItems
        const tasks = await this.repairTaskService.createFromBudgetItems(
            newRepair.id,
            budgetWithItems.items,
        );
        // 6. Retornar el Repair con Items
        return { ...newRepair, tasks: tasks };
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

    //* Operations with RepairTasks
    //* -----------------------------
    async getWithTasks(id: number): Promise<RepairWithTasks> {
        const repair = await this.getRepairOrFail(id);
        const tasks = await this.repairTaskService.getAll({ repairId: id });
        return { ...repair, tasks };
    }

    async addTask(task: CreateRepairTaskInput): Promise<RepairTaskResponse> {
        // Validar que el repair existe
        await this.getRepairOrFail(task.repairId);
        // Crear task con el repairId
        return await this.repairTaskService.add(task);
    }

    async updateBulkTasks(
        tasks: UpdateRepairTaskBulkInput,
    ): Promise<RepairTaskResponse[]> {
        // Los repairTasks no cambian de repair, solo se valida que existan
        for (const item of tasks) {
            await this.ensureRepairTaskExists(item.id);
        }
        return await this.repairTaskService.updateBulk(tasks);
    }

    async removeTask(taskId: number): Promise<void> {
        await this.repairTaskService.delete(taskId);
    }

    async getRepairSummary(id: number): Promise<RepairDetailedResponse> {
        const repair = await this.getRepairOrFail(id);
        const tasks = await this.repairTaskService.getAll({ repairId: id });
        const totalCost = this.calculateRepairTotal(tasks);

        return {
            ...repair,
            tasks,
            totalCost,
        };
    }

    //* Private methods
    //* -----------------------------

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

    private async ensureRepairTaskExists(repairTaskId: number): Promise<void> {
        if (!(await this.repairTaskService.existsById(repairTaskId))) {
            throw new NotFoundError(
                'El repairTask con el id solicitado no existe',
            );
        }
    }

    private calculateRepairTotal(tasks: RepairTask[]): number {
        return tasks.reduce((sum, task) => sum + task.finalPrice, 0);
    }
}
