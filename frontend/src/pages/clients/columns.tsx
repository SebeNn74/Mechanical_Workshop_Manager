import { Client } from '@/modules/clients/types/client.types';
import { formatDate } from '@/shared/utils/formatDate';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'documentType',
    header: 'Tipo',
    cell: ({ row }) => <div className='text-center'>{(row.getValue('documentType'))}</div>,
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
    header: 'Registro',
    cell: ({ row }) => <>{formatDate(row.getValue('createdAt'))}</>,
  },
];
