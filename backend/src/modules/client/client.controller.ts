import { NextFunction, Request, Response } from 'express';
import { IClientService } from './client.service.js';
import { CreateClientInput, UpdateClientInput } from './client.types.js';

export class ClientController {
    constructor(private readonly clientService: IClientService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateClientInput;
            const newClient = await this.clientService.add(data);
            return res.status(201).json(newClient);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const client = await this.clientService.getById(id);
            return res.json(client);
        } catch (error) {
            next(error);
        }
    };

    getDuplicates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody;
            const duplicates = await this.clientService.getDuplicates(data);
            return res.json(duplicates);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const clients = await this.clientService.getAll(filters);
            return res.json(clients);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateClientInput;
            const clientUpdated = await this.clientService.update(id, data);
            return res.json(clientUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.clientService.delete(id);
            return res.status(200).json({ message: 'Cliente eliminado' });
        } catch (error) {
            next(error);
        }
    };
}
