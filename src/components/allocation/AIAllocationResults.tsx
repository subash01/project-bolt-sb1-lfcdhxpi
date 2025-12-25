import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, Scale, X } from 'lucide-react';
import ResourceCard from './ResourceCard';
import DemandSummary from './DemandSummary';
import ResourceCompareModal from './ResourceCompareModal';
import type { DemandRequest, AIRecommendation, Resource } from '../../types';
import { mockResources, generateAIExplanations, calculateSkillMatch, calculateOverallScore, getConfidenceLevel } from '../../data/mockData';

interface AIAllocationResultsProps {
  demand: DemandRequest;
  onBack: () => void;
  onAccept: (resource: Resource) => void;
  onManualOverride: () => void;
  onViewProfile: (resource: Resource) => void;
}

export default function AIAllocationResults({
  demand,
  onBack,
  onAccept,
  onManualOverride,
  onViewProfile,
}: AIAllocationResultsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [acceptedResource, setAcceptedResource] = useState<Resource | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const recs = generateRecommendations(demand);
      setRecommendations(recs);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [demand]);

  const generateRecommendations = (demand: DemandRequest): AIRecommendation[] => {
    const filteredResources = mockResources.filter(r => r.role === demand.roleRequired);

    const scored = filteredResources.map(resource => {
      const skillMatchScore = calculateSkillMatch(resource, demand.requiredSkills, demand.minProficiency);
      const availabilityFit = Math.min(100, (resource.availability / demand.allocationPercentage) * 100);
      const overallScore = calculateOverallScore(skillMatchScore, availabilityFit, resource.pastPerformance, demand.priority);
      const confidence = getConfidenceLevel(overallScore);
      const { explanations, riskFlags } = generateAIExplanations(resource, demand);

      return {
        resource,
        skillMatchScore,
        availabilityFit: Math.round(availabilityFit),
        overallScore,
        confidence,
        explanations,
        riskFlags,
      };
    });

    return scored.sort((a, b) => b.overallScore - a.overallScore);
  };

  const handleAccept = (resource: Resource) => {
    setAcceptedResource(resource);
    onAccept(resource);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setSelectedForCompare([]);
    setTimeout(() => {
      const recs = generateRecommendations(demand);
      setRecommendations(recs);
      setIsLoading(false);
    }, 1500);
  };

  const toggleCompareSelection = (resourceId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      }
      if (prev.length >= 2) {
        return [prev[1], resourceId];
      }
      return [...prev, resourceId];
    });
  };

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      setShowCompareModal(true);
    }
  };

  const handleCompareSelect = (resourceId: string) => {
    const resource = recommendations.find(r => r.resource.id === resourceId)?.resource;
    if (resource) {
      handleAccept(resource);
    }
    setShowCompareModal(false);
    setSelectedForCompare([]);
  };

  const getCompareRecommendations = (): [AIRecommendation, AIRecommendation] | null => {
    if (selectedForCompare.length !== 2) return null;
    const rec1 = recommendations.find(r => r.resource.id === selectedForCompare[0]);
    const rec2 = recommendations.find(r => r.resource.id === selectedForCompare[1]);
    if (!rec1 || !rec2) return null;
    return [rec1, rec2];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-primary-dark mt-6">AI is analyzing resources...</h2>
        <p className="text-secondary-gray mt-2">Evaluating skill match, availability, and performance data</p>
        <div className="mt-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (acceptedResource) {
    return (
      <div className="max-w-2xl mx-auto fade-in">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Resource Allocated Successfully</h2>
          <p className="text-secondary-gray mb-6">
            {acceptedResource.name} has been assigned to {demand.projectName}
          </p>
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <img
              src={acceptedResource.avatar}
              alt={acceptedResource.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-primary-dark">{acceptedResource.name}</p>
              <p className="text-sm text-secondary-gray">{acceptedResource.role} | {demand.allocationPercentage}% allocation</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const compareRecs = getCompareRecommendations();

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-secondary-gray hover:text-primary-dark mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">AI Recommendations</h1>
          <p className="text-secondary-gray mt-1">
            Found {recommendations.length} matching resources for your requirements
          </p>
        </div>
        <div className="flex items-center gap-3">
          {recommendations.length >= 2 && (
            <button
              onClick={handleCompare}
              disabled={selectedForCompare.length !== 2}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedForCompare.length === 2
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-100 text-secondary-gray cursor-not-allowed'
              }`}
            >
              <Scale size={16} />
              Compare {selectedForCompare.length === 2 ? '(2)' : `(${selectedForCompare.length}/2)`}
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-primary-dark hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh Results
          </button>
        </div>
      </div>

      {selectedForCompare.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale size={18} className="text-blue-600" />
            <span className="text-sm text-blue-800">
              {selectedForCompare.length === 1
                ? 'Select one more resource to compare'
                : 'Ready to compare! Click the Compare button'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedForCompare.map(id => {
              const rec = recommendations.find(r => r.resource.id === id);
              if (!rec) return null;
              return (
                <div key={id} className="flex items-center gap-2 bg-white rounded-full px-3 py-1">
                  <img
                    src={rec.resource.avatar}
                    alt={rec.resource.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-primary-dark">{rec.resource.name.split(' ')[0]}</span>
                  <button
                    onClick={() => toggleCompareSelection(id)}
                    className="text-secondary-gray hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DemandSummary demand={demand} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <ResourceCard
                key={rec.resource.id}
                recommendation={rec}
                rank={index + 1}
                onAccept={() => handleAccept(rec.resource)}
                onRequestAlternative={handleRefresh}
                onManualOverride={onManualOverride}
                onViewProfile={() => onViewProfile(rec.resource)}
                isSelectedForCompare={selectedForCompare.includes(rec.resource.id)}
                onToggleCompare={() => toggleCompareSelection(rec.resource.id)}
                showCompareOption={recommendations.length >= 2}
                demand={demand}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-dark mb-2">No Matching Resources</h3>
              <p className="text-secondary-gray mb-4">
                No resources match the required role ({demand.roleRequired}). Consider adjusting your requirements or using manual selection.
              </p>
              <button
                onClick={onManualOverride}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Select Manually
              </button>
            </div>
          )}
        </div>
      </div>

      {showCompareModal && compareRecs && (
        <ResourceCompareModal
          resources={compareRecs}
          onClose={() => setShowCompareModal(false)}
          onSelect={handleCompareSelect}
        />
      )}
    </div>
  );
}
