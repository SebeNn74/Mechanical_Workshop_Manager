import { Router } from 'express';
import { receptionController } from './reception.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateReceptionDTO,
    UpdateReceptionDTO,
    ReceptionFiltersDTO,
} from './reception.types.js';

const ReceptionRouter = Router();

ReceptionRouter.post(
    '/',
    validateDTO(CreateReceptionDTO),
    receptionController.add,
);

ReceptionRouter.get(
    '/',
    validateDTO(ReceptionFiltersDTO, 'query'),
    receptionController.getAll,
);

ReceptionRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    receptionController.getById,
);

ReceptionRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateReceptionDTO),
    receptionController.update,
);

ReceptionRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    receptionController.delete,
);

export default ReceptionRouter;
