import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableProps } from './types2';

export function DataTable<T extends { id: number }>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No hay datos para mostrar',
}: DataTableProps<T>) {
  //Precompilado de paths
  const compiledColumns = useMemo(() => {
    return columns.map((col) => {
      const parts = col.key.split('.');

      return {
        ...col,
        accessor: (row: T) =>
          parts.reduce<unknown>((acc, part) => {
            if (acc == null) return undefined;
            return (acc as Record<string, unknown>)[part];
          }, row),
      };
    });
  }, [columns]);

  if (isLoading) {
    return (
      <div className="w-full p-2">
        <div className="rounded-sm border">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2">
      <div className="[&>div]:max-h-70 [&>div]:rounded-sm [&>div]:border">
        <Table>
          <TableHeader>
            <TableRow className="bg-background sticky top-0">
              {compiledColumns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={compiledColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className="odd:bg-muted/50 odd:hover:bg-muted/50 hover:bg-transparent"
                >
                  {compiledColumns.map((col) => {
                    const value = col.accessor(row)
                    const content = col.cell ? col.cell(row) : value ?? '-';

                    return (
                      <TableCell key={`${row.id}-${col.key}`}>
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
