import { Router } from 'express';
import { photoController } from './photo.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreatePhotoDTO,
    UpdatePhotoDTO,
    PhotoFiltersDTO,
    CreatePhotoBulkDTO,
    UpdatePhotoBulkDTO,
} from './photo.types.js';

const photoRouter = Router();

photoRouter.post('/', validateDTO(CreatePhotoDTO), photoController.add);

photoRouter.post(
    '/bulk',
    validateDTO(CreatePhotoBulkDTO),
    photoController.addBulk,
);

photoRouter.get(
    '/',
    validateDTO(PhotoFiltersDTO, 'query'),
    photoController.getAll,
);

photoRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    photoController.getById,
);

photoRouter.put(
    '/bulk',
    validateDTO(UpdatePhotoBulkDTO),
    photoController.updateBulk,
);

photoRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdatePhotoDTO),
    photoController.update,
);

photoRouter.delete(
    '/by-checklist-item/:id',
    validateDTO(ParamIdDTO, 'params'),
    photoController.deleteByChecklistItemId,
);

photoRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    photoController.delete,
);

export default photoRouter;
