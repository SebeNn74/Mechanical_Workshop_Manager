import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  route: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  route,
}: DataTableProps<TData, TValue>) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleRowClick = (id: string | null) => {
    setSelectedRowId(id);
  };

  const handleRowDoubleClick = (id: string) => {
    navigate(`/${route}/${id}`);
  };

  return (
    <div className="[&>div]:max-h-100 overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-mf-gray hover:bg-mf-blue sticky top-0 *:border-border [&>:not(:last-child)]:border-r"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={`cursor-pointer *:border-border [&>:not(:last-child)]:border-r transition-colors ${
                  selectedRowId === row.id ? 'bg-accent hover:bg-mf-red/50' : ''
                }`}
                onClick={() => handleRowClick(row.id)}
                onMouseOut={() => handleRowClick(null)}
                onDoubleClick={() => handleRowDoubleClick(row.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay datos para mostrar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
