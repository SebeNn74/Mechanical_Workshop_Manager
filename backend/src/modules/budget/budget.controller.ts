import { NextFunction, Request, Response } from 'express';
import { IBudgetService } from './budget.service.js';
import { CreateBudgetInput, UpdateBudgetInput } from './budget.types.js';

export class BudgetController {
    constructor(private readonly budgetService: IBudgetService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateBudgetInput;
            const newBudget = await this.budgetService.add(data);
            return res.status(201).json(newBudget);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const budget = await this.budgetService.getById(id);
            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const budgets = await this.budgetService.getAll(filters);
            return res.json(budgets);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateBudgetInput;
            const budgetUpdated = await this.budgetService.update(id, data);
            return res.json(budgetUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.budgetService.delete(id);
            return res.status(200).json({ message: 'Presupuesto eliminado' });
        } catch (error) {
            next(error);
        }
    };
}
