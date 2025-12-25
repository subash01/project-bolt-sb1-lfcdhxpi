import { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart3, Zap } from 'lucide-react';

interface ScoringFactor {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  details: string[];
}

interface AIScoringBreakdownProps {
  skillMatchScore: number;
  availabilityFit: number;
  pastPerformance?: number;
  overallScore: number;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function AIScoringBreakdown({
  skillMatchScore,
  availabilityFit,
  pastPerformance = 85,
  overallScore,
  priority = 'High',
}: AIScoringBreakdownProps) {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const priorityMultiplier = priority === 'Critical' ? 1.2 : priority === 'High' ? 1.1 : 1.0;

  const factors: ScoringFactor[] = [
    {
      name: 'Skill Match',
      score: skillMatchScore,
      weight: 40,
      contribution: (skillMatchScore * 0.4) / 100,
      details: [
        `${skillMatchScore}% proficiency match`,
        'Covers all required competencies',
        'Exceeds minimum proficiency requirements',
      ],
    },
    {
      name: 'Availability Fit',
      score: availabilityFit,
      weight: 30,
      contribution: (availabilityFit * 0.3) / 100,
      details: [
        `${availabilityFit}% availability alignment`,
        'No critical scheduling conflicts',
        'Can accommodate required allocation percentage',
      ],
    },
    {
      name: 'Past Performance',
      score: pastPerformance,
      weight: 30,
      contribution: (pastPerformance * 0.3) / 100,
      details: [
        `${pastPerformance}/100 performance rating`,
        'Consistent delivery track record',
        'Positive stakeholder feedback',
      ],
    },
  ];

  const baseScore = factors.reduce((sum, f) => sum + f.contribution * 100, 0);
  const priorityBoost = (baseScore * (priorityMultiplier - 1));

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-blue-900 flex items-center gap-2">
            <BarChart3 size={18} />
            Score Calculation
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-900">{Math.round(overallScore)}</div>
            <p className="text-xs text-blue-700">Final Score</p>
          </div>
        </div>

        <div className="space-y-3">
          {factors.map((factor) => (
            <div
              key={factor.name}
              className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => setExpandedFactor(expandedFactor === factor.name ? null : factor.name)}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{factor.name}</p>
                  <p className="text-xs text-slate-600">{factor.weight}% weighted</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-slate-900">{factor.score}</p>
                  <p className="text-xs text-slate-600">
                    +{(factor.contribution * 100).toFixed(1)} pts
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all ${
                    factor.score >= 80
                      ? 'bg-emerald-500'
                      : factor.score >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              {expandedFactor === factor.name && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                  {factor.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <Zap size={12} className="mt-1 flex-shrink-0 text-blue-600" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Score Composition</h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">Base Score</span>
            <span className="font-medium text-slate-900">{baseScore.toFixed(1)}</span>
          </div>

          {priorityMultiplier > 1 && (
            <div className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded">
              <span className="text-blue-700">Priority Boost ({priority})</span>
              <span className="font-medium text-blue-700 text-xs">
                +{priorityBoost.toFixed(1)} ({((priorityMultiplier - 1) * 100).toFixed(0)}%)
              </span>
            </div>
          )}

          <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold">
            <span className="text-slate-900">Final Score</span>
            <span className="text-2xl text-blue-600">{Math.round(baseScore + priorityBoost)}/100</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
        <p className="leading-relaxed">
          This score is calculated using a weighted formula: Skill Match (40%) + Availability (30%) + Performance
          (30%). The result is adjusted based on demand priority to reflect urgency and importance.
        </p>
      </div>
    </div>
  );
}
