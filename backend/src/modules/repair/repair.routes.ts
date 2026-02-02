import { Router } from 'express';
import { repairController } from './repair.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateRepairDTO,
    UpdateRepairDTO,
    RepairFiltersDTO,
} from './repair.types.js';

const RepairRouter = Router();

RepairRouter.post('/', validateDTO(CreateRepairDTO), repairController.add);

RepairRouter.get(
    '/',
    validateDTO(RepairFiltersDTO, 'query'),
    repairController.getAll,
);

RepairRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    repairController.getById,
);

RepairRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateRepairDTO),
    repairController.update,
);

RepairRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    repairController.delete,
);

export default RepairRouter;
