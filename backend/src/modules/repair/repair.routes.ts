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
import { CreateRepairTaskDTO } from './repair-task/repair-task.types.js';

const repairRouter = Router();

repairRouter.post('/', validateDTO(CreateRepairDTO), repairController.add);

repairRouter.post(
    '/tasks',
    validateDTO(CreateRepairTaskDTO),
    repairController.addTask,
);

repairRouter.get(
    '/',
    validateDTO(RepairFiltersDTO, 'query'),
    repairController.getAll,
);

repairRouter.get(
    '/:id/tasks',
    validateDTO(ParamIdDTO, 'params'),
    repairController.getRepairWithTasks,
);

repairRouter.get(
    '/:id/summary',
    validateDTO(ParamIdDTO, 'params'),
    repairController.getRepairSummary,
);

repairRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    repairController.getById,
);

repairRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateRepairDTO),
    repairController.update,
);

repairRouter.delete(
    '/tasks/:id',
    validateDTO(ParamIdDTO, 'params'),
    repairController.removeTask,
);

repairRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    repairController.delete,
);

export default repairRouter;
