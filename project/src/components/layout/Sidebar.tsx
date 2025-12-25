import { LayoutDashboard, Users, ClipboardList, Grid3X3, UserCircle, Settings } from 'lucide-react';
import type { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'demand-details' as Page, icon: ClipboardList, label: 'Demand' },
  { id: 'resources' as Page, icon: Users, label: 'Resources' },
  { id: 'manual-override' as Page, icon: UserCircle, label: 'Allocation' },
  { id: 'settings' as Page, icon: Settings, label: 'Settings' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-20 bg-sidebar-dark min-h-screen flex flex-col items-center py-4 fixed left-0 top-0 z-50">
      <div className="mb-8">
        <div className="w-10 h-10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L16 14M16 14L4 8M16 14L28 8" stroke="#EE4961" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 30L16 18M16 18L4 24M16 18L28 24" stroke="#EE4961" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8L4 24" stroke="#EE4961" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M28 8L28 24" stroke="#EE4961" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <nav className="flex-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id ||
            (item.id === 'resources' && currentPage === 'ai-results') ||
            (item.id === 'manual-override' && currentPage === 'manual-override');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full py-4 flex flex-col items-center gap-1 transition-all duration-200 group relative
                ${isActive
                  ? 'bg-sidebar-hover text-white'
                  : 'text-secondary-gray hover:bg-sidebar-hover hover:text-white'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
              )}
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pb-4">
        <button className="w-full py-4 flex flex-col items-center gap-1 text-secondary-gray hover:text-white transition-colors">
          <Grid3X3 size={22} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">More apps</span>
        </button>
      </div>
    </aside>
  );
}
