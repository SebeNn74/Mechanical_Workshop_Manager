import {
  CreateClientDTO,
  CreateClientInput,
  Client,
} from '@/modules/clients/types/client.types';
import { useSubmitClient } from '@/modules/clients/hooks/useSubmitClient';
import ClientsForm from '@/modules/clients/components/ClientsForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';

interface ClientsFormDialogProps {
  model?: 'create' | 'edit';
  client?: Client | null;
}

const ClientsFormDialog = ({
  model = 'create',
  client,
}: ClientsFormDialogProps) => {
  const { checkDuplicate, submitClient, submitting } = useSubmitClient();
  const form = useForm<CreateClientInput>({
    resolver: zodResolver(CreateClientDTO),
    defaultValues: {
      documentType: 'CC',
      documentNumber: '',
      name: '',
      phone: '',
      email: null,
      address: null,
    },
    values: client
      ? {
          documentType: client.documentType,
          documentNumber: client.documentNumber,
          name: client.name,
          phone: client.phone,
          email: client.email,
          address: client.address,
        }
      : undefined,
    mode: 'onTouched',
    shouldUnregister: false,
  });

  const onSubmit = async (data: CreateClientInput) => {
    const duplicateCheck = await checkDuplicate({
      documentNumber: data.documentNumber,
      documentType: data.documentType,
    });

    if (!duplicateCheck.success) {
      toast.error(duplicateCheck.error || 'Error al verificar duplicados', {
        position: 'top-center',
      });
      return;
    }

    if (duplicateCheck.exists) {
      toast.error('Ya existe un cliente con ese número y tipo de documento', {
        position: 'top-center',
      });
      return;
    }

    const result = await submitClient(data);
    if (result.success) {
      toast.success('Cliente creado con éxito', { position: 'top-center' });
      form.reset();
    } else {
      toast.error(result.error, { position: 'top-center' });
    }
  };

  return (
    <DialogContent className="p-8">
      <DialogHeader>
        <DialogTitle>
          {model === 'edit' ? 'Editar Cliente' : 'Nuevo Cliente'}
        </DialogTitle>
        <DialogDescription>
          {model === 'edit'
            ? 'Modifique los datos deseados del cliente:'
            : 'Llene el siguiente formulario para crear un nuevo cliente:'}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col h-full w-full py-5">
        <form id="create-client-form" onSubmit={form.handleSubmit(onSubmit)}>
          <ClientsForm form={form} />
        </form>
      </div>
      <DialogFooter>
        <Field className="justify-center" orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Restablecer
          </Button>
          <Button
            type="submit"
            variant="primary"
            form="create-client-form"
            disabled={submitting}
          >
            {submitting
              ? 'Guardando...'
              : model === 'edit'
                ? 'Actualizar Cliente'
                : 'Crear Cliente'}
          </Button>
        </Field>
      </DialogFooter>
    </DialogContent>
  );
};

export default ClientsFormDialog;
