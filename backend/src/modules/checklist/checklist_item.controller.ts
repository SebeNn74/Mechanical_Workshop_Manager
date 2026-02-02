import { NextFunction, Request, Response } from 'express';
import { IChecklistItService } from './checklist_item.service.js';
import {
    CreateChecklistItInput,
    UpdateChecklistItInput,
} from './checklist_item.types.js';

export class ChecklistItController {
    constructor(private readonly checklistItService: IChecklistItService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateChecklistItInput;
            const newChecklistIt = await this.checklistItService.add(data);
            return res.status(201).json(newChecklistIt);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const checklistIt = await this.checklistItService.getById(id);
            return res.json(checklistIt);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const checklistItems =
                await this.checklistItService.getAll(filters);
            return res.json(checklistItems);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateChecklistItInput;
            const checklistItUpdated = await this.checklistItService.update(
                id,
                data,
            );
            return res.json(checklistItUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.checklistItService.delete(id);
            return res
                .status(200)
                .json({ message: 'Item de checklist eliminado' });
        } catch (error) {
            next(error);
        }
    };
}
