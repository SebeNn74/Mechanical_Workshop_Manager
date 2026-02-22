import { Controller, UseFormReturn } from 'react-hook-form';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import {
  DocumentType,
  CreateClientInput,
} from '@/modules/clients/types/client.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClientsFormProps {
  form: UseFormReturn<CreateClientInput>;
}

const ClientsForm = ({ form }: ClientsFormProps) => {
  return (
    <FieldGroup className="gap-4">
      <div className="flex flex-row ">
        <Controller
          name="documentType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-55 gap-2">
              <FieldLabel htmlFor="documentNumber">
                Tipo de Documento
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="max-w-25">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DocumentType.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="documentNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor="documentNumber">
                Número de Documento
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="documentNumber"
                aria-invalid={fieldState.invalid}
                placeholder="Ingrese el documento de la empresa/persona"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel htmlFor="name">
              Nombre completo
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="name"
              aria-invalid={fieldState.invalid}
              placeholder="Ingrese el nombre de la empresa/persona"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel htmlFor="phone">
              Número de teléfono<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="phone"
              aria-invalid={fieldState.invalid}
              placeholder="Ingrese el número de teléfono"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ''}
              id="email"
              aria-invalid={fieldState.invalid}
              placeholder="Ingrese el email"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel htmlFor="address">Dirección</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ''}
              id="address"
              aria-invalid={fieldState.invalid}
              placeholder="Ingrese la dirección"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default ClientsForm;
