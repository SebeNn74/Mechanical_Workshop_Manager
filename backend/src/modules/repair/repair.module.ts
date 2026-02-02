import { RepairRepository } from './repair.repository.js';
import { RepairService } from './repair.service.js';
import { RepairController } from './repair.controller.js';
import { receptionService } from '../reception/index.js';
// import { RepairItemService } from './repair_task/repair_item.service.js';
// import { RepairItemRepository } from './repair_task/repair_item.repository.js';

// const repairItemRepo = new RepairItemRepository();
const repairRepository = new RepairRepository();

// const repairItemService = new RepairItemService(repairItemRepo);
const repairService = new RepairService(
    repairRepository,
    receptionService,
    // repairItemService,
);

const repairController = new RepairController(repairService);

export { repairRepository, repairService, repairController };
