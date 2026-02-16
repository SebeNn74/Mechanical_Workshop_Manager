import { columns, filters } from './client_consts';
import { useDataTableLogic } from '@/hooks/useDataTableLogic';
import useAllClients from '@/modules/clients/hooks/useAllUsers';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/data-table/DataTable';
import TableFilter from '@/components/data-table/TableFilter';
import FetchErrorAlert from '@/components/alert/FetchErrorAlert';
import ClientsFormDialog from './ClientsFormDialog';
import { CirclePlus } from 'lucide-react';

const ClientsPage = () => {
  const { clients, loading, error, refetch } = useAllClients();
  const { table } = useDataTableLogic(clients, columns);

  if (loading)
    return (
      <div className="h-full flex justify-end items-end">
        <Spinner className="size-8 m-7" />
      </div>
    );
  if (error)
    return (
      <div className="h-full flex justify-center items-center">
        <FetchErrorAlert
          title="Error al cargar clientes"
          description={error}
          onRetry={refetch}
        />
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full pl-17 mt-3">
        <h1 className="text-4xl font-bold tracking-tight text-ternary">
          CLIENTES
        </h1>
      </header>
      <div className="h-full w-full flex flex-col p-8">
        <div className="flex flex-row items-center justify-between pb-2">
          <TableFilter table={table} filters={filters} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">
                <CirclePlus /> Nuevo Cliente
              </Button>
            </DialogTrigger>
            <ClientsFormDialog />
          </Dialog>
        </div>
        <DataTable table={table} route={'clients'} />
      </div>
    </div>
  );
};

export default ClientsPage;
