import { RepairRepository } from './repair.repository.js';
import { RepairService } from './repair.service.js';
import { RepairController } from './repair.controller.js';
import { receptionService } from '../reception/index.js';
import { RepairTaskService } from './repair-task/repair-task.service.js';
import { RepairTaskRepository } from './repair-task/repair-task.repository.js';

const repairTaskRepo = new RepairTaskRepository();
const repairRepository = new RepairRepository();

const repairTaskService = new RepairTaskService(repairTaskRepo);
const repairService = new RepairService(
    repairRepository,
    receptionService,
    repairTaskService,
);

const repairController = new RepairController(repairService);

export { repairRepository, repairService, repairController };
