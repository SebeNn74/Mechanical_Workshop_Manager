import { ReceptionRepository } from './reception.repository.js';
import { ReceptionService } from './reception.service.js';
import { ReceptionController } from './reception.controller.js';
import { vehicleService } from '../vehicle/index.js';

const receptionRepository = new ReceptionRepository();
const receptionService = new ReceptionService(
    receptionRepository,
    vehicleService,
);
const receptionController = new ReceptionController(receptionService);

export { receptionService, receptionController };
