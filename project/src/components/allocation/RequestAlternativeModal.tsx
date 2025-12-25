import { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Zap, User, Calendar, Award, TrendingUp } from 'lucide-react';
import type { Resource, DemandRequest } from '../../types';

interface RequestAlternativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResource: Resource | null;
  demand: DemandRequest | null;
  alternatives: Array<{
    resource: Resource;
    replacedProject?: string;
    replacedPercentage?: number;
    impactScore: number;
    explanation: string;
  }>;
  onSelectAlternative: (resource: Resource, replacedResourceId?: string) => void;
}

export default function RequestAlternativeModal({
  isOpen,
  onClose,
  currentResource,
  demand,
  alternatives,
  onSelectAlternative,
}: RequestAlternativeModalProps) {
  const [selectedResourceForDetails, setSelectedResourceForDetails] = useState<Resource | null>(null);

  if (!isOpen || !currentResource || !demand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-dark">Request Alternative Resources</h2>
            <p className="text-secondary-gray text-sm mt-1">
              Find resources to replace {currentResource.name}'s soft bookings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-secondary-gray" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Zap size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">How AI Suggestions Work</p>
                <p className="text-blue-800 text-sm mt-1">
                  AI has identified resources that can be removed from their current soft-booked projects and allocated
                  to {demand.projectName} at {demand.allocationPercentage}% capacity, improving overall resource utilization.
                </p>
              </div>
            </div>
          </div>

          {alternatives.length > 0 ? (
            <div className="space-y-4">
              {alternatives.map((alt, idx) => (
                <div
                  key={alt.resource.id}
                  className="border-2 border-green-200 rounded-xl p-5 bg-green-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={alt.resource.avatar}
                        alt={alt.resource.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-primary-dark">{alt.resource.name}</h3>
                        <p className="text-secondary-gray text-sm">
                          {alt.resource.role} | {alt.resource.experience} years exp.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                        Impact: {alt.impactScore}%
                      </span>
                    </div>
                  </div>

                  {alt.replacedProject && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <div className="flex gap-2 items-start">
                        <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-amber-900">Will be removed from:</p>
                          <p className="text-amber-800 mt-1">
                            <span className="font-bold">{alt.replacedProject}</span> ({alt.replacedPercentage}% allocation)
                          </p>
                          <p className="text-amber-700 text-xs mt-2">
                            This allows reallocation to {demand.projectName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 text-sm">AI Recommendation</p>
                        <p className="text-green-800 text-sm mt-1">{alt.explanation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onSelectAlternative(alt.resource, alt.replacedProject);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors"
                    >
                      Accept & Replace
                    </button>
                    <button
                      onClick={() => setSelectedResourceForDetails(alt.resource)}
                      className="px-4 py-2.5 border border-gray-300 text-primary-dark rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-amber-500 mb-3" />
              <p className="text-primary-dark font-semibold">No suitable alternatives found</p>
              <p className="text-secondary-gray text-sm mt-1">
                Try adjusting the skill requirements or timeline
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-primary-dark rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {selectedResourceForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary-dark">Resource Details</h3>
                <p className="text-secondary-gray text-sm mt-1">{selectedResourceForDetails.name}</p>
              </div>
              <button
                onClick={() => setSelectedResourceForDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-secondary-gray" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <img
                  src={selectedResourceForDetails.avatar}
                  alt={selectedResourceForDetails.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-dark">{selectedResourceForDetails.name}</h3>
                  <p className="text-secondary-gray">{selectedResourceForDetails.role}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-secondary-gray">
                      <Calendar size={14} className="inline mr-1" />
                      {selectedResourceForDetails.experience} experience
                    </span>
                    <span className="text-sm text-secondary-gray">
                      <Award size={14} className="inline mr-1" />
                      {selectedResourceForDetails.pastPerformance}% performance
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-primary-dark mb-3">Availability</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${selectedResourceForDetails.availability}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary">{selectedResourceForDetails.availability}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary-dark mb-3">Skills</h4>
                <div className="space-y-3">
                  {selectedResourceForDetails.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-primary-dark">{skill.name}</span>
                        <span className="text-sm font-semibold text-primary">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary-dark mb-3">Current Allocations</h4>
                <div className="space-y-3">
                  {selectedResourceForDetails.currentAllocations.length > 0 ? (
                    selectedResourceForDetails.currentAllocations.map((allocation, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-primary-dark">{allocation.projectName}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            allocation.bookingType === 'hard-booked'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {allocation.bookingType === 'hard-booked' ? 'Hard Booked' : 'Soft Booked'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-secondary-gray">Allocation</p>
                            <p className="font-semibold text-primary-dark">{allocation.percentage}%</p>
                          </div>
                          <div>
                            <p className="text-secondary-gray">Duration</p>
                            <p className="font-semibold text-primary-dark">
                              {new Date(allocation.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(allocation.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-secondary-gray py-4">No current allocations</p>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-green-700">Past Performance</p>
                        <p className="text-2xl font-bold text-green-900">{selectedResourceForDetails.pastPerformance}%</p>
                      </div>
                      <div>
                        <p className="text-green-700">Completed Projects</p>
                        <p className="text-2xl font-bold text-green-900">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedResourceForDetails(null)}
                className="px-6 py-2.5 border border-gray-300 text-primary-dark rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
