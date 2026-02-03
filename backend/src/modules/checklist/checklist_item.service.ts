import {
    ChecklistItem,
    CreateChecklistItInput,
    UpdateChecklistItInput,
    ChecklistItResponse,
    ChecklistItFilters,
    checklistItemToResponseDTO,
    checklistItemsToArrayResDTO,
} from './checklist_item.types.js';

import { IChecklistItRepository } from './checklist_item.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';
import { IReceptionService } from '../reception/reception.service.js';
import { IPhotoService } from './photo/photo.service.js';

export interface IChecklistItService {
    add(budget: CreateChecklistItInput): Promise<ChecklistItResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<ChecklistItResponse>;
    getAll(filters: ChecklistItFilters): Promise<ChecklistItResponse[]>;
    update(
        id: number,
        data: UpdateChecklistItInput,
    ): Promise<ChecklistItResponse>;
    delete(id: number): Promise<void>;
}

export class ChecklistItService implements IChecklistItService {
    constructor(
        private readonly checklistItRepo: IChecklistItRepository,
        private readonly receptionService: IReceptionService,
        private readonly photoService: IPhotoService,
    ) {}

    async add(
        checklistIt: CreateChecklistItInput,
    ): Promise<ChecklistItResponse> {
        // 1. Validar existencia de reception
        await this.ensureReceptionExists(checklistIt.receptionId);
        // 2. Crear ChecklistItem
        const newChecklistIt = await this.checklistItRepo.create(checklistIt);
        return checklistItemToResponseDTO(newChecklistIt);
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

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getChecklistItOrFail(id);
        // 2. Eliminar ChecklistItem
        await this.checklistItRepo.delete(id);
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
