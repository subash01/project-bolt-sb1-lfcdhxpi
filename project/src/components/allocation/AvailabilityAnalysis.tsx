import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface AvailabilityAnalysisProps {
  resourceAvailability: number;
  requiredAllocation: number;
  explanations?: string[];
  warnings?: string[];
  monthlyAvailability?: Array<{
    month: string;
    available: number;
  }>;
}

export default function AvailabilityAnalysis({
  resourceAvailability,
  requiredAllocation,
  explanations = [],
  warnings = [],
  monthlyAvailability = [],
}: AvailabilityAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const availabilityGap = resourceAvailability - requiredAllocation;
  const meetsRequirement = availabilityGap >= 0;
  const utilizationPercent = (requiredAllocation / resourceAvailability) * 100;

  return (
    <div className="space-y-3">
      <div
        className={`border rounded-lg p-4 transition-all cursor-pointer ${
          meetsRequirement
            ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
            : 'bg-red-50 border-red-200 hover:border-red-300'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`mt-1 ${meetsRequirement ? 'text-emerald-600' : 'text-red-600'}`}
            >
              <Calendar size={18} />
            </div>

            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${
                meetsRequirement ? 'text-emerald-900' : 'text-red-900'
              }`}>
                Availability Assessment
              </h3>

              <div className="space-y-2 mb-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75 font-medium uppercase mb-1">Resource Available</p>
                    <p className="text-xl font-bold">{resourceAvailability}%</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75 font-medium uppercase mb-1">Required</p>
                    <p className="text-xl font-bold">{requiredAllocation}%</p>
                  </div>
                </div>

                <div className="bg-white/50 rounded p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="opacity-75">Allocation Capacity</span>
                    <span className="font-semibold">{Math.round(utilizationPercent)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        meetsRequirement ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <p className={`text-sm ${meetsRequirement ? 'text-emerald-800' : 'text-red-800'}`}>
                  {meetsRequirement ? (
                    <>
                      <CheckCircle2 size={14} className="inline mr-1" />
                      Resource has {availabilityGap}% capacity remaining after this allocation
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="inline mr-1" />
                      Insufficient availability: {Math.abs(availabilityGap)}% shortfall
                    </>
                  )}
                </p>
              </div>

              {(explanations.length > 0 || warnings.length > 0) && (
                <div className="flex items-center gap-1 text-xs opacity-75">
                  {isExpanded ? (
                    <>
                      <ChevronUp size={14} />
                      Hide analysis
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      Show analysis
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold font-mono">
              <span
                className={meetsRequirement ? 'text-emerald-600' : 'text-red-600'}
              >
                {meetsRequirement ? '+' : ''}{availabilityGap}%
              </span>
            </div>
            <p className="text-xs opacity-75 mt-1">Capacity Gap</p>
          </div>
        </div>

        {isExpanded && (explanations.length > 0 || warnings.length > 0) && (
          <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3">
            {explanations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 opacity-90">
                  <CheckCircle2 size={14} />
                  Positive Indicators
                </h4>
                <div className="space-y-1">
                  {explanations.map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs p-2 rounded bg-white/40"
                    >
                      <Zap size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 opacity-90">
                  <AlertCircle size={14} />
                  Considerations
                </h4>
                <div className="space-y-1">
                  {warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs p-2 rounded bg-white/40"
                    >
                      <Clock size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {monthlyAvailability && monthlyAvailability.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Monthly Availability Timeline
          </h4>
          <div className="space-y-2">
            {monthlyAvailability.slice(0, 3).map((month, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-medium text-blue-800 min-w-fit">{month.month}</span>
                <div className="flex-1 h-6 bg-white/60 rounded flex items-center overflow-hidden">
                  <div
                    className="h-full bg-blue-400 flex items-center justify-center"
                    style={{ width: `${Math.min(month.available, 100)}%` }}
                  >
                    {month.available >= 30 && (
                      <span className="text-xs font-bold text-white">{month.available}%</span>
                    )}
                  </div>
                  {month.available < 30 && (
                    <span className="text-xs font-bold text-blue-600 ml-2">{month.available}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
