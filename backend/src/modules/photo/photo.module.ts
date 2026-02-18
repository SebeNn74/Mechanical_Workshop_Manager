import { PhotoRepository } from './photo.repository.js';
import { PhotoService } from './photo.service.js';
import { PhotoController } from './photo.controller.js';

const photoRepository = new PhotoRepository();
const photoService = new PhotoService(photoRepository);
const photoController = new PhotoController(photoService);

export { photoService, photoController };
