import { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, ChevronLeft } from 'lucide-react';
import { mockDemandRequests } from '../../data/mockData';
import DemandRequestModal from './DemandRequestModal';
import DemandSourceSelector from './DemandSourceSelector';
import type { DemandRequest, RequestStatus } from '../../types';

interface DemandDetailsListViewProps {
  onBack: () => void;
  onDemandCreated?: (demand: DemandRequest) => void;
  onSelectDemand?: (demand: DemandRequest) => void;
}

const STATUS_COLORS: Record<RequestStatus, { bg: string; text: string }> = {
  'Pending': { bg: '#FEF3C7', text: '#D97706' },
  'In Progress': { bg: '#DBEAFE', text: '#2563EB' },
  'On Hold': { bg: '#F3F4F6', text: '#6B7280' },
  'Cancelled': { bg: '#FEE2E2', text: '#DC2626' },
  'Allocated': { bg: '#DCFCE7', text: '#16A34A' },
  'Assigned': { bg: '#D1FAE5', text: '#059669' },
};

const getStatusColor = (status: RequestStatus) => {
  return STATUS_COLORS[status] || STATUS_COLORS['Pending'];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function DemandDetailsListView({ onBack, onDemandCreated, onSelectDemand }: DemandDetailsListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'All'>('All');
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'Project' | 'Opportunity' | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{priority?: string; sourceType?: string}>({});
  const [demands, setDemands] = useState<DemandRequest[]>(mockDemandRequests);

  const handleSourceSelect = (source: 'Project' | 'Opportunity') => {
    setSelectedSource(source);
    setShowSourceSelector(false);
    setIsCreateModalOpen(true);
  };

  const handleDemandCreated = (newDemand: DemandRequest) => {
    setDemands(prev => [newDemand, ...prev]);
    setIsCreateModalOpen(false);
    setShowSourceSelector(false);
    setSelectedSource(null);
    onDemandCreated?.(newDemand);
  };

  const handleExport = () => {
    const headers = ['Request ID', 'Project Name', 'Client Name', 'Priority', 'Status', 'Source Type', 'Role Required', 'Created Date'];
    const rows = filteredDemands.map(demand => [
      demand.id,
      demand.projectName,
      demand.clientName,
      demand.priority,
      demand.requestStatus,
      demand.sourceType,
      demand.roleRequired,
      demand.createdAt,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demand-requests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusCounts = useMemo(() => {
    const counts: Record<RequestStatus | 'All', number> = {
      'All': demands.length,
      'Pending': 0,
      'In Progress': 0,
      'On Hold': 0,
      'Cancelled': 0,
      'Allocated': 0,
      'Assigned': 0,
    };

    demands.forEach(d => {
      counts[d.requestStatus] = (counts[d.requestStatus] || 0) + 1;
    });

    return counts;
  }, [demands]);

  const filteredDemands = useMemo(() => {
    return demands.filter(demand => {
      const matchesSearch =
        demand.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || demand.requestStatus === selectedStatus;
      const matchesPriority = !selectedFilters.priority || demand.priority === selectedFilters.priority;
      const matchesSourceType = !selectedFilters.sourceType || demand.sourceType === selectedFilters.sourceType;

      return matchesSearch && matchesStatus && matchesPriority && matchesSourceType;
    });
  }, [searchQuery, selectedStatus, selectedFilters, demands]);

  const statusList: (RequestStatus | 'All')[] = [
    'All',
    'Pending',
    'In Progress',
    'On Hold',
    'Cancelled',
    'Allocated',
    'Assigned',
  ];

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <ChevronLeft size={20} className="text-secondary-gray" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-dark">Demand Requests</h1>
            <p className="text-secondary-gray mt-1">View and manage all resource demand requests</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-gray" />
            <input
              type="text"
              placeholder="Search by Request ID, Project..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors w-64"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} className="text-secondary-gray" />
              <span className="text-sm font-medium text-primary-dark">Filter</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">Priority</label>
                    <select
                      value={selectedFilters.priority || ''}
                      onChange={e => setSelectedFilters(prev => ({ ...prev, priority: e.target.value || undefined }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                    >
                      <option value="">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">Source Type</label>
                    <select
                      value={selectedFilters.sourceType || ''}
                      onChange={e => setSelectedFilters(prev => ({ ...prev, sourceType: e.target.value || undefined }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                    >
                      <option value="">All Sources</option>
                      <option value="Project">Project</option>
                      <option value="Opportunity">Opportunity</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedFilters({});
                        setShowFilterDropdown(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm text-secondary-gray border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilterDropdown(false)}
                      className="flex-1 px-3 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export</span>
          </button>
          <button
            onClick={() => setShowSourceSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">New Request</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto">
            {statusList.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
                }`}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Request ID</th>
                <th className="w-48 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Project / Opportunity</th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Source</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Requested By</th>
                <th className="w-28 px-4 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">Expected Closure Date</th>
                <th className="w-24 px-4 py-3 text-center text-xs font-medium text-secondary-gray uppercase tracking-wider">Request Status</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Work Location</th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Commercial Type</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Allocation Executive</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Allocation Coordinator</th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Region</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Accepted By</th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Legal Entity</th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Division</th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Sub Division</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Operation Model</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Request Start Date</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Request End Date</th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-secondary-gray uppercase tracking-wider">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDemands.length > 0 ? (
                filteredDemands.map(demand => {
                  const statusColor = getStatusColor(demand.requestStatus);
                  return (
                    <tr key={demand.id} onClick={() => onSelectDemand?.(demand)} className="hover:bg-blue-50/50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-semibold text-primary hover:underline">{demand.id}</td>
                      <td className="px-4 py-3 text-sm text-primary-dark font-medium truncate" title={demand.projectName}>{demand.projectName}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.sourceType}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.requestedBy}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray text-center">{formatDate(demand.expectedClosureDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                        >
                          {demand.requestStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.workLocation}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.commercialType}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.allocationExecutive}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.allocationCoordinator}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.region}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.acceptedBy || '—'}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.legalEntity}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.division}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.subDivision}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.operationModel}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{formatDate(demand.requestStartDate)}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{formatDate(demand.requestEndDate)}</td>
                      <td className="px-4 py-3 text-sm text-secondary-gray">{demand.customer}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={19} className="px-6 py-12 text-center">
                    <p className="text-secondary-gray">No demands found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-gray">
              Showing <strong>{filteredDemands.length}</strong> of <strong>{demands.length}</strong> demands
            </span>
          </div>
        </div>
      </div>

      <DemandSourceSelector
        isOpen={showSourceSelector}
        onClose={() => setShowSourceSelector(false)}
        onSelect={handleSourceSelect}
      />

      <DemandRequestModal
        isOpen={isCreateModalOpen}
        sourceType={selectedSource}
        existingDemands={demands}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedSource(null);
        }}
        onSubmit={handleDemandCreated}
      />
    </div>
  );
}
