import {
    ChecklistItem,
    CreateChecklistItInput,
    UpdateChecklistItInput,
    ChecklistItResponse,
    ChecklistItFilters,
    checklistItemToResponseDTO,
    checklistItemsToArrayResDTO,
    CreateChecklistItBulkInput,
    UpdateChecklistItBulkInput,
} from './checklist_item.types.js';

import { IChecklistItRepository } from './checklist_item.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IReceptionService } from '../reception/reception.service.js';
import { IPhotoService } from './photo/photo.service.js';

export interface IChecklistItService {
    add(budget: CreateChecklistItInput): Promise<ChecklistItResponse>;
    addBulk(items: CreateChecklistItBulkInput): Promise<ChecklistItResponse[]>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<ChecklistItResponse>;
    getAll(filters: ChecklistItFilters): Promise<ChecklistItResponse[]>;
    getByReceptionId(receptionId: number): Promise<ChecklistItResponse[]>;
    update(
        id: number,
        data: UpdateChecklistItInput,
    ): Promise<ChecklistItResponse>;
    updateBulk(
        items: UpdateChecklistItBulkInput,
    ): Promise<ChecklistItResponse[]>;
    delete(id: number): Promise<void>;
    deleteByReceptionId(receptionId: number): Promise<number>;
}

export class ChecklistItService implements IChecklistItService {
    constructor(
        private readonly checklistItRepo: IChecklistItRepository,
        private readonly receptionService: IReceptionService,
        private readonly photoService: IPhotoService,
    ) { }

    async add(
        checklistIt: CreateChecklistItInput,
    ): Promise<ChecklistItResponse> {
        // 1. Validar existencia de reception
        await this.ensureReceptionExists(checklistIt.receptionId);
        // 2. Crear ChecklistItem
        const newChecklistIt = await this.checklistItRepo.create(checklistIt);
        return checklistItemToResponseDTO(newChecklistIt);
    }

    async addBulk(
        items: CreateChecklistItBulkInput,
    ): Promise<ChecklistItResponse[]> {
        // 1. Obtener receptionIds únicos y validarlos
        const receptionIds = new Set(items.map((item) => item.receptionId));
        for (const receptionId of receptionIds) {
            await this.ensureReceptionExists(receptionId);
        }
        // 2. Crear todos los items
        const createdItems =
            await this.checklistItRepo.createBulk(items);
        return checklistItemsToArrayResDTO(createdItems);
    }

    async existsById(id: number): Promise<boolean> {
        return this.checklistItRepo.existsById(id);
    }

    async getById(id: number): Promise<ChecklistItResponse> {
        const checklistIt = await this.getChecklistItOrFail(id);
        return checklistItemToResponseDTO(checklistIt);
    }

    async getAll(filters: ChecklistItFilters): Promise<ChecklistItResponse[]> {
        return checklistItemsToArrayResDTO(
            await this.checklistItRepo.findAll(filters),
        );
    }

    async getByReceptionId(receptionId: number): Promise<ChecklistItResponse[]> {
        // Validar que la recepción exista
        await this.ensureReceptionExists(receptionId);
        return checklistItemsToArrayResDTO(
            await this.checklistItRepo.findAll({ receptionId }),
        );
    }

    async update(
        id: number,
        data: UpdateChecklistItInput,
    ): Promise<ChecklistItResponse> {
        // 1. Verificar id
        await this.getChecklistItOrFail(id);
        // 2. Actualizar ChecklistIt
        const updated = await this.checklistItRepo.update(id, data);
        return checklistItemToResponseDTO(updated);
    }

    async updateBulk(
        items: UpdateChecklistItBulkInput,
    ): Promise<ChecklistItResponse[]> {
        // 1. Validar que todos los IDs existan
        for (const item of items) {
            await this.getChecklistItOrFail(item.id);
        }

        // 2. Actualizar todos los items en una transacción
        const updatedItems = await this.checklistItRepo.updateBulk(items);
        return checklistItemsToArrayResDTO(updatedItems);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getChecklistItOrFail(id);
        // 2. Eliminar ChecklistItem
        await this.checklistItRepo.delete(id);
    }

    async deleteByReceptionId(receptionId: number): Promise<number> {
        // Validar que la recepción exista
        await this.ensureReceptionExists(receptionId);
        return await this.checklistItRepo.deleteByReceptionId(receptionId);
    }

    private async getChecklistItOrFail(id: number): Promise<ChecklistItem> {
        const checklistIt = await this.checklistItRepo.findById(id);
        if (!checklistIt)
            throw new NotFoundError(
                'El checklistItem con el id solicitado no existe',
            );
        return checklistIt;
    }

    private async ensureReceptionExists(receptionId: number): Promise<void> {
        if (!(await this.receptionService.existsById(receptionId))) {
            throw new NotFoundError(
                'El checklistItem con el receptionId solicitado no existe',
            );
        }
    }
}
