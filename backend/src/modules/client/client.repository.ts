import prisma from '#/config/prisma.js';
import {
    Client,
    CreateClientInput,
    UpdateClientInput,
    ClientFilters,
    DuplicateClientCheck,
} from './client.types.js';

export interface IClientRepository {
    create(data: CreateClientInput): Promise<Client>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Client | null>;
    findDuplicate(data: DuplicateClientCheck): Promise<Client | null>;
    findAll(filters: ClientFilters): Promise<Client[]>;
    update(id: number, data: UpdateClientInput): Promise<Client>;
    delete(id: number): Promise<Client>;
}

export class ClientRepository implements IClientRepository {
    async create(data: CreateClientInput): Promise<Client> {
        return await prisma.client.create({ data });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.client.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Client | null> {
        return await prisma.client.findUnique({
            where: { id },
        });
    }

    async findDuplicate(data: DuplicateClientCheck): Promise<Client | null> {
        return await prisma.client.findUnique({
            where: {
                documentType_documentNumber: {
                    documentType: data.documentType,
                    documentNumber: data.documentNumber,
                },
            },
        });
    }

    async findAll(filters: ClientFilters): Promise<Client[]> {
        return await prisma.client.findMany({
            where: { ...filters },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: number, data: UpdateClientInput): Promise<Client> {
        return await prisma.client.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Client> {
        return await prisma.client.delete({
            where: { id },
        });
    }
}
