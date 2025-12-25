import { useState, useEffect } from 'react';
import { Brain, CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface ReasoningStep {
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'complete';
  result?: string;
  isPositive?: boolean;
}

interface AIReasoningFlowProps {
  resourceName: string;
  demandName: string;
  autoPlay?: boolean;
}

export default function AIReasoningFlow({
  resourceName,
  demandName,
  autoPlay = true,
}: AIReasoningFlowProps) {
  const [steps, setSteps] = useState<ReasoningStep[]>([
    {
      title: 'Analyzing Profile',
      description: `Loading ${resourceName}'s complete profile and expertise data`,
      status: 'pending',
    },
    {
      title: 'Skill Evaluation',
      description: `Comparing expertise against ${demandName} requirements`,
      status: 'pending',
    },
    {
      title: 'Availability Check',
      description: 'Calculating capacity and scheduling conflicts',
      status: 'pending',
    },
    {
      title: 'Performance History',
      description: 'Reviewing past project success and reliability metrics',
      status: 'pending',
    },
    {
      title: 'Final Scoring',
      description: 'Computing overall suitability score and confidence level',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    if (!autoPlay) return;

    let currentStep = 0;
    const processSteps = () => {
      if (currentStep < steps.length) {
        setTimeout(() => {
          setSteps(prev =>
            prev.map((step, idx) => {
              if (idx === currentStep) return { ...step, status: 'processing' };
              if (idx < currentStep)
                return {
                  ...step,
                  status: 'complete',
                  result: getResultForStep(idx),
                  isPositive: idx !== 2,
                };
              return step;
            })
          );

          setTimeout(() => {
            setSteps(prev =>
              prev.map((step, idx) => {
                if (idx === currentStep)
                  return {
                    ...step,
                    status: 'complete',
                    result: getResultForStep(currentStep),
                    isPositive: currentStep !== 2,
                  };
                return step;
              })
            );

            currentStep++;
            processSteps();
          }, 800);
        }, 200);
      }
    };

    processSteps();
  }, [autoPlay]);

  const getResultForStep = (stepIndex: number) => {
    const results = [
      '25 years of experience, 5+ key certifications',
      '87% skill match with required competencies',
      '65% availability - suitable for allocation',
      '4.8/5 average rating across 12 projects',
      'Overall Score: 84/100 - Highly Recommended',
    ];
    return results[stepIndex] || '';
  };

  const getStepIcon = (status: string, isPositive?: boolean) => {
    if (status === 'pending') {
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />;
    }
    if (status === 'processing') {
      return (
        <div className="w-5 h-5 rounded-full border-2 border-blue-400 bg-blue-50 animate-spin" />
      );
    }
    if (status === 'complete') {
      return isPositive ? (
        <CheckCircle2 size={20} className="text-emerald-500" />
      ) : (
        <AlertCircle size={20} className="text-amber-500" />
      );
    }
  };

  const allComplete = steps.every(s => s.status === 'complete');

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">AI Analysis in Progress</h3>
          <p className="text-xs text-slate-600">
            {allComplete ? 'Analysis complete' : 'Evaluating resource compatibility'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="transition-all duration-300">{getStepIcon(step.status, step.isPositive)}</div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 my-2 transition-all duration-300 ${
                      step.status === 'complete' ? 'bg-slate-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              <div className="pb-4 flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <h4 className={`font-semibold transition-all ${
                      step.status === 'complete' ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm transition-all ${
                      step.status === 'processing'
                        ? 'text-blue-600'
                        : step.status === 'complete'
                        ? 'text-slate-600'
                        : 'text-slate-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {step.status === 'processing' && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 font-medium whitespace-nowrap">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  )}
                </div>

                {step.result && (
                  <div className={`mt-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    step.isPositive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <TrendingUp size={14} />
                    {step.result}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {allComplete && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900 text-sm mb-1">Analysis Complete</p>
              <p className="text-xs text-emerald-800">
                This resource has been thoroughly evaluated and is ready for allocation. Review the detailed
                scoring breakdown above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
