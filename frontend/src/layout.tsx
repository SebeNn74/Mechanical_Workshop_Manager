import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarTrigger } from './components/app-sidebar-trigger';
import { Toaster } from './components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full">
        <AppSidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
