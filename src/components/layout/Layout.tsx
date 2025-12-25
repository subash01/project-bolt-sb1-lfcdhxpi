import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { Page } from '../../types';

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  breadcrumbs: string[];
}

export default function Layout({ children, currentPage, onNavigate, breadcrumbs }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <Header breadcrumbs={breadcrumbs} />
      <main className="ml-20 pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
