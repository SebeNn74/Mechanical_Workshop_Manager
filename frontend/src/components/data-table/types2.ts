import { ReactNode } from 'react';

export type ColumnDef<T> = {
    key: string;
    header: string;
    accesor?: (row: T) => unknown;
    cell?: (row: T) => ReactNode;
    className?: string;
    width?: string;
    align?: string;
};

export type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
};

export const withAccessor = <T,>(key: string) => {
  const parts = key.split('.');
  return (row: T) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parts.reduce((acc: any, part) => acc?.[part], row);
};
