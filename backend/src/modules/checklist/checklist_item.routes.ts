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

const checklistItRouter = Router();

checklistItRouter.post(
    '/',
    validateDTO(CreateChecklistItDTO),
    checklistItController.add,
);

checklistItRouter.post(
    '/bulk',
    validateDTO(CreateChecklistItBulkDTO),
    checklistItController.addBulk,
);

checklistItRouter.get(
    '/',
    validateDTO(ChecklistItFiltersDTO, 'query'),
    checklistItController.getAll,
);

checklistItRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    checklistItController.getById,
);

checklistItRouter.put(
    '/bulk',
    validateDTO(UpdateChecklistItBulkDTO),
    checklistItController.updateBulk,
);

checklistItRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateChecklistItDTO),
    checklistItController.update,
);

checklistItRouter.delete(
    '/by-reception/:id',
    validateDTO(ParamIdDTO, 'params'),
    checklistItController.deleteByReceptionId,
);

checklistItRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    checklistItController.delete,
);

export default checklistItRouter;
