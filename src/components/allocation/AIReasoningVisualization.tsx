import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, CheckCircle2, AlertCircle, Brain, TrendingUp } from 'lucide-react';
import type { AIRecommendation } from '../../types';

interface AIReasoningVisualizationProps {
  recommendation: AIRecommendation;
}

interface ReasoningStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  score?: number;
  weight?: number;
  explanation: string;
  details?: string[];
  color: 'emerald' | 'amber' | 'red' | 'blue';
}

export default function AIReasoningVisualization({ recommendation }: AIReasoningVisualizationProps) {
  const [expandedStep, setExpandedStep] = useState<string>('overview');
  const [showDetails, setShowDetails] = useState(false);

  const { skillMatchScore, availabilityFit, overallScore, confidence, explanations, riskFlags } = recommendation;

  const reasoningSteps: ReasoningStep[] = [
    {
      id: 'overview',
      label: 'Overall Assessment',
      icon: <Brain size={18} />,
      score: overallScore,
      explanation: `This resource has been identified as a strong match for your requirements with an overall score of ${overallScore}/100.`,
      details: [
        `Confidence Level: ${confidence}`,
        `Recommendation: Highly suitable for allocation`,
      ],
      color: overallScore >= 80 ? 'emerald' : overallScore >= 60 ? 'amber' : 'red',
    },
    {
      id: 'skills',
      label: 'Skill Match Analysis',
      icon: <TrendingUp size={18} />,
      score: skillMatchScore,
      weight: 40,
      explanation: `Skill assessment shows a ${skillMatchScore}% match with your required competencies.`,
      details: explanations.filter(e => e.toLowerCase().includes('skill') || e.toLowerCase().includes('proficien')),
      color: skillMatchScore >= 70 ? 'emerald' : skillMatchScore >= 50 ? 'amber' : 'red',
    },
    {
      id: 'availability',
      label: 'Availability Fit',
      icon: <CheckCircle2 size={18} />,
      score: availabilityFit,
      weight: 30,
      explanation: `Resource availability aligns with allocation needs at ${availabilityFit}% compatibility.`,
      details: explanations.filter(e => e.toLowerCase().includes('available') || e.toLowerCase().includes('allocation')),
      color: availabilityFit >= 70 ? 'emerald' : availabilityFit >= 50 ? 'amber' : 'red',
    },
    {
      id: 'risks',
      label: 'Risk Assessment',
      icon: <AlertCircle size={18} />,
      explanation: riskFlags.length > 0
        ? `${riskFlags.length} consideration${riskFlags.length !== 1 ? 's' : ''} identified during evaluation.`
        : 'No significant risks identified.',
      details: riskFlags.length > 0 ? riskFlags : ['Clean evaluation - no blocking factors'],
      color: riskFlags.length > 0 ? 'amber' : 'emerald',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'amber':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'text-emerald-600';
      case 'amber':
        return 'text-amber-600';
      case 'red':
        return 'text-red-600';
      case 'blue':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreBarColor = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500';
      case 'amber':
        return 'bg-amber-500';
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {reasoningSteps.map((step, idx) => (
        <div
          key={step.id}
          className={`border rounded-lg transition-all cursor-pointer ${getColorClasses(step.color)}`}
          onClick={() => setExpandedStep(expandedStep === step.id ? '' : step.id)}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${getIconColor(step.color)}`}>
                {step.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      {step.label}
                      {step.weight && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          step.color === 'emerald' ? 'bg-emerald-100' :
                          step.color === 'amber' ? 'bg-amber-100' :
                          step.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {step.weight}% weight
                        </span>
                      )}
                    </h4>
                    <p className="text-sm mt-1 opacity-90">{step.explanation}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {step.score !== undefined && (
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-2xl font-bold">{step.score}</div>
                        <div className="w-24 h-2 bg-white/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getScoreBarColor(step.color)}`}
                            style={{ width: `${step.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {expandedStep === step.id && step.details && step.details.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2">
                    {step.details.map((detail, detailIdx) => (
                      <div key={detailIdx} className="flex items-start gap-2 text-sm">
                        <Zap size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.details && step.details.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
                    {expandedStep === step.id ? (
                      <>
                        <ChevronUp size={14} />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        Show details ({step.details.length})
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <Zap size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">How This Score Was Calculated</p>
            <p className="text-xs text-blue-800 leading-relaxed">
              The AI evaluated this resource across multiple dimensions: skill proficiency ({skillMatchScore}%),
              availability alignment ({availabilityFit}%), and past performance history. These factors were
              weighted to determine the overall suitability score. {riskFlags.length > 0 ? `${riskFlags.length}
              considerations were noted that you should review.` : 'The resource passed all evaluation criteria.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
