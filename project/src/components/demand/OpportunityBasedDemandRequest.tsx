import { useState } from 'react';
import { ArrowLeft, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import type { DemandRequest, Role, Priority, Sensitivity, AllocationPercentage } from '../../types';

interface OpportunityPosition {
  role: Role;
  skills: string[];
  count: number;
}

interface Opportunity {
  id: string;
  name: string;
  status: 'Open' | 'In Progress' | 'Assigned' | 'Low Probability' | 'Closed Lost' | 'Won';
  value: number;
  client: string;
  probability: number;
  startDate: string;
  endDate: string;
  positions?: OpportunityPosition[];
}

interface OpportunityBasedDemandRequestProps {
  onBack: () => void;
  onSubmit?: (demand: DemandRequest, opportunity?: Opportunity) => void;
}

export default function OpportunityBasedDemandRequest({
  onBack,
  onSubmit,
}: OpportunityBasedDemandRequestProps) {
  const [creatingDemands, setCreatingDemands] = useState<string | null>(null);

  const opportunities: Opportunity[] = [
    {
      id: 'opp-1',
      name: 'Phoenix CRM Implementation',
      status: 'In Progress',
      value: 450000,
      client: 'Acme Corp',
      probability: 85,
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      positions: [
        { role: 'Developer', skills: ['React', 'TypeScript', 'Node.js'], count: 2 },
        { role: 'QA', skills: ['Selenium', 'Cypress', 'Jest'], count: 1 },
        { role: 'Architect', skills: ['System Design', 'AWS', 'Microservices'], count: 1 },
      ],
    },
    {
      id: 'opp-2',
      name: 'Atlas Platform Q4 Expansion',
      status: 'Assigned',
      value: 320000,
      client: 'Global Tech Solutions',
      probability: 70,
      startDate: '2024-03-15',
      endDate: '2024-09-30',
      positions: [
        { role: 'Developer', skills: ['Python', 'Java', 'AWS'], count: 3 },
        { role: 'PM', skills: ['Agile', 'Scrum', 'JIRA'], count: 1 },
      ],
    },
    {
      id: 'opp-3',
      name: 'Legacy System Migration',
      status: 'Open',
      value: 250000,
      client: 'Heritage Financial',
      probability: 45,
      startDate: '2024-04-01',
      endDate: '2024-10-31',
      positions: [
        { role: 'Developer', skills: ['Java', 'Python'], count: 2 },
        { role: 'Architect', skills: ['System Design', 'Microservices'], count: 1 },
      ],
    },
    {
      id: 'opp-4',
      name: 'Data Analytics Platform',
      status: 'Low Probability',
      value: 180000,
      client: 'Insight Analytics Inc',
      probability: 20,
      startDate: '2024-05-01',
      endDate: '2024-11-30',
      positions: [
        { role: 'Developer', skills: ['Python', 'React'], count: 2 },
      ],
    },
  ];

  const handleCreateDemand = async (opp: Opportunity) => {
    if (!opp.positions || opp.positions.length === 0) return;

    setCreatingDemands(opp.id);

    await new Promise(resolve => setTimeout(resolve, 1000));

    opp.positions.forEach((pos) => {
      for (let i = 0; i < pos.count; i++) {
        const newDemand: DemandRequest = {
          id: `dem-${Date.now()}-${Math.random()}`,
          projectName: opp.name,
          clientName: opp.client,
          startDate: opp.startDate,
          endDate: opp.endDate,
          roleRequired: pos.role,
          requiredSkills: [...pos.skills],
          minProficiency: 3,
          allocationPercentage: 100,
          priority: 'Medium',
          budgetSensitivity: 'Medium',
          clientCriticality: 'Medium',
          notes: `Created from opportunity: ${opp.name}`,
          status: 'Open',
          createdAt: new Date().toISOString().split('T')[0],
        };

        onSubmit?.(newDemand, opp);
      }
    });

    setCreatingDemands(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Open':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Low Probability':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Closed Lost':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTotalPositions = (positions?: OpportunityPosition[]) => {
    if (!positions || positions.length === 0) return 0;
    return positions.reduce((sum, pos) => sum + pos.count, 0);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-secondary-gray hover:text-primary-dark mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark mb-2">Create Resource Request from Opportunity</h1>
        <p className="text-secondary-gray">Select an opportunity and create resource demands based on its requirements</p>
      </div>

      <div className="space-y-4">
        {opportunities.map(opp => {
          const totalPositions = getTotalPositions(opp.positions);
          const isCreating = creatingDemands === opp.id;

          return (
            <div
              key={opp.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-primary-dark">{opp.name}</h3>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(opp.status)}`}
                    >
                      {opp.status}
                    </span>
                  </div>
                  <p className="text-secondary-gray text-sm">{opp.client}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-dark">${opp.value.toLocaleString()}</div>
                  <p className="text-xs text-secondary-gray">Deal Value</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-secondary-gray">Start Date</p>
                    <p className="text-sm font-semibold text-primary-dark">{formatDate(opp.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-secondary-gray">End Date</p>
                    <p className="text-sm font-semibold text-primary-dark">{formatDate(opp.endDate)}</p>
                  </div>
                </div>
              </div>

              {opp.positions && opp.positions.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                    Required Positions ({totalPositions} total)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opp.positions.map((pos, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded text-xs font-medium"
                      >
                        {pos.count}x {pos.role}
                        <span className="text-blue-500">({pos.skills.join(', ')})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex-1 mr-4">
                  <p className="text-xs text-secondary-gray uppercase font-semibold mb-1">Win Probability</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          opp.probability >= 70
                            ? 'bg-green-500'
                            : opp.probability >= 40
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${opp.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-primary-dark min-w-fit">{opp.probability}%</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCreateDemand(opp)}
                  disabled={isCreating || !opp.positions || opp.positions.length === 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Create Demand ({totalPositions})
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
