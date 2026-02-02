import { NextFunction, Request, Response } from 'express';
import { IRepairService } from './repair.service.js';
import { CreateRepairInput, UpdateRepairInput } from './repair.types.js';

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
}
