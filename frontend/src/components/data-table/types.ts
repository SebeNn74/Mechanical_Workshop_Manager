import {ReactNode } from 'react';

export interface ColumnDef<TData, TValue> {
  accessorKey: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: TValue, row: TData) => ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string | number;
  className?: string;
}

export interface FetchState<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
