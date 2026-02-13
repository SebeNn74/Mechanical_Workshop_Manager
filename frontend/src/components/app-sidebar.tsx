import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Home from '@/assets/house.svg?react';
import Clients from '@/assets/users-round.svg?react';
import Vehicles from '@/assets/car.svg?react';
import Receptions from '@/assets/clipboard-list.svg?react';
import Checklists from '@/assets/list-todo.svg?react';
import Budgets from '@/assets/circle-dollar-sign.svg?react';
import Repairs from '@/assets/toolbox.svg?react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}

const items: SidebarItem[] = [
  { id: 'home', label: 'Inicio', icon: Home, href: '/' },
  { id: 'clients', label: 'Clientes', icon: Clients, href: '/clients' },
  { id: 'vehicles', label: 'Vehículos', icon: Vehicles, href: '/vehicles' },
  {
    id: 'receptions',
    label: 'Recepciones',
    icon: Receptions,
    href: '/receptions',
  },
  {
    id: 'checklists',
    label: 'Checklists',
    icon: Checklists,
    href: '/checklists',
  },
  { id: 'budgets', label: 'Presupuestos', icon: Budgets, href: '/budgets' },
  { id: 'repairs', label: 'Reparaciones', icon: Repairs, href: '/repairs' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (href: string) => {
    navigate(href);
  };

  const isLocationActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <Sidebar variant="floating" className="dark">
      <SidebarHeader className="text-white text-3xl font-bold text-center p-4.5">
        TALLER DIEGO
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="text-white gap-2.5">
            {items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    className="p-6 text-base"
                    isActive={isLocationActive(item.href)}
                    onClick={() => handleItemClick(item.href)}
                  >
                    <ItemIcon className="size-5! mr-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
