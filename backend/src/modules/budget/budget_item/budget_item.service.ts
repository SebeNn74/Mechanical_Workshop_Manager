import {
    BudgetItem,
    CreateBudgetItemInput,
    UpdateBudgetItemInput,
    BudgetItemResponse,
    BudgetItemFilters,
    budgetItemToResponseDTO,
    budgetItemsToArrayResDTO,
} from './budget_item.types.js';

import { IBudgetItemRepository } from './budget_item.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';

export interface IBudgetItemService {
    add(budget: CreateBudgetItemInput): Promise<BudgetItemResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<BudgetItemResponse>;
    getAll(filters: BudgetItemFilters): Promise<BudgetItemResponse[]>;
    update(
        id: number,
        data: UpdateBudgetItemInput,
    ): Promise<BudgetItemResponse>;
    delete(id: number): Promise<void>;
}

export class BudgetItemService implements IBudgetItemService {
    constructor(private readonly budgetItemRepo: IBudgetItemRepository) {}

    async add(budgetItem: CreateBudgetItemInput): Promise<BudgetItemResponse> {
        // Crear BudgetItem
        const newBudgetItem = await this.budgetItemRepo.create(budgetItem);
        return budgetItemToResponseDTO(newBudgetItem);
    }

    async existsById(id: number): Promise<boolean> {
        return this.budgetItemRepo.existsById(id);
    }

    async getById(id: number): Promise<BudgetItemResponse> {
        const budgetItem = await this.getBudgetItemOrFail(id);
        return budgetItemToResponseDTO(budgetItem);
    }

    async getAll(filters: BudgetItemFilters): Promise<BudgetItemResponse[]> {
        return budgetItemsToArrayResDTO(
            await this.budgetItemRepo.findAll(filters),
        );
    }

    async update(
        id: number,
        data: UpdateBudgetItemInput,
    ): Promise<BudgetItemResponse> {
        // 1. Verificar id
        await this.getBudgetItemOrFail(id);
        // 2. Actualizar BudgetItem
        const updated = await this.budgetItemRepo.update(id, data);
        return budgetItemToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getBudgetItemOrFail(id);
        // 2. Eliminar BudgetItem
        await this.budgetItemRepo.delete(id);
    }

    private async getBudgetItemOrFail(id: number): Promise<BudgetItem> {
        const budget = await this.budgetItemRepo.findById(id);
        if (!budget)
            throw new NotFoundError(
                'El budgetItem con el id solicitado no existe',
            );
        return budget;
    }
}
