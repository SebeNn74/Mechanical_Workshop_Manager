import { Router } from 'express';
import { vehicleController } from './vehicle.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateVehicleDTO,
    UpdateVehicleDTO,
    VehicleFiltersDTO,
    DuplicateVehicleCheckDTO,
} from './vehicle.types.js';

const vehicleRouter = Router();

vehicleRouter.post('/', validateDTO(CreateVehicleDTO), vehicleController.add);

vehicleRouter.post(
    '/check-duplicates',
    validateDTO(DuplicateVehicleCheckDTO),
    validateDTO(VehicleFiltersDTO, 'query'),
    vehicleController.getDuplicates,
);

vehicleRouter.get(
    '/',
    validateDTO(VehicleFiltersDTO, 'query'),
    vehicleController.getAll,
);

vehicleRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    vehicleController.getById,
);

vehicleRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateVehicleDTO),
    vehicleController.update,
);

vehicleRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    vehicleController.delete,
);

export default vehicleRouter;
