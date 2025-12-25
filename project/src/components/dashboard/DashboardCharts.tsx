import { TrendingUp, Users, Briefcase, AlertCircle, Zap, BarChart3, DollarSign, Calendar, ChevronDown, ChevronRight, UserPlus, ClipboardCheck, Award, X, Send, MessageSquare, Brain, UserCheck, CalendarDays } from 'lucide-react';
import { useState, useMemo } from 'react';

interface RMGTask {
  id: string;
  icon: React.ReactNode;
  description: string;
  highlightText: string;
  status: 'In Progress' | 'Overdue' | 'Completed';
  dueDate: string;
}

interface RequestDetail {
  reqId: string;
  projectOpportunity: string;
  source: 'Project' | 'Opportunity';
  requestStartDate: string;
  requestEndDate: string;
  requestedBy: string;
  createdOn: string;
  dueOn: string;
  status: 'In Progress' | 'Overdue' | 'Completed';
}

export function SLAChart() {
  const [activeTab, setActiveTab] = useState<'In Progress' | 'Overdue' | 'Completed'>('In Progress');
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [selectedRequestForAction, setSelectedRequestForAction] = useState<RequestDetail | null>(null);
  const [activeModal, setActiveModal] = useState<'diagnosis' | 'forward' | 'reason' | null>(null);

  const filterOptions = ['This Week', 'This Month', 'Last Month', 'Last 3 Months', 'This Year'];

  const generateRequests = (): RequestDetail[] => {
    const projects = [
      'Phoenix CRM Implementation', 'Atlas Platform Q4 Expansion', 'Legacy System Migration',
      'Data Analytics Platform', 'Enterprise Security Audit', 'Cloud Infrastructure Setup',
      'Mobile App Development', 'API Gateway Integration', 'Database Optimization',
      'DevOps Pipeline Setup', 'Microservices Architecture', 'Payment Gateway Integration',
      'Customer Portal', 'Admin Dashboard', 'Reporting System', 'Authentication Service',
      'Notification Service', 'Email Campaign System', 'CRM Enhancement', 'E-commerce Platform'
    ];

    const opportunities = [
      'Acme Corp Digital Transformation', 'TechCo Platform Modernization', 'FinServ Cloud Migration',
      'RetailCo Omnichannel', 'Healthcare Portal', 'Manufacturing ERP', 'Logistics Optimization',
      'EdTech Platform', 'Travel Booking System', 'Real Estate Platform'
    ];

    const requestedBy = [
      'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
      'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'William Garcia', 'Mary Rodriguez'
    ];

    const statuses: Array<'In Progress' | 'Overdue' | 'Completed'> = ['In Progress', 'Overdue', 'Completed'];
    const requests: RequestDetail[] = [];

    for (let i = 0; i < 50; i++) {
      const isProject = Math.random() > 0.3;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const startDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + (Math.random() * 90 + 30) * 24 * 60 * 60 * 1000);
      const dueDate = new Date(createdDate.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000);

      requests.push({
        reqId: `REQ-${String(i + 1).padStart(4, '0')}`,
        projectOpportunity: isProject
          ? projects[Math.floor(Math.random() * projects.length)]
          : opportunities[Math.floor(Math.random() * opportunities.length)],
        source: isProject ? 'Project' : 'Opportunity',
        requestStartDate: startDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        requestEndDate: endDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        requestedBy: requestedBy[Math.floor(Math.random() * requestedBy.length)],
        createdOn: createdDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        dueOn: dueDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        status,
      });
    }

    return requests;
  };

  const allRequests = useMemo(() => generateRequests(), [timeFilter]);

  const filteredRequests = allRequests.filter(req => req.status === activeTab);

  const stats = {
    'In Progress': allRequests.filter(r => r.status === 'In Progress').length,
    'Overdue': allRequests.filter(r => r.status === 'Overdue').length,
    'Completed': allRequests.filter(r => r.status === 'Completed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'Overdue':
        return { bg: 'bg-pink-100', text: 'text-pink-600' };
      case 'Completed':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const getChartColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return '#F59E0B';
      case 'Overdue':
        return '#EF4444';
      case 'Completed':
        return '#10B981';
      default:
        return '#9CA3AF';
    }
  };

  const maxBarValue = Math.max(stats['In Progress'], stats['Overdue'], stats['Completed']);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary-dark">SLA Overview</h3>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            {timeFilter}
            <ChevronDown size={16} />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setTimeFilter(option);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${timeFilter === option ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg width="100%" height={280} viewBox="0 0 500 280" className="mx-auto" preserveAspectRatio="xMidYMid meet">
            <line x1="60" y1="220" x2="460" y2="220" stroke="#E5E7EB" strokeWidth="2" />
            <line x1="60" y1="170" x2="460" y2="170" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="60" y1="120" x2="460" y2="120" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="60" y1="70" x2="460" y2="70" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="60" y1="20" x2="460" y2="20" stroke="#E5E7EB" strokeWidth="1" />

            <text x="20" y="225" className="text-xs fill-gray-500" fontSize="11">0</text>
            <text x="10" y="175" className="text-xs fill-gray-500" fontSize="11">{Math.round(maxBarValue * 0.25)}</text>
            <text x="10" y="125" className="text-xs fill-gray-500" fontSize="11">{Math.round(maxBarValue * 0.5)}</text>
            <text x="10" y="75" className="text-xs fill-gray-500" fontSize="11">{Math.round(maxBarValue * 0.75)}</text>
            <text x="10" y="25" className="text-xs fill-gray-500" fontSize="11">{maxBarValue}</text>

            {Object.entries(stats).map(([status, value], idx) => {
              const x = 150 + idx * 120;
              const barHeight = maxBarValue > 0 ? (value / maxBarValue) * 190 : 0;
              const barColor = getChartColor(status);
              const isHovered = hoveredBar === status;

              return (
                <g key={status}>
                  <rect
                    x={x - 30}
                    y={220 - barHeight}
                    width={60}
                    height={barHeight || 2}
                    fill={barColor}
                    opacity={isHovered ? "1" : "0.85"}
                    rx="6"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredBar(status)}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{ filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none' }}
                  />

                  {isHovered && (
                    <>
                      <rect
                        x={x - 35}
                        y={220 - barHeight - 35}
                        width={70}
                        height={28}
                        fill="#1F2937"
                        rx="6"
                        opacity="0.95"
                      />
                      <text
                        x={x}
                        y={220 - barHeight - 16}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-white"
                        fontSize="12"
                      >
                        {status}
                      </text>
                    </>
                  )}

                  <text
                    x={x}
                    y={240}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-primary-dark"
                    fontSize="12"
                  >
                    {status === 'In Progress' ? 'In Progress' : status}
                  </text>

                  <text
                    x={x}
                    y={260}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-700"
                    fontSize="14"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          {(['In Progress', 'Overdue', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex items-center gap-2 pb-2 px-2 font-medium transition-colors relative ${activeTab === status
                  ? 'text-primary-dark'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span>{status}</span>
              <span className={`px-2 py-1 rounded-md text-xs font-bold ${activeTab === status
                  ? 'bg-primary-dark text-white'
                  : 'bg-gray-100 text-gray-700'
                }`}>
                {stats[status]}
              </span>
              {activeTab === status && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>
        <div className="max-h-80 overflow-y-auto overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b-2 border-gray-300">
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Req Id</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Project / Opportunity</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Source</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Start Date</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">End Date</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Requested By</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Created On</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Due On</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Status</th>
                {activeTab === 'Overdue' && (
                  <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider py-3 px-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => {
                const statusColor = getStatusColor(request.status);
                return (
                  <tr key={request.reqId} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-primary">{request.reqId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-900">{request.projectOpportunity}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${request.source === 'Project'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                        }`}>
                        {request.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-700">{request.requestStartDate}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-700">{request.requestEndDate}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-700">{request.requestedBy}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-700">{request.createdOn}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-900">{request.dueOn}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}>
                        {request.status}
                      </span>
                    </td>
                    {request.status === 'Overdue' && (
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedRequestForAction(request);
                              setActiveModal('diagnosis');
                            }}
                            title="AI Diagnosis"
                            className="p-2 text-white bg-primary hover:bg-primary/90 rounded-lg transition-all hover:scale-110 shadow-sm"
                          >
                            <Brain size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequestForAction(request);
                              setActiveModal('forward');
                            }}
                            title="Forward To TAG"
                            className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all hover:scale-110 shadow-sm"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequestForAction(request);
                              setActiveModal('reason');
                            }}
                            title="Ask Reason from RMG Coordinator"
                            className="p-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all hover:scale-110 shadow-sm"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredRequests.length} of {allRequests.length} total requests
        </div>
      </div>

      {activeModal === 'diagnosis' && selectedRequestForAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark">AI Diagnosis</h3>
                  <p className="text-sm text-gray-600">{selectedRequestForAction.reqId} - {selectedRequestForAction.projectOpportunity}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setSelectedRequestForAction(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Overdue Alert</h4>
                    <p className="text-sm text-amber-800">This request has exceeded its due date and requires immediate attention.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-primary-dark">AI Analysis Results</h4>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {/* Root Cause Analysis */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Root Cause Analysis</p>
                      <p className="text-sm text-gray-700 mt-1">Resource shortage detected for required skill sets. Current availability shows 3 matching resources but all are allocated to higher priority projects ending after this request's start date.</p>
                    </div>
                  </div>

                  {/* Matched Resources Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 ml-5">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      Matched Resources (3 Found)
                    </h5>
                    <div className="space-y-3">
                      {[
                        { name: 'Alex Thompson', role: 'Senior Developer', skills: ['React', 'Node.js', 'TypeScript'], availability: 30, currentProject: 'Phoenix CRM', endDate: '15 Jan 2025', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
                        { name: 'Sarah Mitchell', role: 'Full Stack Developer', skills: ['React', 'Python', 'AWS'], availability: 50, currentProject: 'Data Analytics', endDate: '20 Jan 2025', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
                        { name: 'James Wilson', role: 'Developer', skills: ['React', 'Java', 'MongoDB'], availability: 0, currentProject: 'Mobile App', endDate: '10 Feb 2025', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
                      ].map((resource, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <img src={resource.avatar} alt={resource.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="font-medium text-gray-900">{resource.name}</p>
                              <p className="text-xs text-gray-600">{resource.role}</p>
                              <div className="flex gap-1 mt-1">
                                {resource.skills.slice(0, 3).map((skill, sidx) => (
                                  <span key={sidx} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{skill}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${resource.availability > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {resource.availability}% Available
                            </p>
                            <p className="text-xs text-gray-500">On: {resource.currentProject}</p>
                            <p className="text-xs text-gray-500">Until: {resource.endDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottleneck Identification */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Bottleneck Identification</p>
                      <p className="text-sm text-gray-700 mt-1">Waiting for <span className="font-semibold text-amber-700">Project Manager approval</span> for more than 5 days. Multiple follow-up attempts logged but no response received.</p>
                      <button
                        onClick={() => alert('Reminder email sent to Project Manager successfully!')}
                        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        <Send size={14} />
                        Send Reminder to PM
                      </button>
                    </div>
                  </div>

                  {/* Impact Assessment with Revenue Calculation */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Impact Assessment</p>
                      <p className="text-sm text-gray-700 mt-1">High priority project risk. Delay could impact revenue worth <span className="font-bold text-red-600">$67,500</span></p>

                      {/* Revenue Loss Calculation */}
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <h6 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                          <DollarSign size={16} />
                          Revenue Loss Calculation
                        </h6>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Request Start Date</p>
                            <p className="font-semibold text-gray-900">01 Dec 2024</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Current Date</p>
                            <p className="font-semibold text-gray-900">24 Dec 2024</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Resource Staffing</p>
                            <p className="font-semibold text-gray-900">~5 days (if sourced now)</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Actual Start Date (Earliest)</p>
                            <p className="font-semibold text-amber-700">15 Jan 2025</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Total Delay Days:</span>
                            <span className="font-bold text-red-700">45 days</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Hourly Rate (Resource):</span>
                            <span className="font-semibold text-gray-900">$75/hr</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Billable Hours/Day:</span>
                            <span className="font-semibold text-gray-900">8 hrs</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Allocation %:</span>
                            <span className="font-semibold text-gray-900">50%</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-red-200 mt-2">
                            <span className="font-semibold text-red-900">Estimated Revenue Loss:</span>
                            <span className="text-xl font-bold text-red-700">$67,500</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Calculation: 45 days × 8 hrs × $75/hr × 50% = $13,500 (direct) + $54,000 (downstream impact)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h5 className="font-semibold text-emerald-900 mb-2">AI Recommendations</h5>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">1.</span>
                      <span>Escalate to TAG for immediate resource reallocation from lower priority initiatives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">2.</span>
                      <span>Consider contract resources from preferred vendor list (3-5 days onboarding time)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold mt-0.5">3.</span>
                      <span>Send escalation reminder to Project Manager through alternate channel</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Days Overdue</p>
                    <p className="text-2xl font-bold text-red-600">12</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Business Impact</p>
                    <p className="text-2xl font-bold text-amber-600">High</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Revenue at Risk</p>
                    <p className="text-2xl font-bold text-red-600">$67.5K</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setSelectedRequestForAction(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveModal('forward');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Forward To TAG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'forward' && selectedRequestForAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Send className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark">Forward To TAG</h3>
                  <p className="text-sm text-gray-600">{selectedRequestForAction.reqId} - {selectedRequestForAction.projectOpportunity}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setSelectedRequestForAction(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Escalation to Talent Allocation Group</h4>
                    <p className="text-sm text-blue-800">This action will escalate the overdue request to TAG for priority handling and resource allocation approval.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TAG Member <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Select TAG member</option>
                    <option value="john">John Smith - Senior TAG Lead</option>
                    <option value="sarah">Sarah Johnson - TAG Coordinator</option>
                    <option value="michael">Michael Brown - Regional TAG Manager</option>
                    <option value="emily">Emily Davis - Global TAG Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="high">High - Requires immediate attention</option>
                    <option value="critical">Critical - Business impact</option>
                    <option value="urgent">Urgent - Executive escalation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Escalation Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about why this request needs TAG intervention..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    defaultValue="Request has been overdue for 12 days. Resource constraints identified. High business impact with potential revenue risk of $2.5M. Requires immediate TAG intervention for resource reallocation or alternative sourcing approval."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Resolution Timeline
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="24h">Within 24 hours</option>
                    <option value="48h">Within 48 hours</option>
                    <option value="72h">Within 72 hours</option>
                    <option value="1week">Within 1 week</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">CC RMG Coordinator</p>
                      <p className="text-gray-600">Send a copy of this escalation to the RMG Coordinator for visibility</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setSelectedRequestForAction(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Escalation forwarded to TAG successfully!');
                    setActiveModal(null);
                    setSelectedRequestForAction(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Send Escalation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'reason' && selectedRequestForAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <MessageSquare className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark">Ask Reason from RMG Coordinator</h3>
                  <p className="text-sm text-gray-600">{selectedRequestForAction.reqId} - {selectedRequestForAction.projectOpportunity}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setSelectedRequestForAction(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Escalation Notice</h4>
                    <p className="text-sm text-amber-800">Request an explanation from the RMG Coordinator regarding the delay in processing this overdue allocation request.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RMG Coordinator <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Select RMG Coordinator</option>
                    <option value="lisa">Lisa Anderson - North Region</option>
                    <option value="robert">Robert Taylor - South Region</option>
                    <option value="jennifer">Jennifer Martinez - East Region</option>
                    <option value="william">William Garcia - West Region</option>
                    <option value="mary">Mary Rodriguez - Central Region</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Inquiry <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="overdue">Request is overdue - requires explanation</option>
                    <option value="no-response">No response to multiple follow-ups</option>
                    <option value="blocking">Blocking project start date</option>
                    <option value="client-escalation">Client has escalated the matter</option>
                    <option value="other">Other - specify below</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message to RMG Coordinator <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Compose your message to the RMG Coordinator..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    defaultValue={`Dear RMG Coordinator,

This is regarding the overdue resource allocation request ${selectedRequestForAction.reqId} for ${selectedRequestForAction.projectOpportunity}.

The request has exceeded its due date by 12 days and is now critical for project timeline. We have attempted multiple follow-ups but have not received any update on the status.

Could you please provide:
1. Current status of the request
2. Reason for the delay
3. Expected timeline for resolution
4. Any blockers that need to be addressed

This is becoming critical as it's impacting downstream project commitments.

Thank you for your prompt attention to this matter.`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Response Deadline
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="4h">Within 4 hours</option>
                    <option value="eod">End of business day</option>
                    <option value="24h">Within 24 hours</option>
                    <option value="48h">Within 48 hours</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">CC Project Manager</p>
                      <p className="text-gray-600">Send a copy to {selectedRequestForAction.requestedBy}</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Escalate if no response</p>
                      <p className="text-gray-600">Automatically escalate to TAG if no response received within deadline</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setSelectedRequestForAction(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Inquiry sent to RMG Coordinator successfully!');
                    setActiveModal(null);
                    setSelectedRequestForAction(null);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RMGStatusFunnel() {
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  const filterOptions = ['This Week', 'This Month', 'Last Month', 'Last 3 Month', 'This Year', 'Custom Date Range'];

  const stages = [
    { name: 'Open', count: 2680, percentage: 100, color: '#3BA9D1' },
    { name: 'Pending', count: 2430, percentage: 90.67, color: '#4B7FBD' },
    { name: 'Cancelled', count: 1620, percentage: 60.45, color: '#5D4FA5' },
    { name: 'On Hold', count: 1350, percentage: 50.37, color: '#824A9A' },
    { name: 'Assigned', count: 1080, percentage: 40.30, color: '#A82D8A' },
    { name: 'Allocated', count: 810, percentage: 30.22, color: '#D91E79' },
  ];

  const chartWidth = 100;
  const stageHeight = 50;

  const handleFilterSelect = (option: string) => {
    if (option === 'Custom Date Range') {
      setShowCustomDateModal(true);
      setShowFilterDropdown(false);
    } else {
      setTimeFilter(option);
      setShowFilterDropdown(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary-dark">RMG Status Funnel</h3>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            <CalendarDays size={16} />
            {timeFilter}
            <ChevronDown size={16} />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterSelect(option)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${timeFilter === option ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {stages.map((stage, idx) => {
          const widthPercent = stage.percentage;
          const conversionRate = idx === 0 ? 100 : ((stage.count / stages[0].count) * 100).toFixed(1);
          const dropoff = idx === 0 ? 0 : (((stages[idx - 1].count - stage.count) / stages[idx - 1].count) * 100).toFixed(1);

          return (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary-dark w-28">{stage.name}</span>
                <div className="flex-1 mx-4 relative">
                  <div className="h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center" style={{ width: `${widthPercent}%` }}>
                    <div
                      className="h-full w-full rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: stage.color,
                        opacity: 0.85,
                      }}
                    >
                      <span className="text-xs font-bold text-white">
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end w-32 text-right">
                  <span className="text-sm font-bold text-primary-dark">{stage.percentage.toFixed(1)}%</span>
                  {idx > 0 && <span className="text-xs text-red-500">-{dropoff}%</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCustomDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarDays className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary-dark">Custom Date Range</h3>
              </div>
              <button
                onClick={() => setShowCustomDateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTimeFilter('Custom Date Range');
                    setShowCustomDateModal(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SkillDeficitChart() {
  const [skillTypeFilter, setSkillTypeFilter] = useState<'Technical Skill' | 'Soft Skill' | 'Functional Skill'>('Technical Skill');
  const [showSkillTypeDropdown, setShowSkillTypeDropdown] = useState(false);

  const allSkills = {
    'Technical Skill': [
      { name: 'React', requestDemand: 45, employeeSupply: 32 },
      { name: 'Angular', requestDemand: 28, employeeSupply: 35 },
      { name: 'Vue.js', requestDemand: 22, employeeSupply: 18 },
      { name: 'Node.js', requestDemand: 40, employeeSupply: 38 },
      { name: 'Python', requestDemand: 42, employeeSupply: 28 },
      { name: 'Java', requestDemand: 35, employeeSupply: 42 },
      { name: 'C#/.NET', requestDemand: 30, employeeSupply: 25 },
      { name: 'PHP', requestDemand: 15, employeeSupply: 22 },
      { name: 'Ruby on Rails', requestDemand: 12, employeeSupply: 10 },
      { name: 'Go', requestDemand: 18, employeeSupply: 12 },
      { name: 'AWS', requestDemand: 38, employeeSupply: 25 },
      { name: 'Azure', requestDemand: 32, employeeSupply: 28 },
      { name: 'Google Cloud', requestDemand: 25, employeeSupply: 20 },
      { name: 'Docker', requestDemand: 35, employeeSupply: 30 },
      { name: 'Kubernetes', requestDemand: 28, employeeSupply: 18 },
      { name: 'DevOps', requestDemand: 30, employeeSupply: 22 },
      { name: 'CI/CD', requestDemand: 26, employeeSupply: 24 },
      { name: 'Terraform', requestDemand: 20, employeeSupply: 15 },
      { name: 'MySQL', requestDemand: 32, employeeSupply: 38 },
      { name: 'PostgreSQL', requestDemand: 28, employeeSupply: 25 },
      { name: 'MongoDB', requestDemand: 30, employeeSupply: 22 },
      { name: 'Redis', requestDemand: 18, employeeSupply: 20 },
      { name: 'GraphQL', requestDemand: 22, employeeSupply: 16 },
      { name: 'REST API', requestDemand: 45, employeeSupply: 50 },
      { name: 'Microservices', requestDemand: 30, employeeSupply: 24 },
      { name: 'Machine Learning', requestDemand: 25, employeeSupply: 15 },
      { name: 'AI/Deep Learning', requestDemand: 20, employeeSupply: 12 },
      { name: 'Data Science', requestDemand: 22, employeeSupply: 18 },
      { name: 'Big Data', requestDemand: 18, employeeSupply: 14 },
      { name: 'Spark', requestDemand: 15, employeeSupply: 10 },
      { name: 'Kafka', requestDemand: 16, employeeSupply: 12 },
      { name: 'Elasticsearch', requestDemand: 14, employeeSupply: 16 },
      { name: 'Cybersecurity', requestDemand: 24, employeeSupply: 18 },
      { name: 'Penetration Testing', requestDemand: 12, employeeSupply: 8 },
      { name: 'Blockchain', requestDemand: 10, employeeSupply: 6 },
      { name: 'iOS Development', requestDemand: 20, employeeSupply: 22 },
      { name: 'Android Development', requestDemand: 22, employeeSupply: 25 },
      { name: 'React Native', requestDemand: 18, employeeSupply: 15 },
      { name: 'Flutter', requestDemand: 16, employeeSupply: 12 },
      { name: 'SAP', requestDemand: 28, employeeSupply: 32 },
      { name: 'Salesforce', requestDemand: 24, employeeSupply: 20 },
      { name: 'ServiceNow', requestDemand: 18, employeeSupply: 15 },
      { name: 'Power BI', requestDemand: 26, employeeSupply: 22 },
      { name: 'Tableau', requestDemand: 24, employeeSupply: 28 },
      { name: 'QA Automation', requestDemand: 32, employeeSupply: 28 },
      { name: 'Selenium', requestDemand: 28, employeeSupply: 30 },
      { name: 'Jenkins', requestDemand: 22, employeeSupply: 26 },
    ],
    'Soft Skill': [
      { name: 'Communication', requestDemand: 85, employeeSupply: 92 },
      { name: 'Leadership', requestDemand: 48, employeeSupply: 42 },
      { name: 'Team Collaboration', requestDemand: 78, employeeSupply: 85 },
      { name: 'Problem Solving', requestDemand: 72, employeeSupply: 65 },
      { name: 'Critical Thinking', requestDemand: 68, employeeSupply: 58 },
      { name: 'Time Management', requestDemand: 75, employeeSupply: 70 },
      { name: 'Adaptability', requestDemand: 65, employeeSupply: 72 },
      { name: 'Conflict Resolution', requestDemand: 42, employeeSupply: 38 },
      { name: 'Emotional Intelligence', requestDemand: 55, employeeSupply: 48 },
      { name: 'Negotiation', requestDemand: 38, employeeSupply: 32 },
      { name: 'Presentation Skills', requestDemand: 52, employeeSupply: 58 },
      { name: 'Client Management', requestDemand: 45, employeeSupply: 40 },
      { name: 'Stakeholder Management', requestDemand: 48, employeeSupply: 42 },
      { name: 'Mentoring', requestDemand: 35, employeeSupply: 38 },
      { name: 'Active Listening', requestDemand: 62, employeeSupply: 68 },
    ],
    'Functional Skill': [
      { name: 'Agile/Scrum', requestDemand: 65, employeeSupply: 72 },
      { name: 'Project Management', requestDemand: 55, employeeSupply: 48 },
      { name: 'Product Management', requestDemand: 42, employeeSupply: 35 },
      { name: 'Business Analysis', requestDemand: 48, employeeSupply: 52 },
      { name: 'Requirements Gathering', requestDemand: 52, employeeSupply: 55 },
      { name: 'System Design', requestDemand: 45, employeeSupply: 35 },
      { name: 'Architecture Design', requestDemand: 38, employeeSupply: 30 },
      { name: 'UX/UI Design', requestDemand: 40, employeeSupply: 45 },
      { name: 'Technical Documentation', requestDemand: 48, employeeSupply: 42 },
      { name: 'Code Review', requestDemand: 55, employeeSupply: 60 },
      { name: 'Test Planning', requestDemand: 42, employeeSupply: 38 },
      { name: 'Release Management', requestDemand: 32, employeeSupply: 28 },
      { name: 'Risk Management', requestDemand: 35, employeeSupply: 30 },
      { name: 'Vendor Management', requestDemand: 28, employeeSupply: 32 },
      { name: 'Budget Management', requestDemand: 30, employeeSupply: 25 },
      { name: 'Compliance & Governance', requestDemand: 32, employeeSupply: 35 },
      { name: 'Change Management', requestDemand: 38, employeeSupply: 32 },
      { name: 'ITIL', requestDemand: 35, employeeSupply: 40 },
      { name: 'Six Sigma', requestDemand: 22, employeeSupply: 25 },
      { name: 'Lean Management', requestDemand: 25, employeeSupply: 22 },
    ],
  };

  const skills = allSkills[skillTypeFilter];
  const skillTypeOptions: Array<'Technical Skill' | 'Soft Skill' | 'Functional Skill'> = ['Technical Skill', 'Soft Skill', 'Functional Skill'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary-dark">Skill Deficit Analysis</h3>
        <div className="relative">
          <button
            onClick={() => setShowSkillTypeDropdown(!showSkillTypeDropdown)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            {skillTypeFilter}
            <ChevronDown size={16} />
          </button>
          {showSkillTypeDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {skillTypeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSkillTypeFilter(option);
                    setShowSkillTypeDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${skillTypeFilter === option ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 uppercase">
          <span className="w-32">Skill</span>
          <span className="w-24 text-center">Request</span>
          <span className="w-24 text-center">Employee</span>
          <span className="w-20 text-right">Status</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {skills.map((skill) => {
          const gap = skill.requestDemand - skill.employeeSupply;
          const isDeficit = gap > 0;
          const isOverskilled = gap < 0;
          const maxValue = Math.max(skill.requestDemand, skill.employeeSupply);

          return (
            <div key={skill.name} className="pb-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 w-32">{skill.name}</span>
                <span className="text-sm font-bold text-blue-600 w-24 text-center">{skill.requestDemand}</span>
                <span className="text-sm font-bold text-emerald-600 w-24 text-center">{skill.employeeSupply}</span>
                <div className="w-20 text-right">
                  {isDeficit && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                      <AlertCircle size={12} />
                      -{Math.abs(gap)}
                    </span>
                  )}
                  {isOverskilled && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                      <TrendingUp size={12} />
                      +{Math.abs(gap)}
                    </span>
                  )}
                  {gap === 0 && (
                    <span className="text-xs font-bold text-gray-600">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Request Demand</div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(skill.requestDemand / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Employee Supply</div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isDeficit ? 'bg-red-500' : isOverskilled ? 'bg-green-500' : 'bg-emerald-500'}`}
                      style={{ width: `${(skill.employeeSupply / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Under-skilled (Deficit)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Over-skilled (Surplus)</span>
          </div>
        </div>
        <span className="text-gray-600">Showing {skills.length} skills</span>
      </div>
    </div>
  );
}

export function OrgUtilization() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

  const ytdData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    values: [280000, 320000, 380000, 295000, 310000, 260000, 250000, 275000, 289570, 265000, 240000, 230000],
  };

  const regionData = [
    {
      name: 'Zifo Global',
      planned: 660,
      allocated: 455.24,
      billed: 0,
      logged: 0,
    },
    {
      name: 'BU - Europe',
      planned: 1031532,
      allocated: 85922.02,
      billed: 10110,
      logged: 1434,
    },
    {
      name: 'BU - North America',
      planned: 36600.55,
      allocated: 6107.24,
      billed: 1392,
      logged: 10,
    },
    {
      name: 'BU - Clinical',
      planned: 17002.4,
      allocated: 1756.44,
      billed: 1428,
      logged: 83,
    },
    {
      name: 'BU - Rest of the world',
      planned: 111273.77,
      allocated: 16603.25,
      billed: 6692,
      logged: 344,
    },
    {
      name: 'BU - KEBS',
      planned: 3078.76,
      allocated: 2959.95,
      billed: 11,
      logged: 20,
    },
  ];

  const totals = regionData.reduce(
    (acc, region) => ({
      planned: acc.planned + region.planned,
      allocated: acc.allocated + region.allocated,
      billed: acc.billed + region.billed,
      logged: acc.logged + region.logged,
    }),
    { planned: 0, allocated: 0, billed: 0, logged: 0 }
  );

  const maxValue = Math.max(...ytdData.values);
  const padding = { top: 30, right: 20, bottom: 40, left: 60 };

  const toggleRegion = (regionName: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionName)) {
      newExpanded.delete(regionName);
    } else {
      newExpanded.add(regionName);
    }
    setExpandedRegions(newExpanded);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary-dark">Efficiency & Utilization (Hr) - YTD</h3>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 relative">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700 font-semibold">Planned Hours</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
              <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Hours (in thousands)</span>
            </div>

            <svg width="100%" height="320" viewBox="0 0 650 320" className="overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {[0, 0.1, 0.2, 0.3, 0.4].map((tick) => {
                const chartHeight = 320;
                const chartWidth = 650;
                const innerHeight = chartHeight - padding.top - padding.bottom - 20;
                const yPos = chartHeight - padding.bottom - 20 - tick * innerHeight;

                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={yPos}
                      x2={chartWidth - padding.right}
                      y2={yPos}
                      stroke={tick === 0 ? "#9ca3af" : "#e5e7eb"}
                      strokeWidth={tick === 0 ? "1.5" : "1"}
                      strokeDasharray={tick === 0 ? "0" : "4 4"}
                    />
                    <text
                      x={padding.left - 12}
                      y={yPos}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="text-xs fill-gray-600 font-medium"
                    >
                      {Math.round(tick * maxValue / 1000)}k
                    </text>
                  </g>
                );
              })}

              {(() => {
                const chartHeight = 320;
                const chartWidth = 650;
                const innerWidth = chartWidth - padding.left - padding.right;
                const innerHeight = chartHeight - padding.top - padding.bottom - 20;
                const xScale = (index: number) => (index / (ytdData.labels.length - 1)) * innerWidth + padding.left;
                const yScale = (value: number) => chartHeight - padding.bottom - 20 - (value / maxValue) * innerHeight;

                const pathData = ytdData.values
                  .map((value, index) => {
                    const x = xScale(index);
                    const y = yScale(value);
                    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                  })
                  .join(' ');

                const areaPath = `${pathData} L ${xScale(ytdData.values.length - 1)} ${chartHeight - padding.bottom - 20} L ${padding.left} ${chartHeight - padding.bottom - 20} Z`;

                return (
                  <>
                    <path
                      d={areaPath}
                      fill="url(#areaGradient)"
                    />

                    <path
                      d={pathData}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    />

                    {ytdData.values.map((value, index) => (
                      <g key={index}>
                        <circle
                          cx={xScale(index)}
                          cy={yScale(value)}
                          r="6"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all hover:r-8"
                          onMouseEnter={() => setHoveredPoint(index)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          filter="url(#glow)"
                        />
                        {hoveredPoint === index && (
                          <>
                            <rect
                              x={xScale(index) - 45}
                              y={yScale(value) - 42}
                              width="90"
                              height="32"
                              fill="#1e293b"
                              rx="6"
                              opacity="0.95"
                            />
                            <text
                              x={xScale(index)}
                              y={yScale(value) - 30}
                              textAnchor="middle"
                              className="fill-white text-xs font-semibold"
                            >
                              {ytdData.labels[index]}
                            </text>
                            <text
                              x={xScale(index)}
                              y={yScale(value) - 16}
                              textAnchor="middle"
                              className="fill-blue-300 text-xs font-bold"
                            >
                              {formatNumber(value)} hrs
                            </text>
                          </>
                        )}
                      </g>
                    ))}

                    {ytdData.labels.map((label, index) => (
                      <text
                        key={label}
                        x={xScale(index)}
                        y={chartHeight - padding.bottom + 5}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 font-semibold"
                      >
                        {label}
                      </text>
                    ))}

                    <text
                      x={chartWidth / 2}
                      y={chartHeight - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-600 font-semibold"
                    >
                      Months (Apr 2024 - Mar 2025)
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        <div className="w-[580px] flex flex-col">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 gap-2 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 border-b border-gray-200">
              <div>Region</div>
              <div className="text-right">Planned</div>
              <div className="text-right">Allocated</div>
              <div className="text-right">Billed</div>
              <div className="text-right">Logged</div>
              <div className="text-right">Utilization %</div>
            </div>

            <div className="grid grid-cols-6 gap-2 px-4 py-3 text-sm font-bold bg-white border-b border-gray-200">
              <div className="text-red-500">TOTAL</div>
              <div className="text-right">{formatNumber(totals.planned)}</div>
              <div className="text-right">{formatNumber(totals.allocated)}</div>
              <div className="text-right">{formatNumber(totals.billed)}</div>
              <div className="text-right">{formatNumber(totals.logged)}</div>
              <div className="text-right">
                <span className={`font-bold ${totals.planned > 0
                    ? (totals.billed / totals.planned) * 100 >= 80
                      ? 'text-green-600'
                      : (totals.billed / totals.planned) * 100 >= 50
                        ? 'text-yellow-600'
                        : 'text-red-500'
                    : 'text-gray-400'
                  }`}>
                  {totals.planned > 0 ? ((totals.billed / totals.planned) * 100).toFixed(1) : '0.0'}%
                </span>
              </div>
            </div>

            <div className="max-h-[240px] overflow-y-auto">
              {regionData.map((region) => {
                const utilization = region.planned > 0 ? (region.billed / region.planned) * 100 : 0;
                return (
                  <div
                    key={region.name}
                    className="grid grid-cols-6 gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <button
                      onClick={() => toggleRegion(region.name)}
                      className="flex items-center gap-1 text-left hover:text-primary transition-colors"
                    >
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${expandedRegions.has(region.name) ? 'rotate-90' : ''
                          }`}
                      />
                      <span className="truncate">{region.name}</span>
                    </button>
                    <div className="text-right">{formatNumber(region.planned)}</div>
                    <div className="text-right">{formatNumber(region.allocated)}</div>
                    <div className="text-right">{formatNumber(region.billed)}</div>
                    <div className="text-right">{formatNumber(region.logged)}</div>
                    <div className="text-right">
                      <span className={`font-semibold ${utilization >= 80
                          ? 'text-green-600'
                          : utilization >= 50
                            ? 'text-yellow-600'
                            : 'text-red-500'
                        }`}>
                        {utilization.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResourceRequest {
  id: string;
  demandId: string;
  role: string;
  clientName: string;
  status: 'In Progress' | 'Pending Review' | 'Matched' | 'Awaiting Approval';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  skillsRequired: string[];
  lastUpdate: string;
}

interface Executive {
  id: number;
  name: string;
  department: string;
  activeRequests: ResourceRequest[];
}

export function RMGCollaboration() {
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'executive'; message: string; time: string }>>([]);

  const executives: Executive[] = [
    {
      id: 1,
      name: 'Sarah Martinez',
      department: 'North America',
      activeRequests: [
        {
          id: 'REQ-001',
          demandId: 'DEM-2024-045',
          role: 'Senior React Developer',
          clientName: 'Phoenix CRM',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2025-01-15',
          skillsRequired: ['React', 'TypeScript', 'Node.js'],
          lastUpdate: '2 hours ago',
        },
        {
          id: 'REQ-002',
          demandId: 'DEM-2024-051',
          role: 'DevOps Engineer',
          clientName: 'Atlas Platform',
          status: 'Matched',
          priority: 'Medium',
          dueDate: '2025-01-20',
          skillsRequired: ['AWS', 'Docker', 'Kubernetes'],
          lastUpdate: '5 hours ago',
        },
        {
          id: 'REQ-003',
          demandId: 'DEM-2024-062',
          role: 'UI/UX Designer',
          clientName: 'Nebula Analytics',
          status: 'Pending Review',
          priority: 'High',
          dueDate: '2025-01-12',
          skillsRequired: ['Figma', 'Adobe XD', 'User Research'],
          lastUpdate: '1 day ago',
        },
      ],
    },
    {
      id: 2,
      name: 'David Chen',
      department: 'Europe',
      activeRequests: [
        {
          id: 'REQ-004',
          demandId: 'DEM-2024-048',
          role: 'Data Scientist',
          clientName: 'Quantum Analytics',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2025-01-18',
          skillsRequired: ['Python', 'Machine Learning', 'SQL'],
          lastUpdate: '3 hours ago',
        },
        {
          id: 'REQ-005',
          demandId: 'DEM-2024-055',
          role: 'Backend Developer',
          clientName: 'Stellar Systems',
          status: 'Awaiting Approval',
          priority: 'Medium',
          dueDate: '2025-01-25',
          skillsRequired: ['Java', 'Spring Boot', 'PostgreSQL'],
          lastUpdate: '6 hours ago',
        },
      ],
    },
    {
      id: 3,
      name: 'Anna Schmidt',
      department: 'Europe',
      activeRequests: [
        {
          id: 'REQ-006',
          demandId: 'DEM-2024-059',
          role: 'QA Automation Engineer',
          clientName: 'Horizon Tech',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2025-01-16',
          skillsRequired: ['Selenium', 'Cypress', 'Jest'],
          lastUpdate: '4 hours ago',
        },
        {
          id: 'REQ-007',
          demandId: 'DEM-2024-063',
          role: 'Product Manager',
          clientName: 'Apex Solutions',
          status: 'Matched',
          priority: 'Low',
          dueDate: '2025-01-30',
          skillsRequired: ['Agile', 'Product Strategy', 'Stakeholder Management'],
          lastUpdate: '1 day ago',
        },
      ],
    },
    {
      id: 4,
      name: 'Rachel Green',
      department: 'APAC',
      activeRequests: [
        {
          id: 'REQ-008',
          demandId: 'DEM-2024-067',
          role: 'Cloud Architect',
          clientName: 'Nexus Cloud',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2025-01-14',
          skillsRequired: ['Azure', 'Cloud Security', 'Terraform'],
          lastUpdate: '1 hour ago',
        },
      ],
    },
  ];

  const handleRequestClick = (request: ResourceRequest, executive: Executive) => {
    setSelectedRequest(request);
    setSelectedExecutive(executive);
    setChatHistory([
      {
        sender: 'executive',
        message: `Hi! I'm currently working on ${request.role} position for ${request.clientName}. How can I help you?`,
        time: 'Just now',
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedRequest) return;

    const newMessage = {
      sender: 'user' as const,
      message: chatMessage,
      time: 'Just now',
    };

    setChatHistory([...chatHistory, newMessage]);

    setTimeout(() => {
      const responses = [
        `The ${selectedRequest.role} position is progressing well. I've shortlisted 3 candidates and scheduling interviews for next week.`,
        `Current status: ${selectedRequest.status}. I'm working on finalizing the resource allocation and will have an update by tomorrow.`,
        `Thanks for checking in! I've reviewed the requirements and identified potential matches. Preparing detailed profiles for your review.`,
        `Good question! The skill match is strong for ${selectedRequest.skillsRequired[0]}. I'm verifying availability with the resources now.`,
      ];

      const autoResponse = {
        sender: 'executive' as const,
        message: responses[Math.floor(Math.random() * responses.length)],
        time: 'Just now',
      };

      setChatHistory((prev) => [...prev, autoResponse]);
    }, 1000);

    setChatMessage('');
  };

  const handleCloseChat = () => {
    setSelectedRequest(null);
    setSelectedExecutive(null);
    setChatHistory([]);
    setChatMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Matched':
        return 'bg-green-100 text-green-700';
      case 'Pending Review':
        return 'bg-amber-100 text-amber-700';
      case 'Awaiting Approval':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (selectedRequest && selectedExecutive) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-[600px]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseChat}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-primary-dark">{selectedRequest.role}</h3>
              <p className="text-xs text-secondary-gray">Chat with {selectedExecutive.name}</p>
            </div>
          </div>
          <MessageSquare size={24} className="text-primary" />
        </div>

        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Demand ID</p>
              <p className="font-semibold text-primary-dark">{selectedRequest.demandId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Client</p>
              <p className="font-semibold text-primary-dark">{selectedRequest.clientName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedRequest.status)}`}>
                {selectedRequest.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Priority</p>
              <p className={`font-bold ${getPriorityColor(selectedRequest.priority)}`}>{selectedRequest.priority}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Due Date</p>
              <p className="font-semibold text-primary-dark">{selectedRequest.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Update</p>
              <p className="font-semibold text-primary-dark">{selectedRequest.lastUpdate}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-500 mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedRequest.skillsRequired.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-white text-primary text-xs font-medium rounded-md border border-blue-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${chat.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-primary-dark'} rounded-lg p-3`}>
                <p className="text-sm">{chat.message}</p>
                <p className={`text-xs mt-1 ${chat.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{chat.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about status, progress, or give suggestions..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatMessage.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary-dark">RMG Executive Collaboration</h3>
        <Zap size={24} className="text-primary" />
      </div>
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
        {executives.map((exec) => (
          <div key={exec.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary-dark text-sm">{exec.name}</p>
                  <p className="text-xs text-secondary-gray">{exec.department}</p>
                </div>
                <span className="inline-block px-2.5 py-1 bg-primary text-white rounded-full text-xs font-bold">
                  {exec.activeRequests.length} requests
                </span>
              </div>
            </div>
            <div className="p-2 space-y-2 bg-white">
              {exec.activeRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => handleRequestClick(request, exec)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all border border-gray-200 hover:border-blue-300 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary-dark group-hover:text-primary">{request.role}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{request.clientName} • {request.demandId}</p>
                    </div>
                    <MessageSquare size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`text-xs font-bold ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className="text-xs text-gray-500">Due: {request.dueDate}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BenchEmployee {
  id: string;
  name: string;
  benchStartDate: string;
  totalBenchDays: number;
  perDayCost: number;
  location: string;
  ctc: string;
}

export function BenchAgingChart() {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = ['This Week', 'This Month', 'Last Month', 'Last 3 Months', 'This Year'];

  const employeesByRange: Record<string, BenchEmployee[]> = {
    '0-30 days': [
      { id: 'EMP001', name: 'Rajesh Kumar', benchStartDate: '2024-12-01', totalBenchDays: 22, perDayCost: 2500, location: 'Bangalore', ctc: '₹9.1L' },
      { id: 'EMP002', name: 'Priya Sharma', benchStartDate: '2024-12-05', totalBenchDays: 18, perDayCost: 2800, location: 'Mumbai', ctc: '₹10.2L' },
      { id: 'EMP003', name: 'Amit Patel', benchStartDate: '2024-11-28', totalBenchDays: 25, perDayCost: 2200, location: 'Pune', ctc: '₹8.0L' },
      { id: 'EMP004', name: 'Sneha Reddy', benchStartDate: '2024-12-10', totalBenchDays: 13, perDayCost: 2600, location: 'Hyderabad', ctc: '₹9.5L' },
      { id: 'EMP005', name: 'Vikram Singh', benchStartDate: '2024-12-08', totalBenchDays: 15, perDayCost: 1800, location: 'Delhi', ctc: '₹6.6L' },
      { id: 'EMP006', name: 'Anjali Mehta', benchStartDate: '2024-12-12', totalBenchDays: 11, perDayCost: 3000, location: 'Bangalore', ctc: '₹10.9L' },
      { id: 'EMP007', name: 'Rohit Verma', benchStartDate: '2024-12-03', totalBenchDays: 20, perDayCost: 2400, location: 'Chennai', ctc: '₹8.8L' },
      { id: 'EMP008', name: 'Kavya Iyer', benchStartDate: '2024-12-15', totalBenchDays: 8, perDayCost: 2100, location: 'Kochi', ctc: '₹7.7L' },
    ],
    '30-60 days': [
      { id: 'EMP009', name: 'Manoj Kumar', benchStartDate: '2024-11-10', totalBenchDays: 43, perDayCost: 2700, location: 'Bangalore', ctc: '₹9.9L' },
      { id: 'EMP010', name: 'Deepa Nair', benchStartDate: '2024-11-05', totalBenchDays: 48, perDayCost: 2300, location: 'Mumbai', ctc: '₹8.4L' },
      { id: 'EMP011', name: 'Suresh Babu', benchStartDate: '2024-11-15', totalBenchDays: 38, perDayCost: 2900, location: 'Pune', ctc: '₹10.6L' },
      { id: 'EMP012', name: 'Lakshmi Devi', benchStartDate: '2024-11-08', totalBenchDays: 45, perDayCost: 2000, location: 'Hyderabad', ctc: '₹7.3L' },
      { id: 'EMP013', name: 'Arjun Rao', benchStartDate: '2024-11-20', totalBenchDays: 33, perDayCost: 2600, location: 'Chennai', ctc: '₹9.5L' },
    ],
    '60-90 days': [
      { id: 'EMP014', name: 'Meera Desai', benchStartDate: '2024-10-15', totalBenchDays: 69, perDayCost: 2800, location: 'Bangalore', ctc: '₹10.2L' },
      { id: 'EMP015', name: 'Karthik Menon', benchStartDate: '2024-10-10', totalBenchDays: 74, perDayCost: 2400, location: 'Mumbai', ctc: '₹8.8L' },
      { id: 'EMP016', name: 'Divya Krishnan', benchStartDate: '2024-10-20', totalBenchDays: 64, perDayCost: 2200, location: 'Pune', ctc: '₹8.0L' },
    ],
    '90+ days': [
      { id: 'EMP017', name: 'Anil Gupta', benchStartDate: '2024-09-05', totalBenchDays: 109, perDayCost: 2500, location: 'Delhi', ctc: '₹9.1L' },
      { id: 'EMP018', name: 'Pooja Jain', benchStartDate: '2024-08-28', totalBenchDays: 117, perDayCost: 2100, location: 'Bangalore', ctc: '₹7.7L' },
    ],
  };

  const benchData = [
    { range: '0-30 days', count: employeesByRange['0-30 days'].length, ctc: '₹32L', color: '#10B981' },
    { range: '30-60 days', count: employeesByRange['30-60 days'].length, ctc: '₹24L', color: '#F59E0B' },
    { range: '60-90 days', count: employeesByRange['60-90 days'].length, ctc: '₹14L', color: '#EF4444' },
    { range: '90+ days', count: employeesByRange['90+ days'].length, ctc: '₹8L', color: '#DC2626' },
  ];

  const handleRangeClick = (range: string) => {
    setSelectedRange(range);
  };

  const handleCloseTable = () => {
    setSelectedRange(null);
  };

  if (selectedRange) {
    const employees = employeesByRange[selectedRange];
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseTable}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-primary-dark">Bench Aging with Cost</h3>
              <p className="text-xs text-secondary-gray">{selectedRange} - {employees.length} employees</p>
            </div>
          </div>
          <Calendar size={24} className="text-primary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Employee Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Bench Start Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Total Bench Days</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Per Day Cost</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">CTC</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-primary-dark">{employee.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{employee.benchStartDate}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-amber-600">{employee.totalBenchDays} days</td>
                  <td className="py-3 px-4 text-sm text-gray-600">₹{employee.perDayCost.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{employee.location}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600">{employee.ctc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-semibold">
              Total Employees: {employees.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-700 font-semibold">
              Total Cost: ₹{employees.reduce((sum, emp) => sum + (emp.perDayCost * emp.totalBenchDays), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary-dark">Bench Aging with Cost</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              {timeFilter}
              <ChevronDown size={14} />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTimeFilter(option);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${timeFilter === option ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Calendar size={24} className="text-primary" />
        </div>
      </div>
      <div className="space-y-3">
        {benchData.map((item) => (
          <div key={item.range}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-gray">{item.range}</span>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => handleRangeClick(item.range)}
                  className="text-xs font-bold text-primary-dark hover:text-primary hover:underline transition-colors cursor-pointer"
                >
                  {item.count} people
                </button>
                <span className="text-xs font-bold text-amber-600">{item.ctc}</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(item.count / 18) * 100}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-xs text-red-700 font-semibold">
          Total Bench Cost: ₹78L | Average Bench Days: 45
        </p>
      </div>
    </div>
  );
}

export function MonthlyBenchBurned() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [includeSoftBooking, setIncludeSoftBooking] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const monthlyData = [
    { month: 'Jan', plan: 8, actual: 6, cost: 18 },
    { month: 'Feb', plan: 8, actual: 7, cost: 21 },
    { month: 'Mar', plan: 8, actual: 5, cost: 15 },
    { month: 'Apr', plan: 8, actual: 9, cost: 27 },
    { month: 'May', plan: 8, actual: 8, cost: 24 },
    { month: 'Jun', plan: 8, actual: 7, cost: 21 },
    { month: 'Jul', plan: 8, actual: 6, cost: 18 },
    { month: 'Aug', plan: 8, actual: 8, cost: 24 },
    { month: 'Sep', plan: 8, actual: 7, cost: 21 },
    { month: 'Oct', plan: 8, actual: 9, cost: 27 },
    { month: 'Nov', plan: 8, actual: 6, cost: 18 },
    { month: 'Dec', plan: 8, actual: 7, cost: 21 },
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.plan, d.actual)));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary-dark">Monthly Bench Burn plan vs actual</h3>
        <DollarSign size={24} className="text-primary" />
      </div>

      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Calendar size={16} />
            <span>{selectedYear}</span>
            <ChevronDown size={16} className={`transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showYearDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setShowYearDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${year === selectedYear ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                    } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSoftBooking}
            onChange={(e) => setIncludeSoftBooking(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Include Soft Booking</span>
        </label>
      </div>

      <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
        {monthlyData.map((item) => (
          <div key={item.month} className="pb-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 w-12">{item.month}</span>
              <div className="flex gap-4 items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                  <span className="text-gray-600">Plan: <span className="font-bold text-blue-600">{item.plan}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  <span className="text-gray-600">Actual: <span className="font-bold text-green-600">{item.actual}</span></span>
                </div>
                <span className="font-bold text-amber-600">₹{item.cost}L</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">Plan</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-blue-500 rounded-lg transition-all duration-300"
                    style={{ width: `${(item.plan / maxValue) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold text-gray-700">
                    {item.plan}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">Actual</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full rounded-lg transition-all duration-300 ${item.actual > item.plan ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    style={{ width: `${(item.actual / maxValue) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold text-gray-700">
                    {item.actual}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="text-xs text-gray-500">Variance:</span>
              <span className={`text-xs font-bold ${item.actual > item.plan ? 'text-red-600' : item.actual < item.plan ? 'text-green-600' : 'text-gray-600'
                }`}>
                {item.actual > item.plan ? '+' : ''}{item.actual - item.plan}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
