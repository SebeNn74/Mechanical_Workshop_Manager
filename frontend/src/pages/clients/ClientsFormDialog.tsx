import { Client } from '@/modules/clients/types/client.types';
import ClientsForm from '@/modules/clients/components/ClientsForm';
import { useClientForm } from '@/modules/clients/hooks/useClientForm';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';

interface ClientDialogShellProps {
  title: string;
  description: string;
  submitLabel: string;
  form: ReturnType<typeof useClientForm>['form'];
  submitting: boolean;
  disableWhenPristine?: boolean;
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ClientDialogShell = ({
  title,
  description,
  submitLabel,
  form,
  submitting,
  disableWhenPristine = false,
  onSubmit,
}: ClientDialogShellProps) => {
  const isSubmitDisabled =
    submitting || (disableWhenPristine && !form.formState.isDirty);

  return (
    <DialogContent className="p-8">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col h-full w-full py-5">
        <form id="client-form" onSubmit={form.handleSubmit(onSubmit)}>
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
            form="client-form"
            disabled={isSubmitDisabled}
          >
            {submitting ? 'Guardando...' : submitLabel}
          </Button>
        </Field>
      </DialogFooter>
    </DialogContent>
  );
};

export const CreateClientDialog = () => {
  const { form, submitting, onCreateSubmit } = useClientForm();

  return (
    <ClientDialogShell
      title="Nuevo Cliente"
      description="Llene el siguiente formulario para crear un nuevo cliente:"
      submitLabel="Crear Cliente"
      form={form}
      submitting={submitting}
      onSubmit={onCreateSubmit}
    />
  );
};

interface EditClientDialogProps {
  client: Client;
}

export const EditClientDialog = ({ client }: EditClientDialogProps) => {
  const { form, submitting, onUpdateSubmit } = useClientForm(client);

  return (
    <ClientDialogShell
      title="Editar Cliente"
      description="Modifique los datos deseados del cliente:"
      submitLabel="Actualizar Cliente"
      form={form}
      submitting={submitting}
      disableWhenPristine
      onSubmit={onUpdateSubmit}
    />
  );
};
