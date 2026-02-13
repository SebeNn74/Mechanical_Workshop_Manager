import { Filter } from '@/components/data-table/TableFilter';
import { Button } from '@/components/ui/button';
import { Client } from '@/modules/clients/types/client.types';
import { formatDate } from '@/shared/utils/formatDate';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'documentType',
    header: 'Tipo',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('documentType')}</div>
    ),
  },
  {
    accessorKey: 'documentNumber',
    header: 'Número Doc.',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <>{formatDate(row.getValue('createdAt'))}</>,
  },
];

export const filters: Filter[] = [
  {
    accessorKey: 'documentNumber',
    label: 'Documento',
  },
  {
    accessorKey: 'name',
    label: 'Nombre',
  },
];
