import {
    Client,
    CreateClientInput,
    UpdateClientInput,
    ClientResponse,
    DuplicateClientCheck,
    ClientFilters,
    clientToResponseDTO,
    clientsToArrayResDTO,
} from './client.types.js';

import { IClientRepository } from './client.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';

export interface IClientService {
    add(client: CreateClientInput): Promise<ClientResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<ClientResponse>;
    getDuplicates(data: DuplicateClientCheck): Promise<Client[]>;
    getAll(filters: ClientFilters): Promise<ClientResponse[]>;
    update(id: number, data: UpdateClientInput): Promise<ClientResponse>;
    delete(id: number): Promise<void>;
}

export class ClientService implements IClientService {
    constructor(
        private readonly clientRepo: IClientRepository,
    ) { }

    async add(client: CreateClientInput): Promise<ClientResponse> {
        //* La validación de duplicados se realiza por aparte con getDuplicates
        // 1. Crear cliente
        const newClient = await this.clientRepo.create(client);
        return clientToResponseDTO(newClient);
    }

    async existsById(id: number): Promise<boolean> {
        return this.clientRepo.existsById(id);
    }

    async getById(id: number): Promise<ClientResponse> {
        const client = await this.getClientOrFail(id);
        return clientToResponseDTO(client);
    }

    async getDuplicates(data: DuplicateClientCheck): Promise<Client[]> {
        return this.clientRepo.findDuplicates(data);
    }

    async getAll(filters: ClientFilters): Promise<ClientResponse[]> {
        return clientsToArrayResDTO(await this.clientRepo.findAll(filters));
    }

    async update(id: number, data: UpdateClientInput): Promise<ClientResponse> {
        // 1. Verificar id
        await this.getClientOrFail(id);
        // 2. Actualizar cliente
        const updated = await this.clientRepo.update(id, data);
        return clientToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getClientOrFail(id);
        // 2. Eliminar cliente
        await this.clientRepo.delete(id);
    }

    private async getClientOrFail(id: number): Promise<Client> {
        const client = await this.clientRepo.findById(id);
        if (!client)
            throw new NotFoundError(
                'El cliente con el id solicitado no existe',
            );
        return client;
    }

}