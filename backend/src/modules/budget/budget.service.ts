import {
    Budget,
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetResponse,
    BudgetFilters,
    budgetToResponseDTO,
    budgetsToArrayResDTO,
} from './budget.types.js';

import { IBudgetRepository } from './budget.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IReceptionService } from '../reception/reception.service.js';

export interface IBudgetService {
    add(budget: CreateBudgetInput): Promise<BudgetResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<BudgetResponse>;
    getAll(filters: BudgetFilters): Promise<BudgetResponse[]>;
    update(id: number, data: UpdateBudgetInput): Promise<BudgetResponse>;
    delete(id: number): Promise<void>;
}

export class BudgetService implements IBudgetService {
    constructor(
        private readonly budgetRepo: IBudgetRepository,
        private readonly receptionService: IReceptionService,
    ) {}

    async add(budget: CreateBudgetInput): Promise<BudgetResponse> {
        // 1. Validar existencia de reception
        await this.ensureReceptionExists(budget.receptionId);
        // 2. Crear Budget
        const newBudget = await this.budgetRepo.create(budget);
        return budgetToResponseDTO(newBudget);
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
        // 2. Actualizar Budgete
        const updated = await this.budgetRepo.update(id, data);
        return budgetToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getBudgetOrFail(id);
        // 2. Eliminar Budget
        await this.budgetRepo.delete(id);
    }

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
}
