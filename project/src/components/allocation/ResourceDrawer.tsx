import { X, Mail, Briefcase, Star, AlertTriangle, Calendar } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourceDrawerProps {
  resource: Resource;
  onClose: () => void;
}

export default function ResourceDrawer({ resource, onClose }: ResourceDrawerProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 slide-in overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-dark">Resource Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-secondary-gray" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={resource.avatar}
              alt={resource.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-primary-dark">{resource.name}</h3>
              <p className="text-secondary-gray">{resource.role}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-secondary-gray">
                <Mail size={14} />
                {resource.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary-dark">{resource.experience}</div>
              <div className="text-xs text-secondary-gray">Years Exp.</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{resource.availability}%</div>
              <div className="text-xs text-secondary-gray">Available</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-secondary-amber">{resource.pastPerformance}</span>
                <Star size={16} className="text-secondary-amber fill-secondary-amber" />
              </div>
              <div className="text-xs text-secondary-gray">Performance</div>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-primary-dark mb-3">
              <Briefcase size={16} />
              Skill Matrix
            </h4>
            <div className="space-y-3">
              {resource.skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-dark">{skill.name}</span>
                    <span className="text-secondary-gray">{skill.rating}/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skill.rating >= 4 ? 'bg-emerald-500' : skill.rating >= 3 ? 'bg-secondary-amber' : 'bg-secondary-gray'
                      }`}
                      style={{ width: `${(skill.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-primary-dark mb-3">
              <Calendar size={16} />
              Current Allocations
            </h4>
            {resource.currentAllocations.length > 0 ? (
              <div className="space-y-3">
                {resource.currentAllocations.map((allocation, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary-dark">{allocation.projectName}</span>
                      <span className="text-sm text-secondary-gray">{allocation.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${allocation.percentage}%`, backgroundColor: allocation.color }}
                      />
                    </div>
                    <p className="text-xs text-secondary-gray mt-2">
                      {new Date(allocation.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                      {new Date(allocation.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-emerald-700 text-sm">No current allocations - Fully available</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-primary-dark mb-3">
              <Star size={16} />
              Past Project Performance
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= Math.round(resource.pastPerformance) ? 'text-secondary-amber fill-secondary-amber' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-primary-dark">{resource.pastPerformance}</span>
              </div>
              <p className="text-xs text-secondary-gray">
                Average rating from past 5 projects
              </p>
            </div>
          </div>

          {resource.riskIndicators.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-primary-dark mb-3">
                <AlertTriangle size={16} />
                Risk Indicators
              </h4>
              <div className="space-y-2">
                {resource.riskIndicators.map((risk, index) => (
                  <div key={index} className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
