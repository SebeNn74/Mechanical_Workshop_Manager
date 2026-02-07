import { useState } from 'react';
import Layout from './layout';
import HomePage from './pages/home/HomePage';
import ClientsPage from './pages/clients/ClientsPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import ReceptionsPage from './pages/receptions/ReceptionsPage';
import ChecklistsPage from './pages/checklists/ChecklistsPage';
import BudgetsPage from './pages/budgets/BudgetsPage';
import RepairsPage from './pages/repairs/RepairsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (itemId: string) => {
    setCurrentPage(itemId);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'clients':
        return <ClientsPage />;
      case 'vehicles':
        return <VehiclesPage />;
      case 'receptions':
        return <ReceptionsPage />;
      case 'checklists':
        return <ChecklistsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'repairs':
        return <RepairsPage />;
      default:
        return <HomePage />;
    }
  };

  return <Layout onNavigate={handleNavigation}>{renderPage()}</Layout>;
}

export default App;
