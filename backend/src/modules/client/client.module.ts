import { ClientRepository } from './client.repository.js';
import { ClientService } from './client.service.js';
import { ClientController } from './client.controller.js';

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

export { clientRepository, clientService, clientController };
