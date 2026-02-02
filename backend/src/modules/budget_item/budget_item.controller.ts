import { NextFunction, Request, Response } from 'express';
import { IBudgetItemService } from './budget_item.service.js';
import { CreateBudgetItemInput, UpdateBudgetItemInput } from './budget_item.types.js';

export class BudgetItemController {
    constructor(private readonly budgetItemService: IBudgetItemService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateBudgetItemInput;
            const newBudget = await this.budgetItemService.add(data);
            return res.status(201).json(newBudget);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const budget = await this.budgetItemService.getById(id);
            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const budgets = await this.budgetItemService.getAll(filters);
            return res.json(budgets);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateBudgetItemInput;
            const budgetUpdated = await this.budgetItemService.update(id, data);
            return res.json(budgetUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.budgetItemService.delete(id);
            return res.status(200).json({ message: 'Presupuesto eliminado' });
        } catch (error) {
            next(error);
        }
    };
}
