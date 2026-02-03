import { NextFunction, Request, Response } from 'express';
import { IReceptionService } from './reception.service.js';
import {
    CreateReceptionInput,
    UpdateReceptionInput,
} from './reception.types.js';

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
            const reception = await this.receptionService.getById(id);
            return res.json(reception);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const receptions = await this.receptionService.getAll(filters);
            return res.json(receptions);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateReceptionInput;
            const receptionUpdated = await this.receptionService.update(
                id,
                data,
            );
            return res.json(receptionUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.receptionService.delete(id);
            return res
                .status(200)
                .json({ message: 'Registro de recepción eliminada' });
        } catch (error) {
            next(error);
        }
    };
}
