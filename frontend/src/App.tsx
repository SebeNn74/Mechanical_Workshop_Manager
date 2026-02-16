import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import HomePage from './pages/home/HomePage';
import ClientsPage from './pages/clients/ClientsPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import ReceptionsPage from './pages/receptions/ReceptionsPage';
import ChecklistsPage from './pages/checklists/ChecklistsPage';
import BudgetsPage from './pages/budgets/BudgetsPage';
import RepairsPage from './pages/repairs/RepairsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/receptions" element={<ReceptionsPage />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/repairs" element={<RepairsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
