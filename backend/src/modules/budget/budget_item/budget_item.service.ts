import {
    BudgetItem,
    CreateBudgetItemInput,
    UpdateBudgetItemInput,
    BudgetItemResponse,
    BudgetItemFilters,
    budgetItemToResponseDTO,
    budgetItemsToArrayResDTO,
    CreateBudgetItemBulkInput,
} from './budget_item.types.js';

import { IBudgetItemRepository } from './budget_item.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IBudgetService } from '../budget.service.js';
import { ChecklistItem } from '#/modules/checklist/checklist_item.types.js';

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
    deleteByBudgetId(budgetId: number): Promise<number>;
    createFromChecklistItems(
        budgetId: number,
        checklistItems: ChecklistItem[],
    ): Promise<BudgetItemResponse[]>;
}

export class BudgetItemService implements IBudgetItemService {
    private budgetService: IBudgetService | null = null;

    constructor(private readonly budgetItemRepo: IBudgetItemRepository) {}

    setBudgetService(budget: IBudgetService): void {
        this.budgetService = budget;
    }

    async add(budgetItem: CreateBudgetItemInput): Promise<BudgetItemResponse> {
        // Crear BudgetItem
        const newBudgetItem = await this.budgetItemRepo.create(budgetItem);
        return budgetItemToResponseDTO(newBudgetItem);
    }

    async addBulk(
        items: CreateBudgetItemBulkInput,
    ): Promise<BudgetItemResponse[]> {
        // 1. Obtener budgetItemIds únicos y validarlos
        const budgetItemIds = new Set(items.map((item) => item.budgetId));
        for (const budgetItemId of budgetItemIds) {
            await this.ensureBudgetExists(budgetItemId);
        }

        // 2. Crear todos los BudgetItems
        const createdBudgetItems = await this.budgetItemRepo.createBulk(items);
        return budgetItemsToArrayResDTO(createdBudgetItems);
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

    async deleteByBudgetId(budgetId: number): Promise<number> {
        return await this.budgetItemRepo.deleteByBudgetId(budgetId);
    }

    async createFromChecklistItems(
        budgetId: number,
        checklistItems: ChecklistItem[],
    ): Promise<BudgetItemResponse[]> {
        // 1. Validar si la lista de checklistItems está vacía
        if (checklistItems.length === 0) {
            return [];
        }
        // 2. Asegurarse de que el Budget exista
        await this.ensureBudgetExists(budgetId);

        // 3. Generar descripciones basadas en los checklistItems
        const budgetItemsToCreate: CreateBudgetItemInput[] = checklistItems.map(
            (checklistItem) => ({
                budgetId,
                description:
                    this.generateDescriptionFromChecklistItem(checklistItem),
                estimatedPrice: 0,
            }),
        );
        // 4. Crear todos los BudgetItems
        return await this.addBulk(budgetItemsToCreate);
    }

    //* Private methods
    //* -----------------------------

    private async getBudgetItemOrFail(id: number): Promise<BudgetItem> {
        const budget = await this.budgetItemRepo.findById(id);
        if (!budget)
            throw new NotFoundError(
                'El budgetItem con el id solicitado no existe',
            );
        return budget;
    }

    private async ensureBudgetExists(budgetId: number): Promise<void> {
        if (!this.budgetService) {
            throw new Error(
                'BudgetService no ha sido inicializado en BudgetItemService',
            );
        }

        if (!(await this.budgetService.existsById(budgetId))) {
            throw new NotFoundError(
                'El BudgetItem con el id solicitado no existe',
            );
        }
    }

    private generateDescriptionFromChecklistItem(
        checklistItem: ChecklistItem,
    ): string {
        const { block, item, status, notes } = checklistItem;
        let description = `${block} -> ${item} (${status})`;
        // Agregar notas si existen
        if (notes) {
            description += ` : ${notes}`;
        }
        // return: "Block -> Item (Status): Notes"
        return description;
    }
}
