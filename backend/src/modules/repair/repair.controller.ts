import { NextFunction, Request, Response } from 'express';
import { IRepairService } from './repair.service.js';
import { CreateRepairInput, UpdateRepairInput } from './repair.types.js';
import { CreateRepairTaskInput } from './repair-task/repair-task.types.js';

export class RepairController {
    constructor(private readonly repairService: IRepairService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateRepairInput;
            const newRepair = await this.repairService.add(data);
            return res.status(201).json(newRepair);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const repair = await this.repairService.getById(id);
            return res.json(repair);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const repairs = await this.repairService.getAll(filters);
            return res.json(repairs);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateRepairInput;
            const repairUpdated = await this.repairService.update(id, data);
            return res.json(repairUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.repairService.delete(id);
            return res.status(200).json({ message: 'Reparación eliminada' });
        } catch (error) {
            next(error);
        }
    };

    //* Endpoints to manage RepairTasks
    //* -----------------------------

    addTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateRepairTaskInput;
            const newTask = await this.repairService.addTask(data);
            return res.status(201).json(newTask);
        } catch (error) {
            next(error);
        }
    };

    removeTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = (req as any).validatedParams;
            await this.repairService.removeTask(taskId);
            return res.json({ message: 'Task removido de la reparación' });
        } catch (error) {
            next(error);
        }
    };

    getRepairWithTasks = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = (req as any).validatedParams;
            const repair = await this.repairService.getWithTasks(id);
            return res.json(repair);
        } catch (error) {
            next(error);
        }
    };

    getRepairSummary = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = (req as any).validatedParams;
            const summary = await this.repairService.getRepairSummary(id);
            return res.json(summary);
        } catch (error) {
            next(error);
        }
    };
}
