import { useState, useMemo } from 'react';
import { ChevronLeft, Search, Filter, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Zap, Calendar, TrendingUp, Send, User, Clock, CheckCircle, XCircle, Circle, ArrowRight, MessageSquare, FileText, UserPlus, Mail, X } from 'lucide-react';
import { mockResources } from '../../data/mockData';
import { calculateSkillMatch, calculateOverallScore, generateAIExplanations, getConfidenceLevel, generateMonthlyAvailability } from '../../data/mockData';
import RequestAlternativeModal from '../allocation/RequestAlternativeModal';
import AllocationEmailView from '../allocation/AllocationEmailView';
import type { DemandRequest, AIRecommendation, Resource } from '../../types';

interface DemandDetailPageProps {
  demand: DemandRequest;
  onBack: () => void;
}

export default function DemandDetailPage({ demand, onBack }: DemandDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'allocation' | 'forward' | 'status' | 'activities'>('allocation');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showRequestAlternativeModal, setShowRequestAlternativeModal] = useState(false);
  const [selectedResourceForAlternative, setSelectedResourceForAlternative] = useState<Resource | null>(null);
  const [showEmailView, setShowEmailView] = useState(false);
  const [selectedResourceForEmail, setSelectedResourceForEmail] = useState<Resource | null>(null);
  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedResourceForProfile, setSelectedResourceForProfile] = useState<Resource | null>(null);
  const [forwardFormData, setForwardFormData] = useState({
    recipientTeam: 'Recruitment',
    recipientName: '',
    priority: 'Medium',
    message: '',
    attachments: [] as string[],
  });
  const [isForwarding, setIsForwarding] = useState(false);

  const matchedResources = useMemo(() => {
    let recommendations: AIRecommendation[] = mockResources
      .filter(resource => {
        const roleMatch = resource.role === demand.roleRequired;
        const hasRequiredSkills = demand.requiredSkills.length === 0 ||
          demand.requiredSkills.some(skill => resource.skills.some(s => s.name === skill));
        return roleMatch && hasRequiredSkills;
      })
      .map(resource => {
        const skillMatch = calculateSkillMatch(resource, demand.requiredSkills, demand.minProficiency);
        const availabilityFit = Math.min(resource.availability, demand.allocationPercentage) / demand.allocationPercentage * 100;
        const overallScore = calculateOverallScore(skillMatch, resource.availability, resource.pastPerformance, demand.priority);
        const { explanations, riskFlags, softBookings } = generateAIExplanations(resource, demand);
        const confidence = getConfidenceLevel(overallScore);
        const monthlyAvailability = generateMonthlyAvailability(resource, demand);

        return {
          resource,
          skillMatchScore: skillMatch,
          availabilityFit,
          overallScore,
          confidence,
          explanations,
          riskFlags,
          softBookings,
          monthlyAvailability,
        };
      })
      .sort((a, b) => b.overallScore - a.overallScore);

    if (searchQuery) {
      recommendations = recommendations.filter(rec =>
        rec.resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.resource.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return recommendations;
  }, [demand, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-amber-100 text-amber-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors['Medium'];
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-50 text-green-700';
    if (score >= 50) return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-700';
  };

  const getConfidenceColor = (confidence: string) => {
    const colors: Record<string, string> = {
      'High': 'bg-green-100 text-green-800',
      'Medium': 'bg-amber-100 text-amber-800',
      'Low': 'bg-red-100 text-red-800',
    };
    return colors[confidence] || colors['Medium'];
  };

  const toggleCardExpanded = (resourceId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(resourceId)) {
      newExpanded.delete(resourceId);
    } else {
      newExpanded.add(resourceId);
    }
    setExpandedCards(newExpanded);
  };

  const generateAlternatives = (resource: Resource) => {
    return mockResources
      .filter(r => r.id !== resource.id && r.role === demand.roleRequired)
      .map(alt => {
        const softBooking = alt.currentAllocations.find(a => a.bookingType === 'soft-booked');
        return {
          resource: alt,
          replacedProject: softBooking?.projectName,
          replacedPercentage: softBooking?.percentage,
          impactScore: Math.floor(Math.random() * 30) + 70,
          explanation: `${alt.name} has strong skills in ${demand.requiredSkills.join(', ')} and can be reallocated from soft-booked projects.`,
        };
      })
      .slice(0, 3);
  };

  const handleRequestAlternative = (resource: Resource) => {
    setSelectedResourceForAlternative(resource);
    setShowRequestAlternativeModal(true);
  };

  const handleAcceptRecommendation = (resource: Resource) => {
    setSelectedResourceForEmail(resource);
    setShowEmailView(true);
  };

  const handleEmailSend = () => {
    console.log(`Allocation accepted for ${selectedResourceForEmail?.name}`);
    setShowEmailView(false);
    setSelectedResourceForEmail(null);
  };

  const handleViewProfile = (resource: Resource) => {
    setSelectedResourceForProfile(resource);
    setShowProfileView(true);
  };

  const handleForwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForwarding(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Forwarding request:', forwardFormData);
    setIsForwarding(false);
    setForwardFormData({
      recipientTeam: 'Recruitment',
      recipientName: '',
      priority: 'Medium',
      message: '',
      attachments: [],
    });
  };

  return (
    <div className="flex h-full">
      <div className="w-96 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-primary font-medium text-sm"
          >
            <ChevronLeft size={18} />
            Back To Requests
          </button>

          <div>
            <div className="mb-3">
              <p className="text-xs font-semibold text-secondary-gray uppercase mb-2">Timesheet</p>
              <h1 className="text-2xl font-bold text-primary-dark">{demand.projectName}</h1>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(demand.priority)}`}>
                {demand.priority}
              </span>
              <span className="text-sm text-secondary-gray">{demand.sourceType}</span>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <p className="text-xs font-semibold text-secondary-gray uppercase mb-3">Requested By</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                {demand.requestedBy.charAt(0)}
              </div>
              <p className="font-medium text-primary-dark">{demand.requestedBy}</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 space-y-4">
            <h3 className="font-bold text-primary-dark text-sm">Request Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">Start Date</p>
                <p className="font-semibold text-primary-dark text-sm">{formatDate(demand.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">End Date</p>
                <p className="font-semibold text-primary-dark text-sm">{formatDate(demand.endDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">Project Role</p>
                <p className="font-semibold text-primary-dark text-sm">{demand.roleRequired}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">Position</p>
                <p className="font-semibold text-primary-dark text-sm truncate" title={demand.clientName}>{demand.clientName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">Request Context</p>
                <p className="font-semibold text-primary-dark text-sm">{demand.sourceType}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">Request Closure Date</p>
                <p className="font-semibold text-primary-dark text-sm">{formatDate(demand.expectedClosureDate)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-secondary-gray mb-1 uppercase font-semibold">Utilization Capacity</p>
              <p className="font-semibold text-primary-dark text-sm">{demand.allocationPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('allocation')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'allocation'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary-gray hover:text-primary-dark'
                }`}
            >
              Allocation
            </button>
            <button
              onClick={() => setActiveTab('forward')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'forward'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary-gray hover:text-primary-dark'
                }`}
            >
              Internal Forward
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'status'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary-gray hover:text-primary-dark'
                }`}
            >
              Request Status
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'activities'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary-gray hover:text-primary-dark'
                }`}
            >
              Activities Log
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'allocation' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-gray" size={18} />
                  <input
                    type="text"
                    placeholder="Search by Employee, Position"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter size={18} className="text-secondary-gray" />
                </button>
              </div>

              <div className="space-y-4">
                {matchedResources.length > 0 ? (
                  matchedResources.map((rec) => {
                    const isExpanded = expandedCards.has(rec.resource.id);
                    return (
                      <div
                        key={rec.resource.id}
                        className="border-2 border-red-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="relative">
                              <img
                                src={rec.resource.avatar}
                                alt={rec.resource.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                1
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-primary-dark">{rec.resource.name}</h3>
                              <p className="text-secondary-gray text-sm">
                                {rec.resource.role} | {rec.resource.experience} exp.
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary-dark">{rec.overallScore.toFixed(0)}</div>
                            <div className="text-xs text-secondary-gray">AI Score</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                          <div>
                            <label className="text-xs text-secondary-gray font-semibold uppercase mb-2 block">Skill Match</label>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${rec.skillMatchScore}%` }}
                              />
                            </div>
                            <span className="text-xs text-secondary-gray">{rec.skillMatchScore}%</span>
                          </div>
                          <div>
                            <label className="text-xs text-secondary-gray font-semibold uppercase mb-2 block">Availability</label>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${rec.resource.availability}%` }}
                              />
                            </div>
                            <span className="text-xs text-secondary-gray">{rec.resource.availability}%</span>
                          </div>
                          <div>
                            <label className="text-xs text-secondary-gray font-semibold uppercase mb-2 block">Budget</label>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-secondary-gray">
                                Emp: <span className="font-semibold text-primary-dark">₹{rec.resource.employeeCtc}K</span>
                              </span>
                              <span className="text-xs text-secondary-gray">
                                Pos: <span className="font-semibold text-primary-dark">₹{rec.resource.positionCtc}K</span>
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-secondary-gray font-semibold uppercase mb-2 block">Confidence</label>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(rec.confidence)}`}>
                              {rec.confidence}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleCardExpanded(rec.resource.id)}
                          className="flex items-center gap-2 text-primary font-semibold text-sm mb-4 hover:text-primary/90 transition-colors"
                        >
                          {isExpanded ? 'Hide AI Explanation' : 'Hide AI Explanation'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isExpanded && (
                          <div className="space-y-4 mb-4 pb-4 border-t border-gray-200 pt-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-green-900 text-sm mb-2">AI Recommendation Reasoning</h4>
                                  <ul className="space-y-1">
                                    {rec.explanations.map((explanation, idx) => (
                                      <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{explanation}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                              <div className="flex items-start gap-3 mb-4">
                                <Calendar size={18} className="text-cyan-700 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-cyan-900 text-sm">Availability Analysis</h4>
                                  <p className="text-xs text-cyan-700 mt-1">
                                    {rec.resource.availability === 100
                                      ? 'Full availability across project duration'
                                      : `${rec.resource.availability}% available for allocation`
                                    }
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                                  <p className="text-xs text-cyan-600 font-semibold uppercase mb-1">Available</p>
                                  <p className="text-2xl font-bold text-cyan-700">{rec.resource.availability}%</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                                  <p className="text-xs text-cyan-600 font-semibold uppercase mb-1">Required</p>
                                  <p className="text-2xl font-bold text-cyan-700">{demand.allocationPercentage}%</p>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-cyan-700">Allocation Fit</span>
                                  <span className="text-xs font-bold text-cyan-700">
                                    {rec.resource.availability >= demand.allocationPercentage ? '✓ Fits' : '✗ Shortfall'}
                                  </span>
                                </div>
                                <div className="w-full h-3 bg-cyan-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${rec.resource.availability >= demand.allocationPercentage
                                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                                      }`}
                                    style={{ width: `${Math.min((rec.resource.availability / demand.allocationPercentage) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>

                              {rec.monthlyAvailability && rec.monthlyAvailability.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-cyan-200">
                                  <h5 className="text-xs font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                                    <TrendingUp size={14} />
                                    Monthly Timeline
                                  </h5>
                                  <div className="space-y-3">
                                    {rec.monthlyAvailability.slice(0, 3).map((monthly, idx) => (
                                      <div key={idx} className="space-y-1">
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs font-medium text-cyan-700 min-w-[70px]">{monthly.month} {monthly.year}</span>
                                          <div className="flex-1">
                                            <div className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                                              <div
                                                className={`h-full rounded-full ${monthly.availabilityPercentage === 100 ? 'bg-emerald-500' :
                                                  monthly.availabilityPercentage >= 75 ? 'bg-blue-500' :
                                                    monthly.availabilityPercentage >= 50 ? 'bg-amber-500' :
                                                      'bg-red-500'
                                                  }`}
                                                style={{ width: `${monthly.availabilityPercentage}%` }}
                                              />
                                            </div>
                                          </div>
                                          <span className="text-xs font-bold text-cyan-700 min-w-[40px] text-right">{monthly.availabilityPercentage}%</span>
                                        </div>
                                        {monthly.allocations && monthly.allocations.length > 0 && (
                                          <div className="ml-[82px] space-y-0.5">
                                            {monthly.allocations.map((alloc, allocIdx) => (
                                              <div key={allocIdx} className="flex items-center gap-2 text-xs text-cyan-700">
                                                <span className="font-semibold">{alloc.projectCode}</span>
                                                <span className="text-cyan-600">-</span>
                                                <span className="text-cyan-600 truncate">{alloc.projectName}</span>
                                                <span className="text-cyan-700 font-semibold ml-auto">({alloc.percentage}%)</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {rec.riskFlags.length > 0 && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="font-semibold text-amber-900 text-sm mb-2">Risk Flags</h4>
                                    <ul className="space-y-2">
                                      {rec.riskFlags.map((flag, idx) => (
                                        <div key={idx}>
                                          <li className="text-sm text-amber-800 flex items-start gap-2">
                                            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                                            <span>{flag}</span>
                                          </li>
                                          {flag.includes('soft booked') && rec.softBookings && rec.softBookings.length > 0 && (
                                            <div className="ml-6 mt-2 space-y-1 bg-white border border-amber-100 rounded p-2">
                                              {rec.softBookings.map((booking, bidx) => (
                                                <div key={bidx} className="text-xs text-amber-800">
                                                  <p className="font-semibold">{booking.projectName}</p>
                                                  <div className="flex justify-between mt-0.5">
                                                    <span>{booking.allocationPercentage}% allocation</span>
                                                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 font-semibold">
                                                      {booking.bookingType === 'soft-booked' ? 'Soft Booked' : 'Hard Booked'}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAcceptRecommendation(rec.resource)}
                            className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors"
                          >
                            Accept Recommendation
                          </button>
                          <button
                            onClick={() => handleRequestAlternative(rec.resource)}
                            className="px-4 py-2.5 border border-gray-300 text-primary-dark rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                          >
                            Request Alternative
                          </button>
                          <button
                            onClick={() => handleViewProfile(rec.resource)}
                            className="px-4 py-2.5 border border-gray-300 text-primary-dark rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-secondary-gray">
                    <p>No matching candidates found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'forward' && (
            <div className="p-6">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-primary-dark mb-2">Forward to Recruitment</h2>
                  <p className="text-secondary-gray">Send this resource request to the recruitment team for external candidate sourcing</p>
                </div>

                <form onSubmit={handleForwardSubmit} className="space-y-6">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      Request Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-secondary-gray mb-1">Project</p>
                        <p className="font-semibold text-primary-dark">{demand.projectName}</p>
                      </div>
                      <div>
                        <p className="text-secondary-gray mb-1">Role Required</p>
                        <p className="font-semibold text-primary-dark">{demand.roleRequired}</p>
                      </div>
                      <div>
                        <p className="text-secondary-gray mb-1">Start Date</p>
                        <p className="font-semibold text-primary-dark">{formatDate(demand.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-secondary-gray mb-1">Allocation</p>
                        <p className="font-semibold text-primary-dark">{demand.allocationPercentage}%</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-secondary-gray mb-1">Required Skills</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {demand.requiredSkills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white border border-blue-200 text-primary rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-primary-dark mb-4">Forward Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Recipient Team <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={forwardFormData.recipientTeam}
                          onChange={(e) => setForwardFormData({ ...forwardFormData, recipientTeam: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="Recruitment">Recruitment Team</option>
                          <option value="Talent Acquisition">Talent Acquisition</option>
                          <option value="HR">HR Department</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Priority Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={forwardFormData.priority}
                          onChange={(e) => setForwardFormData({ ...forwardFormData, priority: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={forwardFormData.recipientName}
                        onChange={(e) => setForwardFormData({ ...forwardFormData, recipientName: e.target.value })}
                        placeholder="Enter recipient name (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={forwardFormData.message}
                        onChange={(e) => setForwardFormData({ ...forwardFormData, message: e.target.value })}
                        placeholder="Add any additional context or special requirements..."
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setForwardFormData({
                        recipientTeam: 'Recruitment',
                        recipientName: '',
                        priority: 'Medium',
                        message: '',
                        attachments: [],
                      })}
                      className="px-6 py-2.5 border border-gray-300 text-primary-dark rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isForwarding}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isForwarding ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Forwarding...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Forward to Recruitment
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-primary-dark mb-4">Recent Forwards</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-15', team: 'Recruitment Team', recipient: 'Sarah Johnson', status: 'In Progress' },
                      { date: '2024-01-10', team: 'Talent Acquisition', recipient: 'Mike Chen', status: 'Completed' },
                    ].map((forward, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                            {forward.recipient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-primary-dark">{forward.team}</p>
                            <p className="text-xs text-secondary-gray">To: {forward.recipient} • {forward.date}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${forward.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {forward.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-primary-dark mb-2">Request Status Workflow</h2>
                  <p className="text-secondary-gray">Track the progress of this resource request through our workflow</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-primary-dark">Current Status</h3>
                    <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold">
                      {demand.requestStatus || 'In Progress'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-secondary-gray mb-1">Request ID</p>
                      <p className="font-semibold text-primary-dark">{demand.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-gray mb-1">Created Date</p>
                      <p className="font-semibold text-primary-dark">{formatDate(demand.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-gray mb-1">Expected Closure</p>
                      <p className="font-semibold text-primary-dark">{formatDate(demand.expectedClosureDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-primary-dark mb-6">Workflow Progress</h3>
                  <div className="space-y-8">
                    {[
                      {
                        status: 'Submitted',
                        icon: CheckCircle,
                        color: 'text-green-500',
                        bgColor: 'bg-green-100',
                        completed: true,
                        date: '2024-01-10',
                        time: '10:30 AM',
                        description: 'Request submitted by ' + demand.requestedBy
                      },
                      {
                        status: 'Under Review',
                        icon: Clock,
                        color: 'text-blue-500',
                        bgColor: 'bg-blue-100',
                        completed: true,
                        date: '2024-01-11',
                        time: '02:15 PM',
                        description: 'Request reviewed by allocation team'
                      },
                      {
                        status: 'AI Matching',
                        icon: Zap,
                        color: 'text-blue-500',
                        bgColor: 'bg-blue-100',
                        completed: true,
                        date: '2024-01-12',
                        time: '09:45 AM',
                        description: 'AI engine generated resource recommendations'
                      },
                      {
                        status: 'Pending Approval',
                        icon: Circle,
                        color: 'text-amber-500',
                        bgColor: 'bg-amber-100',
                        completed: false,
                        date: null,
                        time: null,
                        description: 'Awaiting manager approval'
                      },
                      {
                        status: 'Allocated',
                        icon: Circle,
                        color: 'text-gray-400',
                        bgColor: 'bg-gray-100',
                        completed: false,
                        date: null,
                        time: null,
                        description: 'Resource allocation finalized'
                      },
                    ].map((step, idx, arr) => {
                      const Icon = step.icon;
                      const isLast = idx === arr.length - 1;

                      return (
                        <div key={idx} className="relative">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center ${step.completed ? 'ring-4 ring-offset-2 ring-blue-200' : ''}`}>
                                <Icon className={step.color} size={24} />
                              </div>
                              {!isLast && (
                                <div className={`absolute left-1/2 top-12 w-0.5 h-8 -translate-x-1/2 ${step.completed ? 'bg-blue-300' : 'bg-gray-300'
                                  }`} />
                              )}
                            </div>

                            <div className="flex-1 pb-8">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`font-semibold ${step.completed ? 'text-primary-dark' : 'text-secondary-gray'}`}>
                                  {step.status}
                                </h4>
                                {step.date && (
                                  <span className="text-xs text-secondary-gray">
                                    {step.date} • {step.time}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-gray">{step.description}</p>
                              {step.completed && (
                                <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600">
                                  <CheckCircle size={12} />
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                      <User size={18} className="text-primary" />
                      Assigned Stakeholders
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                          {demand.requestedBy.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-primary-dark text-sm">{demand.requestedBy}</p>
                          <p className="text-xs text-secondary-gray">Requester</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-semibold">
                          AM
                        </div>
                        <div>
                          <p className="font-medium text-primary-dark text-sm">Alex Morgan</p>
                          <p className="text-xs text-secondary-gray">Allocation Manager</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-primary-dark mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-secondary-gray">Time Elapsed</span>
                          <span className="text-sm font-semibold text-primary-dark">3 days</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-secondary-gray">Completion</span>
                          <span className="text-sm font-semibold text-primary-dark">60%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-gray">Candidates Found</span>
                          <span className="text-2xl font-bold text-primary">{matchedResources.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-primary-dark mb-2">Activities Log</h2>
                  <p className="text-secondary-gray">Complete history of actions and updates for this request</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search activities..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>All Activities</option>
                      <option>Status Changes</option>
                      <option>Comments</option>
                      <option>Approvals</option>
                      <option>Forwards</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      type: 'comment',
                      icon: MessageSquare,
                      iconColor: 'text-blue-500',
                      iconBg: 'bg-blue-100',
                      user: 'Alex Morgan',
                      userInitials: 'AM',
                      userColor: 'from-blue-400 to-cyan-400',
                      action: 'added a comment',
                      content: 'This is a high-priority request. We need to expedite the allocation process.',
                      timestamp: '2 hours ago',
                      date: '2024-01-15 02:30 PM'
                    },
                    {
                      type: 'status',
                      icon: CheckCircle,
                      iconColor: 'text-green-500',
                      iconBg: 'bg-green-100',
                      user: 'System',
                      userInitials: 'SY',
                      userColor: 'from-gray-400 to-gray-500',
                      action: 'updated status',
                      content: 'Status changed from "Under Review" to "AI Matching"',
                      timestamp: '5 hours ago',
                      date: '2024-01-15 11:30 AM'
                    },
                    {
                      type: 'approval',
                      icon: CheckCircle2,
                      iconColor: 'text-emerald-500',
                      iconBg: 'bg-emerald-100',
                      user: 'Sarah Johnson',
                      userInitials: 'SJ',
                      userColor: 'from-emerald-400 to-green-400',
                      action: 'approved the request',
                      content: 'Request approved for AI matching process',
                      timestamp: '1 day ago',
                      date: '2024-01-14 03:45 PM'
                    },
                    {
                      type: 'forward',
                      icon: Send,
                      iconColor: 'text-purple-500',
                      iconBg: 'bg-purple-100',
                      user: demand.requestedBy,
                      userInitials: demand.requestedBy.split(' ').map(n => n[0]).join(''),
                      userColor: 'from-purple-400 to-pink-400',
                      action: 'forwarded to Recruitment Team',
                      content: 'Request forwarded for external candidate sourcing',
                      timestamp: '1 day ago',
                      date: '2024-01-14 10:15 AM'
                    },
                    {
                      type: 'comment',
                      icon: MessageSquare,
                      iconColor: 'text-blue-500',
                      iconBg: 'bg-blue-100',
                      user: 'Mike Chen',
                      userInitials: 'MC',
                      userColor: 'from-orange-400 to-red-400',
                      action: 'added a comment',
                      content: 'Checked internal resources first. Will need external recruitment support.',
                      timestamp: '2 days ago',
                      date: '2024-01-13 04:20 PM'
                    },
                    {
                      type: 'attachment',
                      icon: FileText,
                      iconColor: 'text-amber-500',
                      iconBg: 'bg-amber-100',
                      user: demand.requestedBy,
                      userInitials: demand.requestedBy.split(' ').map(n => n[0]).join(''),
                      userColor: 'from-purple-400 to-pink-400',
                      action: 'uploaded documents',
                      content: 'Project requirements.pdf, Skills matrix.xlsx',
                      timestamp: '2 days ago',
                      date: '2024-01-13 09:00 AM'
                    },
                    {
                      type: 'status',
                      icon: Circle,
                      iconColor: 'text-gray-500',
                      iconBg: 'bg-gray-100',
                      user: demand.requestedBy,
                      userInitials: demand.requestedBy.split(' ').map(n => n[0]).join(''),
                      userColor: 'from-purple-400 to-pink-400',
                      action: 'created request',
                      content: `Resource request for ${demand.roleRequired} position created`,
                      timestamp: '3 days ago',
                      date: '2024-01-12 10:30 AM'
                    },
                  ].map((activity, idx) => {
                    const Icon = activity.icon;

                    return (
                      <div
                        key={idx}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={activity.iconColor} size={20} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activity.userColor} flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}>
                                  {activity.userInitials}
                                </div>
                                <div>
                                  <p className="text-primary-dark">
                                    <span className="font-semibold">{activity.user}</span>
                                    {' '}
                                    <span className="text-secondary-gray">{activity.action}</span>
                                  </p>
                                  <p className="text-xs text-secondary-gray">{activity.date}</p>
                                </div>
                              </div>
                              <span className="text-xs text-secondary-gray whitespace-nowrap">{activity.timestamp}</span>
                            </div>

                            <div className="ml-11 bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-sm text-primary-dark">{activity.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-primary-dark mb-4">Add Comment</h3>
                  <form className="space-y-4">
                    <textarea
                      placeholder="Write a comment..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm text-secondary-gray hover:text-primary-dark border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Attach File
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm text-secondary-gray hover:text-primary-dark border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Mention User
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Send size={16} />
                        Post Comment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <RequestAlternativeModal
        isOpen={showRequestAlternativeModal}
        onClose={() => setShowRequestAlternativeModal(false)}
        currentResource={selectedResourceForAlternative}
        demand={demand}
        alternatives={selectedResourceForAlternative ? generateAlternatives(selectedResourceForAlternative) : []}
        onSelectAlternative={(resource, replacedProjectId) => {
          console.log(`Selected ${resource.name} to replace ${replacedProjectId}`);
          setShowRequestAlternativeModal(false);
        }}
      />

      {showEmailView && selectedResourceForEmail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AllocationEmailView
              resource={selectedResourceForEmail}
              demand={demand}
              onClose={() => {
                setShowEmailView(false);
                setSelectedResourceForEmail(null);
              }}
              onSend={handleEmailSend}
            />
          </div>
        </div>
      )}

      {showProfileView && selectedResourceForProfile && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => {
              setShowProfileView(false);
              setSelectedResourceForProfile(null);
            }}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-primary-dark">Resource Profile</h2>
              <button
                onClick={() => {
                  setShowProfileView(false);
                  setSelectedResourceForProfile(null);
                }}
                className="text-secondary-gray hover:text-primary-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={selectedResourceForProfile.avatar}
                  alt={selectedResourceForProfile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <h3 className="text-xl font-bold text-primary-dark">{selectedResourceForProfile.name}</h3>
                  <p className="text-secondary-gray text-sm">{selectedResourceForProfile.role}</p>
                  <p className="text-sm text-secondary-gray mt-1 flex items-center gap-1.5">
                    <Mail size={14} className="text-secondary-gray" />
                    {selectedResourceForProfile.email}
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary-dark">{String(selectedResourceForProfile.experience).replace(/\D/g, '') || '14'}</p>
                  <p className="text-xs text-secondary-gray mt-1">Years Exp.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedResourceForProfile.availability}%</p>
                  <p className="text-xs text-secondary-gray mt-1">Available</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-2xl font-bold text-primary-dark">{selectedResourceForProfile.pastPerformance}</p>
                    <span className="text-amber-400 text-lg">★</span>
                  </div>
                  <p className="text-xs text-secondary-gray mt-1">Performance</p>
                </div>
              </div>

              {/* Skill Matrix */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-primary-dark mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-dark">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  Skill Matrix
                </h3>
                <div className="space-y-4">
                  {selectedResourceForProfile.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-primary-dark">{skill.name}</span>
                        <span className="text-sm text-secondary-gray">{skill.rating}/5</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${skill.rating >= 4 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              skill.rating >= 3 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                                'bg-gradient-to-r from-orange-400 to-orange-500'
                            }`}
                          style={{ width: `${(skill.rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Allocations */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-primary-dark mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-primary-dark" />
                  Current Allocations
                </h3>
                {selectedResourceForProfile.currentAllocations.length > 0 ? (
                  <div className="space-y-3">
                    {selectedResourceForProfile.currentAllocations.map((alloc, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-primary-dark">{alloc.projectName}</p>
                            {alloc.projectCode && <p className="text-xs text-secondary-gray mt-0.5">{alloc.projectCode}</p>}
                          </div>
                          <span className="text-lg font-bold text-primary">{alloc.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${alloc.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-secondary-gray">
                          <span>{alloc.startDate} - {alloc.endDate}</span>
                          {alloc.bookingType && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${alloc.bookingType === 'soft-booked' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                              }`}>
                              {alloc.bookingType === 'soft-booked' ? 'Soft Booked' : 'Hard Booked'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl py-4 px-6 text-center">
                    <p className="text-teal-700 font-medium">No current allocations – Fully available</p>
                  </div>
                )}
              </div>

              {/* Past Project Performance */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-primary-dark mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-dark">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  Past Project Performance
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${star <= Math.floor(selectedResourceForProfile.pastPerformance)
                              ? 'text-amber-400'
                              : 'text-gray-300'
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xl font-bold text-primary-dark ml-1">{selectedResourceForProfile.pastPerformance}</span>
                  </div>
                  <p className="text-sm text-secondary-gray">Average rating from past 5 projects</p>
                </div>
              </div>

              {/* Risk Indicators (if any) */}
              {selectedResourceForProfile.riskIndicators.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-primary-dark mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-600" />
                    Risk Indicators
                  </h3>
                  <div className="space-y-2">
                    {selectedResourceForProfile.riskIndicators.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
