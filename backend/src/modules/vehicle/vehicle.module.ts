import { VehicleRepository } from './vehicle.repository.js';
import { VehicleService } from './vehicle.service.js';
import { VehicleController } from './vehicle.controller.js';
import { clientService } from '../client/index.js';

const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository, clientService);
const vehicleController = new VehicleController(vehicleService);

export { vehicleService, vehicleController };
