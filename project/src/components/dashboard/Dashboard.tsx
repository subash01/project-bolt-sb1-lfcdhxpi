import { ClipboardList, Users, AlertTriangle, Clock, Plus, Eye } from 'lucide-react';
import KPICard from './KPICard';
import {
  SLAChart,
  RMGStatusFunnel,
  SkillDeficitChart,
  OrgUtilization,
  RMGCollaboration,
  BenchAgingChart,
  MonthlyBenchBurned,
} from './DashboardCharts';
import type { DemandRequest } from '../../types';

interface DashboardProps {
  demands: DemandRequest[];
  onCreateDemand: () => void;
  onViewDemand: (demand: DemandRequest) => void;
  onViewAllDemands: () => void;
}

export default function Dashboard({ demands, onCreateDemand, onViewDemand, onViewAllDemands }: DashboardProps) {
  const openDemands = demands.filter(d => d.status === 'Open').length;
  const inProgressDemands = demands.filter(d => d.status === 'In Progress').length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Resource Allocation Dashboard</h1>
          <p className="text-secondary-gray mt-1">Overview of demand requests and resource availability</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewAllDemands}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-primary-dark rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Eye size={18} />
            View All Demands
          </button>
          <button
            onClick={onCreateDemand}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Create Demand Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Open Demand Request"
          value={2680}
          icon={ClipboardList}
          color="primary"
          breakdown={{
            project: 1850,
            opportunity: 830
          }}
        />
        <KPICard
          title="Resources Available"
          value={2500}
          icon={Users}
          color="success"
        />
        <KPICard
          title="Overdue Demand Request"
          value={12}
          icon={AlertTriangle}
          color="warning"
          breakdown={{
            project: 8,
            opportunity: 4
          }}
        />
        <KPICard
          title="Bench Risk"
          value={18}
          subtitle="Resource > 45 Days"
          icon={Clock}
          color="danger"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Analytics & Insights</h2>

        <div className="mb-6">
          <SLAChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RMGStatusFunnel />
          <SkillDeficitChart />
        </div>

        <div className="mb-6">
          <OrgUtilization />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RMGCollaboration />
          <BenchAgingChart />
          <MonthlyBenchBurned />
        </div>
      </div>
    </div>
  );
}
