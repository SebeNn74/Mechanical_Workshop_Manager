import { NextFunction, Request, Response } from 'express';
import { IReceptionService } from './reception.service.js';
import { CreateReceptionInput, UpdateReceptionInput } from './reception.types.js';

export class ReceptionController {
    constructor(private readonly receptionService: IReceptionService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateReceptionInput;
            const newReception = await this.receptionService.add(data);
            return res.status(201).json(newReception);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const Reception = await this.receptionService.getById(id);
            return res.json(Reception);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const Receptions = await this.receptionService.getAll(filters);
            return res.json(Receptions);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateReceptionInput;
            const ReceptionUpdated = await this.receptionService.update(id, data);
            return res.json(ReceptionUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.receptionService.delete(id);
            return res.status(200).json({ message: 'Recepción eliminado' });
        } catch (error) {
            next(error);
        }
    };
}
