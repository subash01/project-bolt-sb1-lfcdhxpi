import { X, Star, CheckCircle, AlertTriangle, Trophy, Scale } from 'lucide-react';
import type { AIRecommendation } from '../../types';

interface ResourceCompareModalProps {
  resources: [AIRecommendation, AIRecommendation];
  onClose: () => void;
  onSelect: (resourceId: string) => void;
}

export default function ResourceCompareModal({ resources, onClose, onSelect }: ResourceCompareModalProps) {
  const [rec1, rec2] = resources;

  const getBetterValue = (val1: number, val2: number): 'first' | 'second' | 'tie' => {
    if (val1 > val2) return 'first';
    if (val2 > val1) return 'second';
    return 'tie';
  };

  const renderComparisonBar = (val1: number, val2: number, label: string) => {
    const better = getBetterValue(val1, val2);
    return (
      <div className="py-3 border-b border-gray-100 last:border-0">
        <div className="text-xs text-secondary-gray text-center mb-2">{label}</div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-right">
            <span className={`text-lg font-bold ${better === 'first' ? 'text-emerald-600' : 'text-primary-dark'}`}>
              {val1}%
            </span>
            {better === 'first' && <Trophy size={14} className="inline ml-1 text-emerald-600" />}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${better === 'first' ? 'bg-emerald-500' : 'bg-gray-400'}`}
                style={{ width: `${val1}%` }}
              />
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ml-auto ${better === 'second' ? 'bg-emerald-500' : 'bg-gray-400'}`}
                style={{ width: `${val2}%` }}
              />
            </div>
          </div>
          <div className="text-left">
            {better === 'second' && <Trophy size={14} className="inline mr-1 text-emerald-600" />}
            <span className={`text-lg font-bold ${better === 'second' ? 'text-emerald-600' : 'text-primary-dark'}`}>
              {val2}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const allSkills = [...new Set([
    ...rec1.resource.skills.map(s => s.name),
    ...rec2.resource.skills.map(s => s.name)
  ])];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-50 fade-in">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Scale size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-dark">Compare Resources</h2>
              <p className="text-sm text-secondary-gray">Side-by-side comparison</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-secondary-gray" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center">
              <img
                src={rec1.resource.avatar}
                alt={rec1.resource.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-white shadow-lg"
              />
              <h3 className="font-semibold text-primary-dark text-lg">{rec1.resource.name}</h3>
              <p className="text-sm text-secondary-gray">{rec1.resource.role}</p>
              <p className="text-xs text-secondary-gray mt-1">{rec1.resource.experience} years experience</p>
              <div className="mt-3">
                <div className="text-3xl font-bold text-primary">{rec1.overallScore}</div>
                <div className="text-xs text-secondary-gray">AI Score</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-secondary-gray font-bold">
                VS
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center">
              <img
                src={rec2.resource.avatar}
                alt={rec2.resource.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-white shadow-lg"
              />
              <h3 className="font-semibold text-primary-dark text-lg">{rec2.resource.name}</h3>
              <p className="text-sm text-secondary-gray">{rec2.resource.role}</p>
              <p className="text-xs text-secondary-gray mt-1">{rec2.resource.experience} years experience</p>
              <div className="mt-3">
                <div className="text-3xl font-bold text-primary">{rec2.overallScore}</div>
                <div className="text-xs text-secondary-gray">AI Score</div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-primary-dark mb-3 text-center">Performance Metrics</h4>
              {renderComparisonBar(rec1.skillMatchScore, rec2.skillMatchScore, 'Skill Match')}
              {renderComparisonBar(rec1.availabilityFit, rec2.availabilityFit, 'Availability Fit')}
              {renderComparisonBar(rec1.overallScore, rec2.overallScore, 'Overall AI Score')}
              {renderComparisonBar(
                Math.round(rec1.resource.pastPerformance * 20),
                Math.round(rec2.resource.pastPerformance * 20),
                'Past Performance'
              )}
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-primary-dark mb-3 text-center">Skills Comparison</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-secondary-gray text-center py-2 border-b border-gray-200">
                  {rec1.resource.name.split(' ')[0]}
                </div>
                <div className="font-medium text-secondary-gray text-center py-2 border-b border-gray-200">
                  Skill
                </div>
                <div className="font-medium text-secondary-gray text-center py-2 border-b border-gray-200">
                  {rec2.resource.name.split(' ')[0]}
                </div>

                {allSkills.map(skill => {
                  const skill1 = rec1.resource.skills.find(s => s.name === skill);
                  const skill2 = rec2.resource.skills.find(s => s.name === skill);
                  const rating1 = skill1?.rating || 0;
                  const rating2 = skill2?.rating || 0;
                  const better = getBetterValue(rating1, rating2);

                  return (
                    <>
                      <div key={`${skill}-1`} className="text-center py-2">
                        {rating1 > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < rating1 ? 'text-secondary-amber fill-secondary-amber' : 'text-gray-200'}
                              />
                            ))}
                            {better === 'first' && <CheckCircle size={12} className="text-emerald-500 ml-1" />}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                      <div key={`${skill}-name`} className="text-center py-2 text-primary-dark font-medium">
                        {skill}
                      </div>
                      <div key={`${skill}-2`} className="text-center py-2">
                        {rating2 > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            {better === 'second' && <CheckCircle size={12} className="text-emerald-500 mr-1" />}
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < rating2 ? 'text-secondary-amber fill-secondary-amber' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 pb-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <CheckCircle size={14} />
                {rec1.resource.name.split(' ')[0]}'s Strengths
              </h4>
              <ul className="space-y-1.5">
                {rec1.explanations.slice(0, 3).map((exp, idx) => (
                  <li key={idx} className="text-xs text-blue-700 flex items-start gap-1.5">
                    <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                    {exp}
                  </li>
                ))}
              </ul>
              {rec1.riskFlags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h5 className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Considerations
                  </h5>
                  <ul className="space-y-1">
                    {rec1.riskFlags.slice(0, 2).map((flag, idx) => (
                      <li key={idx} className="text-xs text-amber-600">{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <CheckCircle size={14} />
                {rec2.resource.name.split(' ')[0]}'s Strengths
              </h4>
              <ul className="space-y-1.5">
                {rec2.explanations.slice(0, 3).map((exp, idx) => (
                  <li key={idx} className="text-xs text-blue-700 flex items-start gap-1.5">
                    <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                    {exp}
                  </li>
                ))}
              </ul>
              {rec2.riskFlags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h5 className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Considerations
                  </h5>
                  <ul className="space-y-1">
                    {rec2.riskFlags.slice(0, 2).map((flag, idx) => (
                      <li key={idx} className="text-xs text-amber-600">{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-gray hover:text-primary-dark transition-colors font-medium"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelect(rec1.resource.id)}
              className="px-5 py-2.5 bg-gray-100 text-primary-dark rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Select {rec1.resource.name.split(' ')[0]}
            </button>
            <button
              onClick={() => onSelect(rec2.resource.id)}
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Select {rec2.resource.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
