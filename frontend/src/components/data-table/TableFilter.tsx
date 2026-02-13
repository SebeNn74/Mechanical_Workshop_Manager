import { useState } from 'react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Table } from '@tanstack/react-table';

export interface Filter {
  accessorKey: string;
  label: string;
}

interface TableFilterProps<TData> {
  table: Table<TData>;
  filters: Filter[];
}

const defaultFilter: Filter = {
  accessorKey: 'clean',
  label: 'Sin filtro',
};

export default function TableFilter<TData>({
  table,
  filters,
}: TableFilterProps<TData>) {
  const [filter, setFilter] = useState<Filter>(defaultFilter);

  const handleSelectChange = (value: string) => {
    if (value === 'clean') {
      setFilter(defaultFilter);
    } else {
      const selectedFilter = filters.find((f) => f.accessorKey === value);
      if (selectedFilter) {
        setFilter(selectedFilter);
      }
    }
  };

  return (
    <div className="flex flex-row items-center pb-4 gap-2">
      <div>
        <Select value={filter.accessorKey} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                value="clean"
                className="bg-mf-gray/20 focus:bg-mf-red/20"
              >
                Sin filtro
              </SelectItem>
              {filters.map((filter) => (
                <SelectItem
                  key={filter.accessorKey}
                  value={filter.accessorKey}
                  className="focus:bg-mf-red/20"
                >
                  {filter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          placeholder={
            filter.accessorKey === 'clean'
              ? 'Seleccione un filtro'
              : `Filtrar por ${filter.label}`
          }
          value={
            filter.accessorKey === 'clean'
              ? ''
              : ((table.getColumn(filter.accessorKey)?.getFilterValue() as string) ??
                  '')
          }
          onChange={(event) => {
            if (filter.accessorKey === 'clean') return;
            table
              .getColumn(filter.accessorKey)
              ?.setFilterValue(event.target.value);
          }}
          disabled={filter.accessorKey === 'clean'}
          className="max-w-sm"
        />
      </div>
    </div>
  );
}
