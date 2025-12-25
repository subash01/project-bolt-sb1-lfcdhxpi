import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  breakdown?: {
    project: number;
    opportunity: number;
  };
  color: 'primary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-600',
  },
  success: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-600',
  },
  warning: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-amber-600',
  },
  danger: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    text: 'text-red-600',
  },
};

export default function KPICard({ title, value, icon: Icon, subtitle, trend, breakdown, color }: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-xl p-5 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-secondary-gray mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
          {breakdown && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-gray">Project:</span>
                <span className={`font-semibold ${colors.text}`}>{breakdown.project}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-gray">Opportunity:</span>
                <span className={`font-semibold ${colors.text}`}>{breakdown.opportunity}</span>
              </div>
            </div>
          )}
          {subtitle && (
            <p className="text-xs mt-1 text-secondary-gray font-medium">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
