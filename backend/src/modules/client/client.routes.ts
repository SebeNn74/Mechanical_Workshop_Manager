import { Router } from 'express';
import { clientController } from './client.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateClientDTO,
    UpdateClientDTO,
    ClientFiltersDTO,
    DuplicateClientCheckDTO,
} from './client.types.js';

const clientRouter = Router();

clientRouter.post('/', validateDTO(CreateClientDTO), clientController.add);

clientRouter.post(
    '/check-duplicate',
    validateDTO(DuplicateClientCheckDTO),
    validateDTO(ClientFiltersDTO, 'query'),
    clientController.isDuplicate,
);

clientRouter.get(
    '/',
    validateDTO(ClientFiltersDTO, 'query'),
    clientController.getAll,
);

clientRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    clientController.getById,
);

clientRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateClientDTO),
    clientController.update,
);

clientRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    clientController.delete,
);

export default clientRouter;
