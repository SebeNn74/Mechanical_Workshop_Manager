import { NextFunction, Request, Response } from 'express';
import { IBudgetService } from './budget.service.js';
import { CreateBudgetInput, UpdateBudgetInput } from './budget.types.js';
import { CreateBudgetItemInput } from './budget_item/budget_item.types.js';

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

    //* Endpoint to manage BudgetItems
    addItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateBudgetItemInput;
            const newItem = await this.budgetService.addItem(data);
            return res.status(201).json(newItem);
        } catch (error) {
            next(error);
        }
    };

    removeItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { itemId } = (req as any).validatedParams;
            await this.budgetService.removeItem(itemId);
            return res.json({ message: 'Item removido del presupuesto' });
        } catch (error) {
            next(error);
        }
    };

    getBudgetWithItems = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = (req as any).validatedParams;
            const budget = await this.budgetService.getWithItems(id);
            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };

    getBudgetSummary = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = (req as any).validatedParams;
            const summary = await this.budgetService.getBudgetSummary(id);
            return res.json(summary);
        } catch (error) {
            next(error);
        }
    };
}
