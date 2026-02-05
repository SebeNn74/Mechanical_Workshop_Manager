import { RepairRepository } from './repair.repository.js';
import { RepairService } from './repair.service.js';
import { RepairController } from './repair.controller.js';
import { receptionService } from '../reception/index.js';
import { budgetService } from '../budget/index.js';
import { RepairTaskRepository } from './repair-task/repair-task.repository.js';
import { RepairTaskService } from './repair-task/repair-task.service.js';

const repairTaskRepo = new RepairTaskRepository();
const repairRepository = new RepairRepository();

const repairTaskService = new RepairTaskService(repairTaskRepo);
const repairService = new RepairService(
    repairRepository,
    receptionService,
    repairTaskService,
    budgetService,
);

repairTaskService.setRepairService(repairService);

const repairController = new RepairController(repairService);

export { repairRepository, repairService, repairController };
