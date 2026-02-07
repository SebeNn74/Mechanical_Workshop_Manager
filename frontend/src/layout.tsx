import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarTrigger } from './components/app-sidebar-trigger';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (itemId: string) => void;
}

export default function Layout({ children, onNavigate }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar onNavigate={onNavigate} />
      <main className="flex-1 w-full">
        <AppSidebarTrigger></AppSidebarTrigger>
        {children}
      </main>
    </SidebarProvider>
  );
}
