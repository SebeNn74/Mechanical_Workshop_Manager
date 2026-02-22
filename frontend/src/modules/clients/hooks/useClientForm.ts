import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    CreateClientDTO,
    CreateClientInput,
    Client,
    DuplicateClientCheck,
} from '@/modules/clients/types/client.types';
import { useSubmitClient } from '@/modules/clients/hooks/useSubmitClient';

const DEFAULT_VALUES: CreateClientInput = {
    documentType: 'CC',
    documentNumber: '',
    name: '',
    phone: '',
    email: null,
    address: null,
};

const clientToFormValues = (client: Client): CreateClientInput => ({
    documentType: client.documentType,
    documentNumber: client.documentNumber,
    name: client.name,
    phone: client.phone,
    email: client.email,
    address: client.address,
});

export function useClientForm(client?: Client | null) {
    const { checkDuplicate, createClient, updateClient, submitting } =
        useSubmitClient();

    const form = useForm<CreateClientInput>({
        resolver: zodResolver(CreateClientDTO),
        defaultValues: DEFAULT_VALUES,
        values: client ? clientToFormValues(client) : undefined,
        mode: 'onTouched',
        shouldUnregister: false,
    });

    const verifyNoDuplicate = async (data: DuplicateClientCheck) => {
        const result = await checkDuplicate(data);
        if (!result.success) {
            toast.error(result.error ?? 'Error al verificar duplicados', {
                position: 'top-center',
            });
            return false;
        }
        if (result.exists) {
            toast.error('Ya existe un cliente con ese número y tipo de documento', {
                position: 'top-center',
            });
            return false;
        }
        return true;
    };

    const onCreateSubmit = async (data: CreateClientInput) => {
        const ok = await verifyNoDuplicate({
            documentNumber: data.documentNumber,
            documentType: data.documentType,
        });
        if (!ok) return;

        const result = await createClient(data);
        if (result.success) {
            toast.success('Cliente creado con éxito', { position: 'top-center' });
            form.reset();
        } else {
            toast.error(result.error, { position: 'top-center' });
        }
    };

    const onUpdateSubmit = async (data: CreateClientInput) => {
        if (!client) return;

        const dirtyFields = form.formState.dirtyFields;
        const changedData = Object.fromEntries(
            Object.keys(dirtyFields)
                .filter((key) => dirtyFields[key as keyof CreateClientInput])
                .map((key) => [key, data[key as keyof CreateClientInput]]),
        );

        if (Object.keys(changedData).length === 0) {
            toast.info('No se realizaron cambios', { position: 'top-center' });
            return;
        }

        if (changedData.documentNumber || changedData.documentType) {
            const ok = await verifyNoDuplicate({
                documentNumber: data.documentNumber,
                documentType: data.documentType,
            });
            if (!ok) return;
        }

        const result = await updateClient(client.id, changedData);
        if (result.success) {
            toast.success('Cliente actualizado con éxito', { position: 'top-center' });
            form.reset(data);
        } else {
            toast.error(result.error, { position: 'top-center' });
        }
    };

    return { form, submitting, onCreateSubmit, onUpdateSubmit };
}