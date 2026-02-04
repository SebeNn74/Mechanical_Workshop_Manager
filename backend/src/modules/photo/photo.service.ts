import {
    Photo,
    CreatePhotoInput,
    UpdatePhotoInput,
    PhotoResponse,
    PhotoFilters,
    photoToResponseDTO,
    photosToArrayResDTO,
    CreatePhotoBulkInput,
    UpdatePhotoBulkInput,
} from './photo.types.js';

import { IPhotoRepository } from './photo.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IChecklistItService } from '../checklist/checklist_item.service.js';

export interface IPhotoService {
    add(budget: CreatePhotoInput): Promise<PhotoResponse>;
    addBulk(items: CreatePhotoBulkInput): Promise<PhotoResponse[]>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<PhotoResponse>;
    getAll(filters: PhotoFilters): Promise<PhotoResponse[]>;
    update(id: number, data: UpdatePhotoInput): Promise<PhotoResponse>;
    updateBulk(items: UpdatePhotoBulkInput): Promise<PhotoResponse[]>;
    delete(id: number): Promise<void>;
    deleteByChecklistItemId(checklistItemId: number): Promise<number>;
}

export class PhotoService implements IPhotoService {
    private checklistItService: IChecklistItService | null = null;

    constructor(private readonly photoRepo: IPhotoRepository) {}

    setChecklistItService(service: IChecklistItService): void {
        this.checklistItService = service;
    }

    async add(photo: CreatePhotoInput): Promise<PhotoResponse> {
        // 1. Validar que el ChecklistItem exista
        await this.ensureChecklistItemExists(photo.checklistItemId);
        // 2. Crear Photo
        const newPhoto = await this.photoRepo.create(photo);
        return photoToResponseDTO(newPhoto);
    }

    async addBulk(items: CreatePhotoBulkInput): Promise<PhotoResponse[]> {
        // 1. Obtener checklistItemIds únicos y validarlos
        const checklistItemIds = new Set(
            items.map((item) => item.checklistItemId),
        );
        for (const checklistItemId of checklistItemIds) {
            await this.ensureChecklistItemExists(checklistItemId);
        }

        // 2. Crear todas las fotos
        const createdPhotos = await this.photoRepo.createBulk(items);
        return photosToArrayResDTO(createdPhotos);
    }

    async existsById(id: number): Promise<boolean> {
        return this.photoRepo.existsById(id);
    }

    async getById(id: number): Promise<PhotoResponse> {
        const photo = await this.getPhotoOrFail(id);
        return photoToResponseDTO(photo);
    }

    async getAll(filters: PhotoFilters): Promise<PhotoResponse[]> {
        return photosToArrayResDTO(await this.photoRepo.findAll(filters));
    }

    async update(id: number, data: UpdatePhotoInput): Promise<PhotoResponse> {
        // 1. Verificar id
        const photo = await this.getPhotoOrFail(id);
        // 2. Si cambian el checklistItemId, validar que exista el nuevo
        if (
            data.checklistItemId &&
            data.checklistItemId !== photo.checklistItemId
        ) {
            await this.ensureChecklistItemExists(data.checklistItemId);
        }
        // 3. Actualizar Photo
        const updated = await this.photoRepo.update(id, data);
        return photoToResponseDTO(updated);
    }

    async updateBulk(items: UpdatePhotoBulkInput): Promise<PhotoResponse[]> {
        // 1. Validar que todos los IDs existan y si cambian checklistItemId validar los nuevos
        for (const item of items) {
            const photo = await this.getPhotoOrFail(item.id);
            if (
                item.data.checklistItemId &&
                item.data.checklistItemId !== photo.checklistItemId
            ) {
                await this.ensureChecklistItemExists(item.data.checklistItemId);
            }
        }
        // 2. Actualizar todas las fotos
        const updatedPhotos = await this.photoRepo.updateBulk(items);
        return photosToArrayResDTO(updatedPhotos);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getPhotoOrFail(id);
        // 2. Eliminar Photo
        await this.photoRepo.delete(id);
    }

    async deleteByChecklistItemId(checklistItemId: number): Promise<number> {
        // Validar que el ChecklistItem exista
        await this.ensureChecklistItemExists(checklistItemId);
        return await this.photoRepo.deleteByChecklistItemId(checklistItemId);
    }

    private async getPhotoOrFail(id: number): Promise<Photo> {
        const photo = await this.photoRepo.findById(id);
        if (!photo)
            throw new NotFoundError('El photo con el id solicitado no existe');
        return photo;
    }

    private async ensureChecklistItemExists(
        checklistItemId: number,
    ): Promise<void> {
        if (!this.checklistItService) {
            throw new Error(
                'ChecklistItService no ha sido inicializado en PhotoService',
            );
        }

        if (!(await this.checklistItService.existsById(checklistItemId))) {
            throw new NotFoundError(
                'El ChecklistItem con el id solicitado no existe',
            );
        }
    }
}
