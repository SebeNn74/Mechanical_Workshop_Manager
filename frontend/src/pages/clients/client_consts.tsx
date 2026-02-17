import { Client } from '@/modules/clients/types/client.types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from '@/components/data-table/TableFilter';
import { formatDate } from '@/shared/utils/formatDate';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, TrashIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

export const getColumns = (
  onEdit: (client: Client) => void,
): ColumnDef<Client>[] => [
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
  {
    id: 'actions',
    cell: ({ row }) => {
      const client = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-5 w-5 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(client)}>
              <PencilIcon />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <TrashIcon />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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
