import {
  CreateClientDTO,
  CreateClientInput,
} from '@/modules/clients/types/client.types';
import { useSubmitClient } from '@/modules/clients/hooks/useSubmitClient';
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
import ClientsForm from './ClientsForm';

const ClientsFormDialog = () => {
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
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogDescription>
          Llene el siguiente formulario para crear un nuevo cliente:
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
          <Button type="submit" form="create-client-form" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Crear Cliente'}
          </Button>
        </Field>
      </DialogFooter>
    </DialogContent>
  );
};

export default ClientsFormDialog;
