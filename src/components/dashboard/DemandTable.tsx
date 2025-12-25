import { ChevronRight, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { DemandRequest } from '../../types';

interface DemandTableProps {
  demands: DemandRequest[];
  onViewDemand: (demand: DemandRequest) => void;
}

const statusConfig = {
  Open: { icon: Clock, color: 'text-blue-600 bg-blue-50', label: 'Open' },
  'In Progress': { icon: AlertCircle, color: 'text-amber-600 bg-amber-50', label: 'In Progress' },
  Fulfilled: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', label: 'Fulfilled' },
  Cancelled: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Cancelled' },
};

const priorityColors = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-50 text-blue-600',
  High: 'bg-amber-50 text-amber-600',
  Critical: 'bg-red-50 text-red-600',
};

export default function DemandTable({ demands, onViewDemand }: DemandTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-primary-dark">Recent Demand Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-gray uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {demands.map((demand) => {
              const status = statusConfig[demand.status];
              const StatusIcon = status.icon;

              return (
                <tr key={demand.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-primary-dark">{demand.projectName}</p>
                    <p className="text-xs text-secondary-gray">{demand.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-dark">{demand.clientName}</td>
                  <td className="px-6 py-4 text-sm text-primary-dark">{demand.roleRequired}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[demand.priority]}`}>
                      {demand.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-gray">
                    {new Date(demand.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(demand.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewDemand(demand)}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      View
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
