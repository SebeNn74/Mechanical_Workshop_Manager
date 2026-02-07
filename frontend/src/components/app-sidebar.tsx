import { useState } from 'react';
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

interface SidebarProps {
  onNavigate: (itemId: string) => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
  isActive?: boolean;
}

const items: SidebarItem[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'clients', label: 'Clientes', icon: Clients },
  { id: 'vehicles', label: 'Vehículos', icon: Vehicles },
  { id: 'receptions', label: 'Recepciones', icon: Receptions },
  { id: 'checklists', label: 'Checklists', icon: Checklists },
  { id: 'budgets', label: 'Presupuestos', icon: Budgets },
  { id: 'repairs', label: 'Reparaciones', icon: Repairs },
];

export function AppSidebar({ onNavigate }: SidebarProps) {
  const [activeItemId, setActiveItemId] = useState<string>('home');

  const handleItemClick = (itemId: string) => {
    setActiveItemId(itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <Sidebar variant="floating" className="dark">
      <SidebarHeader className="text-primary text-3xl font-bold text-center p-4.5">
        TALLER DIEGO
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2.5 text-primary">
            {items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    className="p-6 text-base"
                    asChild
                    isActive={activeItemId === item.id}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <a href={item.href}>
                      <ItemIcon className="size-5! mr-2" />
                      <span>{item.label}</span>
                    </a>
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
