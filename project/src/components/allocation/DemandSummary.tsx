import { Calendar, Briefcase, Target, DollarSign, Star } from 'lucide-react';
import type { DemandRequest } from '../../types';

interface DemandSummaryProps {
  demand: DemandRequest;
}

const priorityColors = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-50 text-blue-600',
  High: 'bg-amber-50 text-amber-600',
  Critical: 'bg-red-50 text-red-600',
};

export default function DemandSummary({ demand }: DemandSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 text-primary mb-4">
        <Briefcase size={20} />
        <span className="text-sm font-medium uppercase tracking-wide">Demand Summary</span>
      </div>

      <h2 className="text-xl font-bold text-primary-dark mb-1">{demand.projectName}</h2>
      <p className="text-secondary-gray mb-4">{demand.clientName}</p>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-secondary-gray">
            <Calendar size={16} />
          </div>
          <div>
            <p className="text-xs text-secondary-gray">Timeline</p>
            <p className="text-sm font-medium text-primary-dark">
              {new Date(demand.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} -{' '}
              {new Date(demand.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-secondary-gray">
            <Target size={16} />
          </div>
          <div>
            <p className="text-xs text-secondary-gray">Role & Allocation</p>
            <p className="text-sm font-medium text-primary-dark">
              {demand.roleRequired} at {demand.allocationPercentage}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-secondary-gray">
            <Star size={16} />
          </div>
          <div>
            <p className="text-xs text-secondary-gray">Min. Proficiency</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  className={star <= demand.minProficiency ? 'text-secondary-amber fill-secondary-amber' : 'text-gray-200'}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-secondary-gray">
            <DollarSign size={16} />
          </div>
          <div>
            <p className="text-xs text-secondary-gray">Budget Sensitivity</p>
            <p className="text-sm font-medium text-primary-dark">{demand.budgetSensitivity}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-secondary-gray mb-2">Priority</p>
        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${priorityColors[demand.priority]}`}>
          {demand.priority}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-secondary-gray mb-2">Required Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {demand.requiredSkills.map(skill => (
            <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {demand.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-secondary-gray mb-2">Notes</p>
          <p className="text-sm text-primary-dark">{demand.notes}</p>
        </div>
      )}
    </div>
  );
}
