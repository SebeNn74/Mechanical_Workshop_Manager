import { Router } from 'express';
import { checklistItController } from './checklist_item.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateChecklistItDTO,
    UpdateChecklistItDTO,
    ChecklistItFiltersDTO,
    CreateChecklistItBulkDTO,
    UpdateChecklistItBulkDTO,
} from './checklist_item.types.js';

const ChecklistItRouter = Router();

ChecklistItRouter.post(
    '/',
    validateDTO(CreateChecklistItDTO),
    checklistItController.add,
);

ChecklistItRouter.post(
    '/bulk',
    validateDTO(CreateChecklistItBulkDTO),
    checklistItController.addBulk,
);

ChecklistItRouter.get(
    '/',
    validateDTO(ChecklistItFiltersDTO, 'query'),
    checklistItController.getAll,
);

ChecklistItRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    checklistItController.getById,
);

ChecklistItRouter.put(
    '/bulk',
    validateDTO(UpdateChecklistItBulkDTO),
    checklistItController.updateBulk,
);

ChecklistItRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateChecklistItDTO),
    checklistItController.update,
);

ChecklistItRouter.delete(
    '/by-reception/:id',
    validateDTO(ParamIdDTO, 'params'),
    checklistItController.deleteByReceptionId,
);

ChecklistItRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    checklistItController.delete,
);

export default ChecklistItRouter;
