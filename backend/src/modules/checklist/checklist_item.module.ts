import { ChecklistItRepository } from './checklist_item.repository.js';
import { ChecklistItService } from './checklist_item.service.js';
import { ChecklistItController } from './checklist_item.controller.js';
import { receptionService } from '../reception/index.js';
import { PhotoRepository } from './photo/photo.repository.js';
import { PhotoService } from './photo/photo.service.js';

const photoRepository = new PhotoRepository();
const checklistItRepository = new ChecklistItRepository();

const photoService = new PhotoService(photoRepository);
const checklistItService = new ChecklistItService(
    checklistItRepository,
    receptionService,
    photoService
);

const checklistItController = new ChecklistItController(checklistItService);

export { checklistItRepository, checklistItService, checklistItController };
