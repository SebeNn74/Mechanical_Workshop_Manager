import {
    Budget,
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetResponse,
    BudgetFilters,
    budgetToResponseDTO,
    budgetsToArrayResDTO,
    BudgetWithItems,
    BudgetDetailedResponse,
} from './budget.types.js';

import { IBudgetRepository } from './budget.repository.js';
import {
    BusinessValidationError,
    NotFoundError,
} from '#/shared/errors/domain.error.js';
import { IReceptionService } from '../reception/reception.service.js';
import { IBudgetItemService } from './budget_item/budget_item.service.js';
import {
    BudgetItem,
    BudgetItemResponse,
    CreateBudgetItemInput,
} from './budget_item/budget_item.types.js';
import { IChecklistItService } from '../checklist/checklist_item.service.js';

export interface IBudgetService {
    add(budget: CreateBudgetInput): Promise<BudgetWithItems>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<BudgetResponse>;
    getAll(filters: BudgetFilters): Promise<BudgetResponse[]>;
    update(id: number, data: UpdateBudgetInput): Promise<BudgetResponse>;
    delete(id: number): Promise<void>;
    getWithItems(id: number): Promise<BudgetWithItems>;
    addItem(item: CreateBudgetItemInput): Promise<BudgetItemResponse>;
    removeItem(itemId: number): Promise<void>;
    getBudgetSummary(id: number): Promise<BudgetDetailedResponse>;
}

export class BudgetService implements IBudgetService {
    constructor(
        private readonly budgetRepo: IBudgetRepository,
        private readonly receptionService: IReceptionService,
        private readonly budgetItemService: IBudgetItemService,
        private readonly checklistItService: IChecklistItService,
    ) {}

    //* Simple CRUD methods
    //* -----------------------------

    async add(budget: CreateBudgetInput): Promise<BudgetWithItems> {
        // 1. Validar existencia de reception
        await this.ensureReceptionExists(budget.receptionId);
        // 2. Crear Budget
        const newBudget = await this.budgetRepo.create(budget);
        // 3. Obtener ChecklistItems de la Reception
        const checklistItems = await this.checklistItService.getByReceptionId(
            budget.receptionId,
        );
        // 4. Generar BudgetItems automáticamente apartir de los ChecklistItems
        const budgetItems =
            await this.budgetItemService.createFromChecklistItems(
                newBudget.id,
                checklistItems,
            );
        // 5. Retornar Budget con Items
        return { ...newBudget, items: budgetItems };
    }

    async existsById(id: number): Promise<boolean> {
        return this.budgetRepo.existsById(id);
    }

    async getById(id: number): Promise<BudgetResponse> {
        const budget = await this.getBudgetOrFail(id);
        return budgetToResponseDTO(budget);
    }

    async getAll(filters: BudgetFilters): Promise<BudgetResponse[]> {
        return budgetsToArrayResDTO(await this.budgetRepo.findAll(filters));
    }

    async update(id: number, data: UpdateBudgetInput): Promise<BudgetResponse> {
        // 1. Verificar id
        await this.getBudgetOrFail(id);
        // 2. Actualizar Budget
        const updated = await this.budgetRepo.update(id, data);
        return budgetToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getBudgetOrFail(id);
        // 2. Eliminar BudgetItems asociados
        await this.budgetItemService.deleteByBudgetId(id);
        // 3. Eliminar Budget
        await this.budgetRepo.delete(id);
    }

    //* Operations with BudgetItems
    //* -----------------------------
    async getWithItems(id: number): Promise<BudgetWithItems> {
        const budget = await this.getBudgetOrFail(id);
        const items = await this.budgetItemService.getAll({ budgetId: id });
        return { ...budget, items };
    }

    async addItem(item: CreateBudgetItemInput): Promise<BudgetItemResponse> {
        // Validar que el budget existe
        const budget = await this.getBudgetOrFail(item.budgetId);
        // Validar que el presupuesto NO está PENDING
        await this.ensureStatusIsPending(budget);
        // Crear item con el budgetId
        return await this.budgetItemService.add(item);
    }

    async removeItem(itemId: number): Promise<void> {
        await this.budgetItemService.delete(itemId);
    }

    async getBudgetSummary(id: number): Promise<BudgetDetailedResponse> {
        const budget = await this.getBudgetOrFail(id);
        const items = await this.budgetItemService.getAll({ budgetId: id });
        const totalEstimated = this.calculateBudgetTotal(items);

        return {
            ...budget,
            items,
            totalEstimated,
        };
    }

    //* Public business validations
    //* -----------------------------

    async validateBudgetForRepair(budgetId: number): Promise<boolean> {
        const budget = await this.getBudgetOrFail(budgetId);
        const items = await this.budgetItemService.getAll({ budgetId });

        if (budget.status !== 'APPROVED') {
            throw new BusinessValidationError(
                'Solo se pueden usar presupuestos aprobados para reparaciones',
            );
        }

        if (items.length === 0) {
            throw new BusinessValidationError(
                'No se puede crear una reparación sin items en el presupuesto',
            );
        }

        return true;
    }

    //* Private methods
    //* -----------------------------

    private async getBudgetOrFail(id: number): Promise<Budget> {
        const budget = await this.budgetRepo.findById(id);
        if (!budget)
            throw new NotFoundError('El budget con el id solicitado no existe');
        return budget;
    }

    private async ensureReceptionExists(receptionId: number): Promise<void> {
        if (!(await this.receptionService.existsById(receptionId))) {
            throw new NotFoundError(
                'El budget con el receptionId solicitado no existe',
            );
        }
    }

    private async ensureStatusIsPending(budget: Budget): Promise<void> {
        if (budget.status !== 'PENDING') {
            throw new BusinessValidationError(
                'La operación no puede realizarse porque el presupuesto no tiene un estado activo (PENDIENTE)',
            );
        }
    }

    private calculateBudgetTotal(items: BudgetItem[]): number {
        return items.reduce((sum, item) => sum + item.estimatedPrice, 0);
    }
}
