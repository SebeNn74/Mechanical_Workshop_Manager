import { NextFunction, Request, Response } from 'express';
import { IPhotoService } from './photo.service.js';
import {
    CreatePhotoBulkInput,
    CreatePhotoInput,
    UpdatePhotoBulkInput,
    UpdatePhotoInput,
} from './photo.types.js';

export class PhotoController {
    constructor(private readonly photoService: IPhotoService) {}

    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreatePhotoInput;
            const newPhoto = await this.photoService.add(data);
            return res.status(201).json(newPhoto);
        } catch (error) {
            next(error);
        }
    };

    addBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any).validatedBody as CreatePhotoBulkInput;
            const newPhotos = await this.photoService.addBulk(data);
            return res.status(201).json(newPhotos);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const photo = await this.photoService.getById(id);
            return res.json(photo);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = (req as any).validatedQuery;
            const photos = await this.photoService.getAll(filters);
            return res.json(photos);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            const data = (req as any).validatedBody as UpdatePhotoInput;
            const photoUpdated = await this.photoService.update(id, data);
            return res.json(photoUpdated);
        } catch (error) {
            next(error);
        }
    };

    updateBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = (req as any).validatedBody as UpdatePhotoBulkInput;
            const photosUpdated = await this.photoService.updateBulk(items);
            return res.json(photosUpdated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).validatedParams;
            await this.photoService.delete(id);
            return res.status(200).json({ message: 'Foto eliminada' });
        } catch (error) {
            next(error);
        }
    };

    deleteByChecklistItemId = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = (req as any).validatedParams;
            const count = await this.photoService.deleteByChecklistItemId(id);
            return res.status(200).json({
                message: `Se eliminaron las ${count} fotos del item con id: ${id}`,
            });
        } catch (error) {
            next(error);
        }
    };
}
