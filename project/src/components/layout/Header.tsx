import { Plus, Monitor, Upload, Users, Bell, ChevronRight } from 'lucide-react';

interface HeaderProps {
  breadcrumbs: string[];
}

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-20 right-0 z-40">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-secondary-gray">Home</span>
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-secondary-gray" />
            <span className={index === breadcrumbs.length - 1 ? 'text-primary font-medium' : 'text-secondary-gray'}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="px-4 py-1.5 border-2 border-primary rounded text-primary font-semibold text-sm">
          DEV
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 mr-2">
          <div className="flex items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L8 8H3L7 14L5 22L12 18L19 22L17 14L21 8H16L12 2Z" fill="#EE4961"/>
              <path d="M10 10L12 6L14 10" stroke="#F7A713" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-semibold text-primary-dark">kais</span>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary-gray hover:bg-gray-200 transition-colors">
          <Plus size={18} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary-gray hover:bg-gray-200 transition-colors">
          <Monitor size={18} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary-gray hover:bg-gray-200 transition-colors">
          <Upload size={18} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary-gray hover:bg-gray-200 transition-colors">
          <Users size={18} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary-gray hover:bg-gray-200 transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-primary-dark">Subash R</span>
        </div>
      </div>
    </header>
  );
}
