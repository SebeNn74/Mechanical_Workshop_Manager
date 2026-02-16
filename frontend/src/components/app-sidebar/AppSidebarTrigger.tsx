import { useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import Menu from '@/assets/menu.svg';
import X from '@/assets/x.svg';

export function AppSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggle = () => {
    toggleSidebar();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <button className="fixed" onClick={handleToggle}>
      {isSidebarOpen ? (
        <img
          src={X}
          width={29}
          height={29}
          className="mt-5 bg-gray-200 rounded-3xl p-0.5"
        />
      ) : (
        <img src={Menu} className="mt-5.5 ml-5 w-6" />
      )}
    </button>
  );
}
