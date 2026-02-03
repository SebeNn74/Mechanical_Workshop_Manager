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

const receptionRouter = Router();

receptionRouter.post(
    '/',
    validateDTO(CreateReceptionDTO),
    receptionController.add,
);

receptionRouter.get(
    '/',
    validateDTO(ReceptionFiltersDTO, 'query'),
    receptionController.getAll,
);

receptionRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    receptionController.getById,
);

receptionRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateReceptionDTO),
    receptionController.update,
);

receptionRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    receptionController.delete,
);

export default receptionRouter;
