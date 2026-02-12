import { columns } from './columns'
import useAllClients from '@/modules/clients/hooks/useAllUsers';
import { DataTable } from './DataTable';

const ClientsPage = () => {
  const { clients } = useAllClients();

  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full pl-17 mt-3">
        <h1 className="text-4xl font-bold tracking-tight text-ternary">
          CLIENTES
        </h1>
      </header>
      <div className="flex flex-col p-8">
        <DataTable columns={columns} data={clients} route={'clients'}></DataTable>
      </div>
    </div>
  );
};

export default ClientsPage;
