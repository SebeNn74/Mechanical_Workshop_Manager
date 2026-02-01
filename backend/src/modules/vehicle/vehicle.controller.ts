import { NextFunction, Request, Response } from 'express';
import { IVehicleService } from './vehicle.service.js';
import { CreateVehicleInput, UpdateVehicleInput } from './vehicle.types.js';

export class VehicleController {
    constructor(private readonly vehicleService: IVehicleService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreateVehicleInput;
            const newvehicle = await this.vehicleService.add(data);
            return res.status(201).json(newvehicle);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const vehicle = await this.vehicleService.getById(id);
            return res.json(vehicle);
        } catch (error) {
            next(error);
        }
    };

    getDuplicates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody;
            const duplicates = await this.vehicleService.getDuplicates(data);
            return res.json(duplicates);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const vehicles = await this.vehicleService.getAll(filters);
            return res.json(vehicles);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdateVehicleInput;
            const vehicleUpdated = await this.vehicleService.update(id, data);
            return res.json(vehicleUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.vehicleService.delete(id);
            return res.status(200).json({ message: 'Vehículo eliminado' });
        } catch (error) {
            next(error);
        }
    };
}
