import { ChecklistItRepository } from './checklist_item.repository.js';
import { ChecklistItService } from './checklist_item.service.js';
import { ChecklistItController } from './checklist_item.controller.js';
import { receptionService } from '../reception/index.js';

const checklistItRepository = new ChecklistItRepository();
const checklistItService = new ChecklistItService(
    checklistItRepository,
    receptionService,
);
const checklistItController = new ChecklistItController(checklistItService);

export { checklistItRepository, checklistItService, checklistItController };
