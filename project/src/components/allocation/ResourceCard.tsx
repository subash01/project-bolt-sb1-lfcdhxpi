import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info, User, Scale, Mail } from 'lucide-react';
import type { AIRecommendation, DemandRequest } from '../../types';
import AllocationEmailView from './AllocationEmailView';
import AIReasoningVisualization from './AIReasoningVisualization';
import AIReasoningFlow from './AIReasoningFlow';
import AIScoringBreakdown from './AIScoringBreakdown';

interface ResourceCardProps {
  recommendation: AIRecommendation;
  rank: number;
  onAccept: () => void;
  onRequestAlternative: () => void;
  onManualOverride: () => void;
  onViewProfile: () => void;
  isSelectedForCompare?: boolean;
  onToggleCompare?: () => void;
  showCompareOption?: boolean;
  demand?: DemandRequest;
}

const confidenceColors = {
  High: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-red-100 text-red-700',
};

export default function ResourceCard({
  recommendation,
  rank,
  onAccept,
  onRequestAlternative,
  onManualOverride,
  onViewProfile,
  isSelectedForCompare = false,
  onToggleCompare,
  showCompareOption = false,
  demand,
}: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(rank === 1);
  const [showEmailView, setShowEmailView] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<'flow' | 'detailed' | 'scoring'>('flow');
  const { resource, skillMatchScore, availabilityFit, overallScore, confidence, explanations, riskFlags } = recommendation;

  const handleAcceptWithEmail = () => {
    setShowEmailView(true);
  };

  const handleEmailSend = () => {
    setShowEmailView(false);
    onAccept();
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
      rank === 1 ? 'ring-2 ring-primary' : ''
    } ${isSelectedForCompare ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {showCompareOption && (
            <div className="pt-1">
              <button
                onClick={onToggleCompare}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelectedForCompare
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                title="Select for comparison"
              >
                {isSelectedForCompare && <Scale size={14} />}
              </button>
            </div>
          )}

          <div className="relative">
            <img
              src={resource.avatar}
              alt={resource.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            {rank <= 3 && (
              <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                rank === 1 ? 'bg-primary' : rank === 2 ? 'bg-secondary-amber' : 'bg-secondary-gray'
              }`}>
                {rank}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-dark">{resource.name}</h3>
                <p className="text-sm text-secondary-gray">{resource.role} | {resource.experience} years exp.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-dark">{overallScore}</div>
                <div className="text-xs text-secondary-gray">AI Score</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-secondary-gray mb-1">Skill Match</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skillMatchScore >= 70 ? 'bg-emerald-500' : skillMatchScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${skillMatchScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary-dark">{skillMatchScore}%</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-secondary-gray mb-1">Availability</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        availabilityFit >= 70 ? 'bg-emerald-500' : availabilityFit >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${availabilityFit}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary-dark">{resource.availability}%</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-secondary-gray mb-1">Confidence</div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${confidenceColors[confidence]}`}>
                  {confidence}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-secondary-gray hover:text-primary-dark transition-colors"
        >
          {isExpanded ? (
            <>
              Hide AI Explanation <ChevronUp size={16} />
            </>
          ) : (
            <>
              View AI Explanation <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 fade-in">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setAnalysisTab('flow')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                analysisTab === 'flow'
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-secondary-gray hover:text-primary-dark'
              }`}
            >
              AI Analysis
            </button>
            <button
              onClick={() => setAnalysisTab('detailed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                analysisTab === 'detailed'
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-secondary-gray hover:text-primary-dark'
              }`}
            >
              Detailed Breakdown
            </button>
            <button
              onClick={() => setAnalysisTab('scoring')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                analysisTab === 'scoring'
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-secondary-gray hover:text-primary-dark'
              }`}
            >
              Score Breakdown
            </button>
          </div>

          {analysisTab === 'flow' && (
            <AIReasoningFlow
              resourceName={resource.name}
              demandName={demand?.projectName || 'the demand'}
              autoPlay={true}
            />
          )}
          {analysisTab === 'detailed' && (
            <AIReasoningVisualization recommendation={recommendation} />
          )}
          {analysisTab === 'scoring' && (
            <AIScoringBreakdown
              skillMatchScore={skillMatchScore}
              availabilityFit={availabilityFit}
              pastPerformance={resource.pastPerformance || 85}
              overallScore={overallScore}
              priority={demand?.priority || 'High'}
            />
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleAcceptWithEmail}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
            >
              <Mail size={14} />
              Accept Recommendation
            </button>
            <button
              onClick={onRequestAlternative}
              className="px-4 py-2 bg-gray-100 text-primary-dark rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Request Alternative
            </button>
            <button
              onClick={onManualOverride}
              className="px-4 py-2 bg-gray-100 text-primary-dark rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Manual Override
            </button>
            <button
              onClick={onViewProfile}
              className="px-4 py-2 border border-gray-200 text-primary-dark rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-1"
            >
              <User size={14} />
              View Profile
            </button>
          </div>
        </div>
      )}

      {showEmailView && demand && (
        <AllocationEmailView
          resource={resource}
          demand={demand}
          onClose={() => setShowEmailView(false)}
          onSend={handleEmailSend}
        />
      )}
    </div>
  );
}
