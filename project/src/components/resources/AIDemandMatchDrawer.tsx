import { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, Calendar, Target, Star, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import type { Resource, DemandRequest } from '../../types';
import { mockDemandRequests, calculateSkillMatch } from '../../data/mockData';

interface AIDemandMatchDrawerProps {
  resource: Resource;
  onClose: () => void;
  onViewDemand: (demand: DemandRequest) => void;
}

interface DemandMatch {
  demand: DemandRequest;
  skillMatch: number;
  availabilityFit: number;
  overallFit: number;
  explanations: string[];
  warnings: string[];
}

const calculateDemandFit = (resource: Resource, demand: DemandRequest): DemandMatch => {
  const skillMatch = calculateSkillMatch(resource, demand.requiredSkills, demand.minProficiency);
  const availabilityFit = Math.min(100, (resource.availability / demand.allocationPercentage) * 100);
  const overallFit = Math.round((skillMatch * 0.5) + (availabilityFit * 0.3) + (resource.pastPerformance * 4));

  const explanations: string[] = [];
  const warnings: string[] = [];

  const matchingSkills = resource.skills.filter(s => demand.requiredSkills.includes(s.name));
  if (matchingSkills.length > 0) {
    const highRated = matchingSkills.filter(s => s.rating >= demand.minProficiency);
    if (highRated.length > 0) {
      explanations.push(`Strong match on ${highRated.map(s => s.name).join(', ')}`);
    }
  }

  if (resource.availability >= demand.allocationPercentage) {
    explanations.push(`Full availability (${resource.availability}%) covers ${demand.allocationPercentage}% requirement`);
  } else if (resource.availability > 0) {
    warnings.push(`Partial availability: ${resource.availability}% vs ${demand.allocationPercentage}% required`);
  }

  if (resource.role === demand.roleRequired) {
    explanations.push(`Role match: ${resource.role}`);
  } else {
    warnings.push(`Role mismatch: ${resource.role} vs ${demand.roleRequired}`);
  }

  if (resource.pastPerformance >= 4.5) {
    explanations.push(`High performer (${resource.pastPerformance}/5 rating)`);
  }

  return {
    demand,
    skillMatch,
    availabilityFit: Math.round(availabilityFit),
    overallFit: Math.min(100, overallFit),
    explanations,
    warnings,
  };
};

export default function AIDemandMatchDrawer({ resource, onClose, onViewDemand }: AIDemandMatchDrawerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<DemandMatch[]>([]);

  const openDemands = useMemo(() =>
    mockDemandRequests.filter(d => d.status === 'Open' || d.status === 'In Progress'),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const calculated = openDemands
        .map(demand => calculateDemandFit(resource, demand))
        .sort((a, b) => b.overallFit - a.overallFit);
      setMatches(calculated);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resource, openDemands]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-xl z-50 slide-in overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-dark">AI Demand Matching</h2>
              <p className="text-sm text-secondary-gray">Best fit demands for {resource.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-secondary-gray" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
            <img
              src={resource.avatar}
              alt={resource.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-primary-dark">{resource.name}</h3>
              <p className="text-sm text-secondary-gray">{resource.role} | {resource.experience} years exp.</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {resource.availability}% available
                </span>
                <span className="text-xs text-secondary-amber bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Star size={10} className="fill-secondary-amber" />
                  {resource.pastPerformance}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-primary-dark mb-2">Skills Profile</h4>
            <div className="flex flex-wrap gap-1.5">
              {resource.skills.map(skill => (
                <span
                  key={skill.name}
                  className="px-2 py-1 bg-gray-100 text-primary-dark rounded text-xs"
                >
                  {skill.name} ({skill.rating}/5)
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-medium text-primary-dark mb-4">
              Matching Open Demands ({matches.length})
            </h4>

            {isLoading ? (
              <div className="flex flex-col items-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
                <p className="text-sm text-secondary-gray mt-4">Analyzing demand compatibility...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-secondary-gray">No open demands available for matching</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div
                    key={match.demand.id}
                    className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-md ${
                      match.overallFit >= 70 ? 'border-emerald-200' : match.overallFit >= 50 ? 'border-amber-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {index === 0 && match.overallFit >= 70 && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                                Best Match
                              </span>
                            )}
                            <h5 className="font-semibold text-primary-dark">{match.demand.projectName}</h5>
                          </div>
                          <p className="text-sm text-secondary-gray mt-0.5">{match.demand.clientName}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            match.overallFit >= 70 ? 'text-emerald-600' : match.overallFit >= 50 ? 'text-amber-600' : 'text-red-500'
                          }`}>
                            {match.overallFit}%
                          </div>
                          <div className="text-xs text-secondary-gray">Fit Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-secondary-gray mb-1">
                            <Target size={12} />
                            <span className="text-xs">Role</span>
                          </div>
                          <p className="text-sm font-medium text-primary-dark">{match.demand.roleRequired}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-secondary-gray mb-1">
                            <Calendar size={12} />
                            <span className="text-xs">Duration</span>
                          </div>
                          <p className="text-sm font-medium text-primary-dark">
                            {Math.ceil((new Date(match.demand.endDate).getTime() - new Date(match.demand.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}mo
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-secondary-gray mb-1">
                            <span className="text-xs">Allocation</span>
                          </div>
                          <p className="text-sm font-medium text-primary-dark">{match.demand.allocationPercentage}%</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-secondary-gray mb-1">Skill Match</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  match.skillMatch >= 70 ? 'bg-emerald-500' : match.skillMatch >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${match.skillMatch}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{match.skillMatch}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-secondary-gray mb-1">Availability Fit</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  match.availabilityFit >= 70 ? 'bg-emerald-500' : match.availabilityFit >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${match.availabilityFit}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{match.availabilityFit}%</span>
                          </div>
                        </div>
                      </div>

                      {match.explanations.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {match.explanations.slice(0, 2).map((exp, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-700">
                              <CheckCircle size={12} />
                              <span>{exp}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {match.warnings.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {match.warnings.slice(0, 1).map((warn, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-700">
                              <AlertTriangle size={12} />
                              <span>{warn}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => onViewDemand(match.demand)}
                        className="flex items-center justify-center gap-1 w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        View Demand Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
